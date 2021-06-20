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
import {Preloader} from "react-materialize";
import Tabs from "react-materialize/lib/Tabs";
import Tab from "react-materialize/lib/Tab";
import NeoTextInput from "./component/NeoTextInput";
import TextInput from "react-materialize/lib/TextInput";
import Card from "react-materialize/lib/Card";
import NeoTextButton from "./component/NeoTextButton";
import NeoShareModal from "./component/NeoShareModal";
import {JSONCrush} from "jsoncrush";


/**
 * Main class for the NeoDash dashboard builder component.
 *
 * This component handles:
 * - Connecting to Neo4j (through a Neo4j Desktop integration or manually)
 * - Loading/storing dashboards as JSON (optionally from the browser cache)
 * - The creation, ordering and deleting of the NeoCard components.
 * - Propagating global parameter changes ("Selection" reports) to each of the cards.
 *
 * TODO: in many places we're modifying state directly. This is not a good practise, and should be refactored.
 */
class NeoDash extends React.Component {
    version = '1.1';

    /**
     * Set up the NeoDash component.
     * If run from Neo4j Desktop, try to connect to the latest active database.
     */
    constructor(props) {
        super(props);
        this.stateChanged = this.stateChanged.bind(this);
        this.createCardObjectsFromDashboardState = this.createCardObjectsFromDashboardState.bind(this);
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

        let urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("url") !== null) {
            this.state.jsonToLoad = urlParams.get("url");
            try {
                this.state.connectionToLoad = JSON.parse(atob(urlParams.get("connection")));
            } catch {
                // Unable to parse encoded JSON, don't set a connection
                this.state.connectionToLoad = null;
            }
            this.createExternalDashboardLoadPopupModal();
            this.stateChanged({})
            // String representations of the data to load, as encoded in hte URL.

        } else {
            this.createConnectionModal(this.connect, true);
            this.stateChanged({label: "HideError"})
        }
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
        this.createCardObjectsFromDashboardState()
        // TODO - remove this hack to get rid of duplicate connection modals being shown
        this.removeDuplicateConnectionModal();
    }


    removeDuplicateConnectionModal() {
        var select = document.getElementById('root');
        if (select.childNodes.length == 11) {
            select.removeChild(select.childNodes.item(2));
        }

    }

    /**
     * Will try to connect to Neo4j given the specified connection parameters.
     * On failure, will produce an error message and show it to the user.
     */
    connect() {
        try {
            this.connected = false;
            var url = this.connection.url;

            // When specifying an encrypted connection, we don't need the bolt+s / neo4j+s scheme.
            if (this.connection.encryption === "on" && url.startsWith("bolt+s://")){
                url = url.replace("bolt+s://", "bolt://")
                this.connection.url = url;
            }
            if (this.connection.encryption === "on" && url.startsWith("neo4j+s://")){
                url = url.replace("neo4j+s://", "neo4j://")
                this.connection.url = url;
            }

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
                    this.createCardObjectsFromDashboardState()
                    localStorage.setItem('neodash-database', this.connection.database);
                    localStorage.setItem('neodash-url', this.connection.url);
                    localStorage.setItem('neodash-username', this.connection.username);
                    localStorage.setItem('neodash-password', this.connection.password.toString());
                    localStorage.setItem('neodash-encryption', this.connection.encryption);

                    if (this.confirmation) {
                        this.confirmation = false;
                        this.stateChanged({
                            label: "CreateError",
                            value: "Dashboard loaded! You are connected to " + this.connection.url + "."
                        })
                    }

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
        } finally {

        }
        if (!this.connected) {
            this.createConnectionModal(this.connect, true);
            // TODO - this can produce duplicate connection modals
        }
    }


    /**
     * Create cards for the dashboard based on the latest state.
     * If no state is available, set the default dashboard.
     */
    createCardObjectsFromDashboardState() {
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
                let loaded = this.parseJson(this.state.json);
                if (loaded.version && loaded.version !== this.version) {
                    this.stateChanged({
                        label: "CreateError",
                        value: "Invalid NeoDash version " + loaded.version + ". Dashboard was not loaded."
                    });
                    return
                }
                this.setPageStateFromLoadedJson(loaded);
                this.generateDashboardCardComponents(loaded);

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

    parseJson(text) {
        let loaded = JSON.parse(text);
        // Quietly auto-upgrade to Neodash 1.1...
        if (this.version === "1.1" && loaded.version === "1.0") {
            this.upgradeDashboardJson(loaded);
        }
        return loaded;
    }

    upgradeDashboardJson(loaded) {
        loaded.version = "1.1";
        loaded.pages = [
            {
                title: "Page 1",
                reports: loaded.reports
            }
        ]
    }

    setPageStateFromLoadedJson(loaded) {
        this.state.pageTitles = loaded.pages.map((page) => {
            return page.title
        });

        this.state.pagenumber = loaded.pagenumber ? loaded.pagenumber : 0;
        this.state.pageState = loaded.pages.map((page) => {
            return page.reports.map((report, index) => {
                return {
                    connection: this.connection,
                    globalParameters: this.state.globalParameters,
                    page: report.page,
                    width: report.width,
                    height: report.height,
                    kkey: this.state.count + index,
                    key: this.state.count + index,
                    id: index,
                    session: this.session,
                    onChange: this.stateChanged,
                    editable: this.state.editable,
                    type: report.type,
                    propertiesSelected: report.properties,
                    title: report.title,
                    query: report.query,
                    parameters: report.parameters,
                    refresh: report.refresh
                }
            })
        })
    }

    generateDashboardCardComponents(loaded) {
        let pagenumber = this.state.pagenumber;
        let reportsForPage = loaded.pages[pagenumber].reports;
        if (reportsForPage) {
            this.state.title = (loaded.title) ? loaded.title : 'NeoDash ⚡';
            this.state.editable = loaded.editable;
            this.state.cards = reportsForPage.map((report, index) => {
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
            this.state.cards = this.state.cards.filter((v, i) => !(v.key === "99999999" && i !== this.state.cards.length - 1));
            // Increment counter to refresh components.
            this.state.count = this.state.count + ((reportsForPage.length) ? reportsForPage.length : 0) - 1;
            this.stateChanged({label: "Refresh"});
        } else {
            this.setDefaultDashboard();
        }
    }

    /**
     * Sets a default dashboard based on a predefined file.
     */
    setDefaultDashboard() {
        this.state.json = JSON.stringify(defaultDashboard);
        this.createCardObjectsFromDashboardState()
    }

    /**
     * Handles any updates to the dashboard.
     * Functionality is called based on the update label passed to it.
     * @param update - a JSON dictionary {update, label} describing the change that was made.
     */
    stateChanged(update) {
        console.log(update.label)
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
        if (update.label === "AddPage") {
            // Adds a new page & switches to the new page
            this.state.pageState.push([{}])
            this.state.pageTitles.push("new page")
            this.buildJSONFromReportsState();

        }

        if (update.label === "LoadExternalDashboard") {
            fetch(this.state.jsonToLoad)
                .then(response => response.text())
                .then((data) => {
                    // this.stateChanged({label: "HideError"})
                    // this.createExternalDashboardLoadPopupModal()
                    let parsedJson = this.parseJson(data);
                    this.state.json = data;
                    this.externalLoaded = true;
                    // this.buildJSONFromReportsState();
                    // console.log(this.state.connectionToLoad)
                    if (this.state.connectionToLoad) {
                        this.connection = this.state.connectionToLoad;
                        console.log(this.connection)
                        if (this.connection.password) {
                            this.confirmation = true;
                            this.connect();
                            return;
                        }
                    }

                    this.stateChanged({
                        label: "CreateError",
                        value: "Dashboard loaded! You can now connect to Neo4j."
                    })
                    this.stateChanged({label: "OpenConnectionModal"})
                    var select = document.getElementById('root');
                    // TODO - remove duplicate modal
                    // select.removeChild(select.childNodes.item(9));


                }).catch(error => {
                this.createConnectionModal(this.connect, true)
                this.stateChanged({label: "CreateError", value: error.toString()})

            })
        }
        if (update.label === "OpenConnectionModal") {
            this.createConnectionModal(this.connect, true)
        }

        if (update.label === "AskForDeletePage") {
            this.createPageDeletionPopupModal();
            this.state.count += 1;
        }
        if (update.label === "DeletePage") {
            if (this.state.pageState.length <= 1) {
                this.stateChanged({
                    label: "CreateError",
                    value: "You cannot delete the only page of a dashboard."
                })
                this.state.count += 1;
                return
            }
            this.state.pageState.splice(this.state.pagenumber, 1);
            this.state.pageTitles.splice(this.state.pagenumber, 1);
            if (this.state.pagenumber > this.state.pageState.length - 1) {
                this.state.pagenumber = this.state.pageState.length - 1;
            }
            this.buildJSONFromReportsState();
            let loaded = JSON.parse(this.state.json)
            this.generateDashboardCardComponents(loaded)
            this.state.count += 1;
        }
        if (update.label === "PageChanged") {
            let tabClicked = null;
            if (update.value.tagName === "INPUT") {
                tabClicked = update.value.parentNode.parentNode.parentNode;

            } else if (update.value.className === "input-field") {
                tabClicked = update.value.parentNode.parentNode;
            }
            if (tabClicked == null) {
                return;
            }
            let index = Array.from(tabClicked.parentNode.children).indexOf(tabClicked);
            if (this.state.pagenumber === index) {
                return;
            }
            this.state.pagenumber = index;
            let loaded = JSON.parse(this.state.json)
            this.generateDashboardCardComponents(loaded);

        }
        if (update.label === "PageTitleChanged") {
            let tabClicked = update.value.parentNode.parentNode.parentNode;
            let index = Array.from(tabClicked.parentNode.children).indexOf(tabClicked);
            this.state.pageTitles[index] = update.value.value;
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
            this.state.pageState[this.state.pagenumber][this.state.cards.indexOf(this.state.cards.filter(c => c.props.id === update.id)[0])] = update.state;
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
        if (update.label === "ShareLinkURLChanged") {
            this.state.shareURL = encodeURIComponent(update.value);
            this.createShareURLConnectionDetails();
        }

        if (update.label === "ShareLinkCredentialsChanged") {
            this.saveCredentialsInShareLink = !this.saveCredentialsInShareLink;
            this.createShareURLConnectionDetails();
            if (!this.saveCredentialsInShareLink) {
                this.state.shareURLConnectionDetails = null;
            }
        }
        if (update.label === "ShareLinkPasswordChanged") {
            this.savePasswordInShareLink = !this.savePasswordInShareLink;
            this.createShareURLConnectionDetails();

        }

        if (update.label === "ShareLinkGenerated") {
            this.createShareURLConnectionDetails();
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

            let cardState = this.state.pageState[this.state.pagenumber][index];
            let otherCardState = this.state.pageState[this.state.pagenumber][index - 1];
            this.state.pageState[this.state.pagenumber].splice(index - 1, 2, cardState, otherCardState);
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

            let cardState = this.state.pageState[this.state.pagenumber][index];
            let otherCardState = this.state.pageState[this.state.pagenumber][index + 1];
            this.state.pageState[this.state.pagenumber].splice(index, 2);
            this.state.pageState[this.state.pagenumber].splice(index, 0, otherCardState, cardState);
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
        this.state.pageState[this.state.pagenumber].splice(this.state.pageState[this.state.pagenumber].length - 1, 0, {
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
        this.state.pageState[this.state.pagenumber].splice(index, 1);
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
        this.state.pageState[this.state.pagenumber].forEach(card => {
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
    createPageDeletionPopupModal() {
        let header = "Delete Page";
        let content = "Are you sure you want to delete the current page? This cannot be undone.";


        // Create the modal object
        this.errorModal = <NeoModal header={header}
                                    open={true}
                                    trigger={null}
                                    content={<p>{content}</p>}
                                    key={this.state.count}
                                    id={this.state.count}
                                    root={document.getElementById("root")}
                                    actions={[
                                        <Button flat modal="close"
                                                node="button"
                                                waves="red">Cancel</Button>,
                                        <NeoTextButton right modal="close"
                                                       color={"white-color"}
                                                       icon='delete'
                                                       node="button"
                                                       modal="close"
                                                       style={{backgroundColor: "red"}}
                                                       onClick={e => this.stateChanged({
                                                           label: "DeletePage",
                                                           value: e.target.value
                                                       })}
                                                       text={"delete"}
                                                       waves="red"/>
                                    ]}/>
    }

    /**
     * Creates a pop-up window (Modal). Used for displaying errors and other notifications.
     */
    createExternalDashboardLoadPopupModal() {
        let header = "NeoDash - Loading Dashboard";
        let displayURL = (this.state.jsonToLoad.length > 100) ?
            this.state.jsonToLoad.substring(0, 100) + "..." : this.state.jsonToLoad;

        let content = <div>
            <p>You are loading a dashboard from: </p>
            <b><a href={this.state.jsonToLoad} target={"_blank"}>{displayURL}</a></b>
            {(this.state.connectionToLoad) ?
                <p>You will be connected to <b>{this.state.connectionToLoad.url}</b>.</p> : <></>
            }
            <p>This will overwrite your current dashboard (if present). Continue?</p>
        </div>


        // Create the modal object
        this.errorModal = <NeoModal header={header}
                                    open={true}
                                    trigger={null}
                                    content={content}
                                    key={this.state.count}
                                    id={this.state.count}
                                    root={document.getElementById("root")}
                                    actions={[
                                        <Button flat modal="close"
                                                node="button"
                                                onClick={e => this.stateChanged({label: "OpenConnectionModal"})}
                                                waves="red">Cancel</Button>,
                                        <NeoTextButton right modal="close"
                                                       color={"white-color"}
                                                       icon='play_arrow'
                                                       node="button"
                                                       modal="close"
                                                       style={{backgroundColor: "green"}}
                                                       onClick={e => {
                                                           this.stateChanged({label: "HideError"})
                                                           this.stateChanged({label: "LoadExternalDashboard"})
                                                       }
                                                       }
                                                       text={"load"}
                                                       waves="green"/>
                                    ]}/>
    }

    /**
     * Creates a pop-up window (Modal). Used for displaying errors and other notifications.
     */
    createPopUpModal(content) {
        let header = "Error";
        const data = this.handleSpecialCaseErrors(content, header);
        content = data.content;
        header = data.header;
        let style = data.style;

        // Create the modal object
        this.errorModal = <NeoModal header={header}
                                    style={style}
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
        var style = {}

        // Special case 1: we're connecting to a database from Neo4j Desktop.
        if (content.startsWith("Trying to connect")) {
            header = "Connecting...";
        }
        if (content.startsWith("Dashboard loaded!")) {
            header = "Dashboard loaded 🎉";
        }
        if (content.startsWith("To save a dashboard")) {
            header = "Saving and Loading Dashboards";
            style = {paddingBottom: "650px"}
        }

        // Special case 2: we're dealing with connection errors.
        if (content.startsWith("Could not perform discovery. No routing servers available.")) {
            let encryption = this.connection.encryption;
            header = "Connection Error"
            content = "Unable to connect to the specified Neo4j database. " +
                "The database might be unreachable, or it does not accept " +
                ((encryption === "on") ? "encrypted" : "unencrypted") + " connections. " + content;
            this.state.page += 1;

        }
        // Special case 3: we're dealing with someone clicking the 'Get in touch' button.
        if (content.startsWith("If you have questions about NeoDash")) {
            header = "Contact"
        }
        return {content, header, style};
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
            "version": "1.1",
            "editable": this.state.editable,
            "pagenumber": (this.state.pagenumber) ? this.state.pagenumber : 0,
            "pages": this.state.pageState.map((p, pagenumber) => {
                return {
                    "title": this.state.pageTitles[pagenumber],
                    "reports": this.state.pageState[pagenumber].map(q => {
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
        let trigger = <NavItem href="" onClick={e => this.stateChanged({})}>Save/Load</NavItem>;
        return <NeoSaveLoadModal json={this.state.json}
                                 loadJson={loadJson}
                                 trigger={trigger}
                                 onQuestionMarkClicked={this.onConnectionHelpClicked}
                                 onCancel={e => this.stateChanged({})}
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
     * Create a modal (pop-up) that's used for saving/loading/exporting dashboards as JSON.
     */
    createShareModal(loadJson) {
        let trigger = <NavItem href="#">Share</NavItem>;
        return <NeoShareModal json={this.props.json}
                              loadJson={loadJson}
                              trigger={trigger}
                              connection={this.saveCredentialsInShareLink}
                              password={this.savePasswordInShareLink}
                              onQuestionMarkClicked={this.onConnectionHelpClicked}
                              onCancel={e => this.stateChanged({})}
                              value={this.state.shareURL}
                              connectionValue={this.state.shareURLConnectionDetails}
                              placeholder={this.props.placeholder}
                              change={e => {
                                  this.state.json = e.target.value;
                                  this.setState(this.state)
                              }}
                              stateChanged={this.stateChanged}
        />;
    }


    createShareURLConnectionDetails() {
        if (this.saveCredentialsInShareLink) {
            let password = (this.savePasswordInShareLink) ? this.connection.password : "";
            let connection =
                {
                    url: this.connection.url,
                    username: this.connection.username,
                    password: password,
                    database: this.connection.database,
                    encryption: this.connection.encryption
                }
            this.state.shareURLConnectionDetails = btoa(JSON.stringify(connection));
        }
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
            nfavClicked={e => this.stateChanged({})}
            onConnect={this.onConnectClicked(connect)}
            onGetInTouchClicked={this.onGetInTouchClicked()}
        />
    }


    /**
     * Creates the navigation bar of the dashboard.
     */
    createDashboardNavbar(saveLoadModal, shareModal) {
        let dashboardTitle = <Textarea disabled={!this.state.editable} noLayout={true}
                                       className="card-title editable-title"
                                       key={this.state.count}
                                       value={this.state.title}
                                       onChange={e => this.stateChanged({
                                           label: "DashboardTitleChanged",
                                           value: e.target.value
                                       })}/>;

        // if the page titles are loaded, build the list of tabs
        let tabslist = (this.state.pageTitles) ? this.state.pageTitles.map((t, i) => {
            let deletePageButton = <Button className="btn-floating btn-remove-tab"
                                           onClick={e => {
                                               if (this.state.editable) this.stateChanged({
                                                   label: "AskForDeletePage",
                                                   value: "delete"
                                               })
                                           }}><Icon>close</Icon></Button>;
            return <Tab active={this.state.pagenumber === i} className="white-text  tab-page" options={{
                duration: 300,
                onShow: null,
                responsiveThreshold: Infinity,
                swipeable: false
            }} title={<><TextInput noLayout={true}
                                   className="card-page-nav editable-page-nav tabs tab"
                                   key={i}
                                   value={t ? t : ""}
                                   onChange={e => {
                                       if (this.state.editable) {
                                           this.stateChanged({
                                               label: "PageTitleChanged",
                                               value: e.target
                                           })
                                       }
                                   }}/> {(this.state.pagenumber === i) ? deletePageButton : <></>}</>}>
            </Tab>
        }) : [];

        let addNewTab = <Tab disabled className="white-text" options={{
            duration: 300,
            onShow: null,
            responsiveThreshold: Infinity,
            swipeable: false
        }} title={<Button className="btn-floating btn-add-tab"
                          onClick={e => this.stateChanged({
                              label: "AddPage",
                              value: e.target
                          })}><Icon>add</Icon></Button>}>
        </Tab>

        let tabs = (this.state.pageTitles) ? <Tabs className="tabs-transparent tabs-grey"
                                                   onChange={e => this.stateChanged({
                                                       label: "PageChanged",
                                                       value: e.target
                                                   })}>
            {tabslist}{(this.state.editable) ? addNewTab : <></>}
        </Tabs> : <></>;

        return <Navbar alignLinks="right" brand={dashboardTitle} centerLogo id="mobile-nav"
                       menuIcon={<Icon>menu</Icon>}
                       options={{
                           draggable: true,
                           edge: 'left',
                           inDuration: 250,
                           onCloseEnd: null,
                           onCloseStart: null,
                           onOpenEnd: null,
                           onOpenStart: null,
                           outDuration: 200,
                           preventScrolling: true
                       }}
                       extendWith={
                           tabs
                       }
                       style={{backgroundColor: '#111'}}>
            {saveLoadModal}{shareModal}
            {(this.neoConnectionModal) ? this.neoConnectionModal : <div></div>
            }
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
        let value = "If you have questions about NeoDash, or need help building a production grade Neo4j front-end: " +
            "reach out to me at niels.dejong@neo4j.com.";
        return e => this.stateChanged({
            label: "CreateError",
            value: value
        });
    }

    /**
     * Action to take place after the question mark is clicked in the load/load modal.
     */
    onConnectionHelpClicked() {
        let value = "To save a dashboard, copy the JSON data and store it somewhere on your computer. \n " +
            "To load a dashboard, clear the textbox and paste in your saved JSON text. \n \n" +
            "To reset your dashboard, clear the textbox and click the load button.";
        this.stateChanged({
            label: "CreateError",
            value: value
        });
    }

    /**
     * Creates the container holding the card components.
     */
    createCardsContainer() {
        if (this.state.cards == null || this.state.cards.length == 0) {
            return <center><br/><br/><br/><Preloader style="text-align: center;" color="green"
                                                     size={"large"}/><br/><br/><br/></center>
        }
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
        let saveLoadModal = this.createSaveLoadModal(this.createCardObjectsFromDashboardState);
        let shareModal = this.createShareModal(this.createCardObjectsFromDashboardState);
        let cardsContainer = this.createCardsContainer()
        let navbar = this.createDashboardNavbar(saveLoadModal, shareModal);
        let errorModal = (this.errorModal) ? this.errorModal : "";
        var select = document.getElementById('root');
        return (
            <>{navbar}{errorModal}{cardsContainer}</>
        );

    }
}


export default (NeoDash);