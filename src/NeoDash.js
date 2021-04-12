import React from "react";
import Section from "react-materialize/lib/Section";
import Row from "react-materialize/lib/Row";
import Container from "react-materialize/lib/Container";
import {AddNeoCard, NeoCard} from "./card/NeoCard";
import Navbar from "react-materialize/lib/Navbar";
import Icon from "react-materialize/lib/Icon";
import NeoModal from "./component/NeoModal";
import Textarea from "react-materialize/lib/Textarea";
import NavItem from "react-materialize/lib/NavItem";
import Button from "react-materialize/lib/Button";
import neo4j from "neo4j-driver";
import defaultDashboard from './data/default_dashboard.json';
import DesktopIntegration from './tools/DesktopIntegration';
import NeoSaveLoadModal from "./component/NeoSaveLoadModal";
import NeoConnectionModal from "./component/NeoConnectionModal";


/**
 * Main class for the NeoDash dashboard builder component.
 *
 * This component handles:
 * - Connecting to Neo4j (through a Neo4j Desktop integration or manually)
 * - Loading/storing dashboards as JSON (optionally from the browser cache)
 * - The creation, ordering and deleting of the NeoCard components.
 * - Propagating global parameter changes ("Selection" reports) to each of the cards.
 */
class NeoDash extends React.Component {
    version = '1.0';

    /**
     * Set up the NeoDash component.
     * If run from Neo4j Desktop, try to connect to the latest active database.
     */
    constructor(props) {
        super(props);
        this.stateChanged = this.stateChanged.bind(this);
        this.createCardsFromLatestState = this.createCardsFromLatestState.bind(this);
        this.connect = this.connect.bind(this);
        this.onConnectionHelpClicked = this.onConnectionHelpClicked.bind(this);

        // Attempt to load an existing dashboard state from the browser cache.
        this.loadDashboardfromBrowserCache();

        if (window.neo4jDesktopApi) {
            // Set the connection details from the Neo4j Desktop integration API.
            this.setConnectionDetailsFromDesktopIntegration();
        } else {
            // check the browser cache or use default connection values.
            this.setConnectionDetailsFromBrowserCache();
        }

    }

    /**
     * Tries to set the state of NeoDash based on the latest browser cache.
     * If no cache is available, set an empty state.
     */
    loadDashboardfromBrowserCache() {
        this.state = {json: '{}', count: 0}
        if (localStorage.getItem('neodash-dashboard')) {
            this.state.json = localStorage.getItem('neodash-dashboard');
        }
    }

    /**
     * Sets the connection details based on the data in the browser cache (if available).
     * Else, defaults to localhost:7867.
     */
    setConnectionDetailsFromBrowserCache() {
        this.connection = {
            url: (localStorage.getItem('neodash-url')) ? localStorage.getItem('neodash-url') : 'neo4j://localhost:7687',
            database: (localStorage.getItem('neodash-database')) ? localStorage.getItem('neodash-database') : '',
            username: (localStorage.getItem('neodash-username')) ? localStorage.getItem('neodash-username') : 'neo4j',
            password: (localStorage.getItem('neodash-password')) ? localStorage.getItem('neodash-password') : '',
            encryption: (localStorage.getItem('neodash-encryption')) ? localStorage.getItem('neodash-encryption') : 'off',
        }
        this.createConnectionModal(this.connect, true);
        this.stateChanged({label: "HideError"})
    }

    /**
     * Attempts to set the connection details using the Neo4j Desktop integration.
     * If NeoDash is running from Desktop, find the first active database and connect to it.
     * If no databases are active, default to a manually specified connection (possibly from browser cache)
     */
    setConnectionDetailsFromDesktopIntegration() {
        let promise = window.neo4jDesktopApi.getContext();
        let neodash = this;
        promise.then(function (context) {
            let neo4jDesktopIntegration = new DesktopIntegration(context);
            let connection = neo4jDesktopIntegration.connection;
            if (connection) {
                neodash.connection = connection;
                neodash.stateChanged({label: "CreateError", value: "Trying to connect to your active database..."});
                neodash.connect();
            } else {
                neodash.setConnectionDetailsFromBrowserCache();
            }
        });
    }

    /**
     * After mounting, create the card components based on the latest state.
     */
    componentDidMount() {
        this.createCardsFromLatestState()
    }


    /**
     * Will try to connect to Neo4j given the specified connection parameters.
     * On failure, will produce an error message and show it to the user.
     */
    connect() {
        try {
            var url = this.connection.url;
            if (!(url.startsWith("bolt://") || url.startsWith("bolt+routing://") || url.startsWith("neo4j://"))) {
                url = "neo4j://" + url;
            }
            let config = {
                encrypted: (this.connection.encryption === "on") ? 'ENCRYPTION_ON' : 'ENCRYPTION_OFF'
            };

            var driver = neo4j.driver(
                url,
                neo4j.auth.basic(this.connection.username, this.connection.password), config)
            ;
            this.session = driver.session({database: this.connection.database});
            this.session
                .run('return true;')
                .then(result => {
                    this.errorModal = null;
                    this.connected = true;
                    this.createConnectionModal(this.connect, false);
                    this.createCardsFromLatestState()
                    localStorage.setItem('neodash-database', this.connection.database);
                    localStorage.setItem('neodash-url', this.connection.url);
                    localStorage.setItem('neodash-username', this.connection.username);
                    localStorage.setItem('neodash-password', this.connection.password.toString());
                    localStorage.setItem('neodash-encryption', this.connection.encryption);


                })
                .catch(error => {
                    this.stateChanged({
                        label: "CreateError",
                        value: error['message']
                    });
                });
        } catch (error) {
            this.stateChanged({
                label: "CreateError",
                value: error['message']
            });
        }
    }


    /**
     * Create cards for the dashboard based on the latest state.
     * If no state is available, set the default dashboard.
     */
    createCardsFromLatestState() {
        if (!this.connected) {
            // If no connection is available, set the title to 'NeoDash' and do not create cards.
            this.state.title = 'NeoDash ⚡';
            return
        }
        // If a dashboard JSON file is available, then:
        if (this.state.json !== null) {
            // If the loaded JSON is empty, set the default dashboards.
            if (this.state.json.trim() === "") {
                this.setDefaultDashboard();
                return
            }
            // If a JSON string is available, try to parse it and set the state.
            try {
                let loaded = JSON.parse(this.state.json)
                if (loaded.version && loaded.version !== this.version) {
                    this.stateChanged({
                        label: "CreateError",
                        value: "Invalid NeoDash version " + loaded.version + ". Dashboard was not loaded."
                    });
                    return
                }

                // Create the card components based on the 'reports' array of the JSON object.
                if (loaded.reports) {
                    this.state.title = (loaded.title) ? loaded.title : 'NeoDash ⚡';
                    this.state.editable = loaded.editable;
                    this.state.cardState = loaded.reports.map(c => []);
                    this.state.cards = loaded.reports.map((report, index) => {
                            if (report.type) {
                                return <NeoCard
                                    connection={this.connection}
                                    globalParameters={this.state.globalParameters}
                                    page={report.page}
                                    width={report.width}
                                    height={report.height}
                                    kkey={this.state.count + index}
                                    key={this.state.count + index}
                                    id={index}
                                    session={this.session}
                                    onChange={this.stateChanged}
                                    editable={this.state.editable}
                                    type={report.type}
                                    propertiesSelected={report.properties}
                                    title={report.title}
                                    query={report.query}
                                    parameters={report.parameters}
                                    refresh={report.refresh}/>
                            } else if (this.state.editable) {
                                // a loaded report without a type is a "Add new card" button.
                                return <AddNeoCard key={99999999} id={99999999} onClick={this.stateChanged}/>
                            }
                            return <div/>
                        }
                    );
                    // Increment counter to refresh components.
                    this.state.count = this.state.count + ((loaded.reports.length) ? loaded.reports.length : 0) - 1;
                } else {
                    this.setDefaultDashboard();
                }

                this.stateChanged({})
            } catch (e) {
                // If we're unable to parse a JSON state from the text, set the default dashboard.
                if (!this.state.cards) {
                    this.setDefaultDashboard();
                } else {
                    this.stateChanged({label: "CreateError", value: e.toString() + ". Dashboard was not loaded."});
                }
            }
        }
    }

    /**
     * Sets a default dashboard based on a predefined file.
     */
    setDefaultDashboard() {
        this.state.json = JSON.stringify(defaultDashboard);
        this.createCardsFromLatestState()
    }

    /**
     * Handles any updates to the dashboard.
     * Functionality is called based on the update label passed to it.
     * @param update - a JSON dictionary {update, label} describing the change that was made.
     */
    stateChanged(update) {
        if (update.label === "ConnectURLChanged") {
            this.connection.url = update.value;
        }
        if (update.label === "DatabaseChanged") {
            this.connection.database = update.value;
        }
        if (update.label === "EncryptionChanged") {
            this.connection.encryption = update.value;
        }
        if (update.label === "UsernameChanged") {
            this.connection.username = update.value;
        }
        if (update.label === "GlobalParameterChanged") {
            this.updateGlobalParametersForAllCards(update);
        }
        if (update.label === "PasswordChanged") {
            this.connection.password = update.value;
        }
        if (update.label === "HideError") {
            this.errorModal = null;
            this.state.count += 1;
        }
        if (update.label === "CreateError") {
            this.createPopUpModal(update.value);
            this.state.count += 1;
        }
        if (update.label === "SaveModalUpdated") {
            this.state.json = update.value;
        }
        if (update.label === "DashboardTitleChanged") {
            this.state.title = update.value;
        }
        if (update.label === "CardStateChanged") {
            this.state.cardState[this.state.cards.indexOf(this.state.cards.filter(c => c.props.id === update.id)[0])] = update.state;
        }
        if (update.label === 'newCard') {
            this.createCard();
        }
        if (update.label === 'CardShiftLeft') {
            this.shiftCardLeft(update);
        }
        if (update.label === 'CardShiftRight') {
            this.shiftCardRight(update);
        }
        if (update.label === 'CardDelete') {
            this.removeCard(update);
        }
        if (update.label !== "SaveModalUpdated") {
            this.buildJSONFromReportsState();
        }
        this.setState(this.state);
    }

    /**
     * Move a selected card to the left.
     * In other words, switch the card with the card that comes before it in the dashboard's card array.
     */
    shiftCardLeft(update) {
        let card = this.state.cards.filter((card) => card.props.id === update.card.props.id)[0]
        let index = this.state.cards.indexOf(card);
        if (index !== 0) {
            let otherCard = this.state.cards[index - 1];
            this.state.cards.splice(index - 1, 2, card, otherCard);

            let cardState = this.state.cardState[index];
            let otherCardState = this.state.cardState[index - 1];
            this.state.cardState.splice(index - 1, 2, cardState, otherCardState);
        }
    }

    /**
     * Move a selected card to the right.
     * In other words, switch the card with the card that comes after it in the dashboard's card array.
     */
    shiftCardRight(update) {
        let card = this.state.cards.filter((card) => card.props.id === update.card.props.id)[0]
        let index = this.state.cards.indexOf(card);
        if (index !== this.state.cards.length - 2) {
            let otherCard = this.state.cards[index + 1];
            this.state.cards.splice(index, 2);
            this.state.cards.splice(index, 0, otherCard, card);

            let cardState = this.state.cardState[index];
            let otherCardState = this.state.cardState[index + 1];
            this.state.cardState.splice(index, 2);
            this.state.cardState.splice(index, 0, otherCardState, cardState);
        }
    }

    /**
     * Creates a card at the end of the dashboard's card array.
     */
    createCard() {
        let newCard = <NeoCard connection={this.connection}
                                        globalParameters={this.state.globalParameters}
                                        kkey={this.state.count}
                                        session={this.session}
                                        width={4} height={4}
                                        id={this.state.count}
                                        editable={this.state.editable}
                                        key={this.state.count}
                                        onChange={this.stateChanged} type='table'/>;
        this.state.count += 1;
        this.state.cards.splice(this.state.cards.length - 1, 0, newCard);
        this.state.cardState.splice(this.state.cardState.length - 1, 0, {
            "title": "",
            "width": 4,
            "height": 4,
            "type": "table",
            "query": "",
            "page": 1,
            "propertiesSelected": [],
            "parameters": {},
            "refresh": 3600
        });
    }

    /**
     * Removes a card from the dashboard's card array.
     */
    removeCard(update) {
        let card = this.state.cards.filter((card) => card.props.id === update.card.props.id)[0]
        let index = this.state.cards.indexOf(card);
        this.state.cards.splice(index, 1);
        this.state.cardState.splice(index, 1);
    }

    /**
     * propagate the list of updated global parameters to each of the reports.
     * This is intended to be used for when a user updates the selected value in a 'Selection' card,
     * and we want all report cards that use the parameter to be updated.
     */
    updateGlobalParametersForAllCards(update) {
        if (!this.state.globalParameters) {
            this.state.globalParameters = {}
        }
        let newGlobalParameterValue = update.value.value;
        let label = update.value.label;
        let property = update.value.property;
        let propertyId = (update.value.propertyId) ? "_" + update.value.propertyId : "";
        let newGlobalParameter = "neodash_" + this.toLowerCaseSnakeCase(label) +
            "_" + this.toLowerCaseSnakeCase(property) + propertyId;

        if (newGlobalParameterValue !== "") {
            this.state.globalParameters[newGlobalParameter] = newGlobalParameterValue;
        } else {
            delete this.state.globalParameters[newGlobalParameter];
        }
        this.state.cardState.forEach(card => {
            if (card.content) {
                card.content.props.stateChanged({
                    label: "GlobalParametersChanged",
                    value: this.state.globalParameters
                })
            }
        })
    }

    /**
     * Helper function to convert a string with capital letters and spaces to lowercase snake case.
     */
    toLowerCaseSnakeCase(value) {
        return value.toLowerCase().replace(/ /g, "_");
    }

    /**
     * Creates a pop-up window (Modal). Used for displaying errors and other notifications.
     */
    createPopUpModal(content) {
        let header = "Error";
        const data = this.handleSpecialCaseErrors(content, header);
        content = data.content;
        header = data.header;

        // Create the modal object
        this.errorModal = <NeoModal header={header}
                                    style={{'maxWidth': '550px'}}
                                    open={true}
                                    trigger={null}
                                    content={<p>{content}</p>}
                                    key={this.state.count}
                                    id={this.state.count}
                                    root={document.getElementById("root")}
                                    actions={[
                                        <Button flat modal="close"
                                                node="button"
                                                waves="red">Close</Button>
                                    ]}/>
    }

    /**
     * Changes the pop-up header and/or content for special types of pop-ups.
     */
    handleSpecialCaseErrors(content, header) {
        // Special case 1: we're connecting to a database from Neo4j Desktop.
        if (content.startsWith("Trying to connect")) {
            header = "Connecting...";
        }
        if (content.startsWith("To save a dashboard")) {
            header = "Saving and Loading Dashboards";
        }

        // Special case 2: we're dealing with connection errors.
        if (content.startsWith("Could not perform discovery. No routing servers available.")) {
            let encryption = this.connection.encryption;
            header = "Connection Error"
            content = "Unable to connect to the specified Neo4j database. " +
                "The database might be unreachable, or it does not accept " +
                ((encryption === "on") ? "encrypted" : "unencrypted") + " connections. " + content;

        }
        // Special case 3: we're dealing with someone clicking the 'Get in touch' button.
        if (content === "If you have questions about NeoDash, or want to build a production grade Neo4j front-end: " +
            "reach out to Niels at niels.dejong@neo4j.com.") {
            header = "Contact"
        }
        return {content, header};
    }

    /**
     * Converts the current state of the dashboard into a JSON string.
     * This string can then be exported and saved in browser cache.
     */
    buildJSONFromReportsState() {
        if (!this.connected) {
            return
        }

        let value = {
            "title": this.state.title,
            "version": "1.0",
            "editable": this.state.editable,
            "reports": this.state.cardState.map(q => {
                return {
                    title: q.title,
                    width: q.width,
                    height: q.height,
                    type: q.type,
                    query: q.query,
                    page: q.page,
                    properties: q.propertiesSelected,
                    parameters: q.parameters,
                    refresh: q.refresh
                }
            })
        };
        this.state.json = JSON.stringify(value, null, 2);

    }

    /**
     * Save a dashboard in browser cache.
     */
    saveDashboardInBrowserCache() {
        return function (prevProps) {
            if (prevProps.json !== this.props.json) {
                this.state.json = this.props.json;
                localStorage.setItem('neodash-dashboard', this.state.json);
                this.setState(this.state);
            }
        };
    }

    /**
     * Create a modal (pop-up) that's used for saving/loading/exporting dashboards as JSON.
     */
    createSaveLoadModal(loadJson) {
        let trigger = <NavItem href="" onClick={e => this.stateChanged({})}>Load/Export</NavItem>;
        return <NeoSaveLoadModal json={this.state.json}
                                 loadJson={loadJson}
                                 trigger={trigger}
                                 onQuestionMarkClicked={this.onConnectionHelpClicked}
                                 value={this.state.json}
                                 placeholder={this.props.placeholder}
                                 change={e => {
                                     this.state.json = e.target.value;
                                     this.setState(this.state)
                                 }}
                                 update={this.saveDashboardInBrowserCache()}
                                 stateChanged={e => {
                                     this.setState(this.state)
                                 }}
        />;
    }

    /**
     *
     * @param connect - method used for opening the connection.
     * @param open - whether the modal is open by default.
     */
    createConnectionModal(connect, open) {
        this.neoConnectionModal = <NeoConnectionModal
            key={(this.state) ? this.state.count : 0}
            open={open}
            connect={connect}
            connection={this.connection}
            stateChanged={this.stateChanged}
            navClicked={e => this.stateChanged({})}
            onConnect={this.onConnectClicked(connect)}
            onGetInTouchClicked={this.onGetInTouchClicked()}
        />
    }

    /**
     * Creates the navigation bar of the dashboard.
     */
    createDashboardNavbar(saveLoadModal) {
        let title = <Textarea disabled={!this.state.editable} noLayout={true}
                              style={{"width": '500px'}}
                              className="card-title editable-title"
                              key={this.state.count}
                              value={this.state.title}
                              onChange={e => this.stateChanged({
                                  label: "DashboardTitleChanged",
                                  value: e.target.value
                              })}/>;
        return <Navbar alignLinks="right" brand={title} centerLogo id="mobile-nav"
                       menuIcon={<Icon>menu</Icon>}
                       style={{backgroundColor: 'black'}}>
            {saveLoadModal}
            {this.neoConnectionModal}
        </Navbar>;
    }

    /**
     * Action to take place after 'connect' is clicked in the connection modal.
     */
    onConnectClicked(connect) {
        return event => {
            event.preventDefault();
            connect()
        };
    }

    /**
     * Action to take place after 'get in touch' is clicked in the connection modal.
     */
    onGetInTouchClicked() {
        let value = "If you have questions about NeoDash, or want to build a production grade Neo4j front-end: " +
            "reach out to Niels at niels.dejong@neo4j.com.";
        return e => this.stateChanged({
            label: "CreateError",
            value: value
        });
    }

    /**
     * Action to take place after the question mark is clicked in the load/load modal.
     */
    onConnectionHelpClicked() {
        let value = "To save a dashboard, copy the JSON data and store it somewhere on your computer. \n To load a dashboard, clear the textbox and paste in your saved JSON text.";
        this.stateChanged({
            label: "CreateError",
            value: value
        });
    }

    /**
     * Creates the container holding the card components.
     */
    createCardsContainer() {
        return <Container>
            <div className="chart-tooltip"/>
            <Section>
                <Row>
                    {this.state.cards}
                </Row>
            </Section>
        </Container>;
    }

    /**
     * Renders the dashboard with the following components:
     * - a navbar at the top.
     * - if present, an error modal showing a message.
     * - a list of reports.
     */
    render() {
        let saveLoadModal = this.createSaveLoadModal(this.createCardsFromLatestState);
        let navbar = this.createDashboardNavbar(saveLoadModal);
        let errorModal = (this.errorModal) ? this.errorModal : "";
        let cardsContainer = this.createCardsContainer();
        return (
            <>{navbar}{errorModal}{cardsContainer}</>
        );
    }
}


export default (NeoDash);