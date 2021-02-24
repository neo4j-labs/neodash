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
import Col from "react-materialize/lib/Col";
import NeoTextInput from "./component/NeoTextInput";
import neo4j from "neo4j-driver";
import {Checkbox} from "react-materialize";
import NeoCheckBox from "./component/NeoCheckBox";
import NeoTextButton from "./component/NeoTextButton";
import defaultDashboard from './default_dashboard.json';

class NeoDash extends React.Component {
    version = '1.0';

    constructor(props) {
        super(props);

        // Neo4j Desktop integration
        let neo4jDesktopApi = window.neo4jDesktopApi;
        if (neo4jDesktopApi) {
            let promise = neo4jDesktopApi.getContext();
            let a = this;
            promise.then(function (context) {

                let desktopIntegration = new Neo4jDesktopIntegration(context);
                let neo4j = desktopIntegration.getActiveDatabase();
                if (neo4j) {
                    a.connection = {
                        url: neo4j.connection.configuration.protocols.bolt.url,
                        database: "",
                        username: neo4j.connection.configuration.protocols.bolt.username,
                        password: neo4j.connection.configuration.protocols.bolt.password,
                        encryption:  neo4j.connection.configuration.protocols.bolt.tlsLevel === "REQUIRED" ? "on" : "off"
                    }
                    a.connect()

                } else {
                    a.updateConnectionModal(a.connect, true);
                    a.stateChanged({label:"HideError"})
                }
            });

        }

        // check the browser cache or use default values.
        this.connection = {
            url: (localStorage.getItem('neodash-url')) ? localStorage.getItem('neodash-url') : 'neo4j://localhost:7687',
            database: (localStorage.getItem('neodash-database')) ? localStorage.getItem('neodash-database') : '',
            username: (localStorage.getItem('neodash-username')) ? localStorage.getItem('neodash-username') : 'neo4j',
            password: (localStorage.getItem('neodash-password')) ? localStorage.getItem('neodash-password') : '',
            encryption: (localStorage.getItem('neodash-encryption')) ? localStorage.getItem('neodash-encryption') : 'off',
        }

        this.state = {json: '{}', count: 0}
        if (localStorage.getItem('neodash-dashboard')) {
            this.state.json = localStorage.getItem('neodash-dashboard');
        }

        this.stateChanged = this.stateChanged.bind(this);
        this.loadJson = this.loadJson.bind(this);
        this.connect = this.connect.bind(this);

        // If not running from desktop, always ask for connection details
        if (!neo4jDesktopApi) {
            this.updateConnectionModal(this.connect, true);
        }else{
            // If running from desktop, the constructor will set up a connection using the promise.
            this.stateChanged({label: "CreateError", value: "Trying to connect to your active database..."});
        }


    }

    componentDidMount() {
        this.loadJson()
    }


    connect(e) {
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


                    this.updateConnectionModal(this.connect, false);
                    this.loadJson()

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


    loadJson() {
        if (!this.connected) {
            this.state.title = 'NeoDash ⚡';
            return
        }
        if (this.state.json !== null) {
            if (this.state.json.trim() == "") {
                this.setDefaultDashboard();
                return
            }
            try {
                let loaded = JSON.parse(this.state.json)
                if (loaded.version && loaded.version !== this.version) {
                    this.stateChanged({
                        label: "CreateError",
                        value: "Invalid NeoDash version " + loaded.version + ". Dashboard was not loaded."
                    });
                    return
                }

                if (loaded.reports) {
                    this.state.title = (loaded.title) ? loaded.title : 'NeoDash ⚡';
                    this.state.editable = loaded.editable;
                    this.state.cardState = loaded.reports.map(c => []);
                    this.state.cards = loaded.reports.map((report, index) => {
                            if (report.type) {
                                return <NeoCard
                                    connection={this.connection}
                                    globalParameters={this.state.globalParameters}
                                    page={report.page} width={report.width} height={report.height}
                                    kkey={this.state.count + index} key={this.state.count + index} id={index}
                                    onChange={this.stateChanged}
                                    editable={this.state.editable}
                                    type={report.type} propertiesSelected={report.properties}
                                    title={report.title}
                                    query={report.query} parameters={report.parameters}
                                    refresh={report.refresh}/>
                            } else if (this.state.editable) {
                                return <AddNeoCard key={99999999} id={99999999} onClick={this.stateChanged}/>
                            }
                            return <div></div>
                        }
                    );
                    this.state.count = this.state.count + ((loaded.reports.length) ? loaded.reports.length : 0) - 1;
                } else {
                    this.setDefaultDashboard();
                }

                this.stateChanged({})
            } catch (e) {
                if (!this.state.cards) {
                    this.setDefaultDashboard();
                } else {
                    this.stateChanged({label: "CreateError", value: e.toString() + ". Dashboard was not loaded."});
                }
            }
        }
    }


    setDefaultDashboard() {
        let state = this.state;
        this.state.json = JSON.stringify(defaultDashboard);
        this.loadJson()
    }

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

        /**
         * propagate the list of updated global parameters to each of the reports.
         */
        if (update.label === "GlobalParameterChanged"){
            if (!this.state.globalParameters){
                this.state.globalParameters = {}
            }
            let newValue = update.value.value;
            let newKey = update.value.label;
            let newProperty = update.value.property;
            let newVar = {"neodash_movie_title": newValue};
            this.state.globalParameters = {...this.state.globalParameters, ...newVar}
            this.state.cardState.forEach(card => {
                if (card.content){
                    card.content.props.stateChanged({label: "GlobalParametersChanged", value: this.state.globalParameters})
                }
            })
        }
        if (update.label === "PasswordChanged") {
            this.connection.password = update.value;
        }
        if (update.label === "HideError"){
            this.errorModal = null;
            this.state.count += 1;
        }
        if (update.label === "CreateError") {
            let content = update.value;

            if (content.startsWith("Could not perform discovery. No routing servers available.")) {
                let encryption = this.connection.encryption;
                content = "Unable to connect to the specified Neo4j database. " +
                    "The database might be unreachable, or it does not accept " + ((encryption === "on") ? "encrypted" : "unencrypted") + " connections. " + content;

            }
            let header = (content.startsWith("Trying to connect")) ? "Connecting..." : "Error";
            if (content === "If you have questions about NeoDash, or want to build a production grade Neo4j front-end: reach out to Niels at niels.dejong@neo4j.com."){
                header = "Contact"
            }

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
            this.state.count += 1;
        }
        if (update.label === "SaveModalUpdated") {
            this.state.json = update.value;
        }
        if (update.label === "ReportTitleChanged") {
            this.state.title = update.value;
        }
        if (update.label === "CardStateChanged") {
            this.state.cardState[this.state.cards.indexOf(this.state.cards.filter(c => c.props.id === update.id)[0])] = update.state;
        }
        if (update.label === 'newCard') {
            let newCard = <NeoCard connection={this.connection}
                                   globalParameters={this.state.globalParameters}
                                   kkey={this.state.count}
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

        if (update.label === 'CardShiftLeft') {
            let card = this.state.cards.filter((card) => card.props.id === update.card.props.id)[0]
            let index = this.state.cards.indexOf(card);
            if (index != 0) {
                let otherCard = this.state.cards[index - 1];
                this.state.cards.splice(index - 1, 2, card, otherCard);

                let cardState = this.state.cardState[index];
                let otherCardState = this.state.cardState[index - 1];
                this.state.cardState.splice(index - 1, 2, cardState, otherCardState);
            }
        }
        if (update.label === 'CardShiftRight') {
            let card = this.state.cards.filter((card) => card.props.id === update.card.props.id)[0]
            let index = this.state.cards.indexOf(card);
            if (index != this.state.cards.length - 2) {
                let otherCard = this.state.cards[index + 1];
                this.state.cards.splice(index, 2);
                this.state.cards.splice(index, 0, otherCard, card);

                let cardState = this.state.cardState[index];
                let otherCardState = this.state.cardState[index + 1];
                this.state.cardState.splice(index, 2);
                this.state.cardState.splice(index, 0, otherCardState, cardState);
            }
        }
        if (update.label === 'CardDelete') {
            let card = this.state.cards.filter((card) => card.props.id === update.card.props.id)[0]
            let index = this.state.cards.indexOf(card);
            this.state.cards.splice(index, 1);
            this.state.cardState.splice(index, 1);
        }
        if (update.label !== "SaveModalUpdated") {
            this.updateSaveModal();
        }
        this.setState(this.state);
    }


    updateSaveModal() {
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
        let newJson = JSON.stringify(value, null, 2);
        this.state.json = newJson;

    }

    handleGetInTouchClick(neodash) {
        let contactMessage = "If you have questions about NeoDash, or want to build a production grade Neo4j front-end: reach out to Niels at niels.dejong@neo4j.com.";
        neodash.stateChanged({label: "CreateError", value: contactMessage})
    }


    generateSaveLoadModal(loadJson) {
        let trigger = <NavItem href="" onClick={e => this.stateChanged({})}>Load/Export</NavItem>;

        this.neoSaveLoadModal =
            <NeoModal header={"🖨 Load/Export Dashboard as JSON"}
                      root={document.getElementById("root")}
                      json={this.state.json}
                      placeholder={"Paste a dashboard JSON file here..."}
                      actions={[
                          <Button style={{position: 'absolute', right: '20px', top: '20px'}} modal="close"
                                  node="button"
                                  onClick={loadJson}
                                  waves="green">Save</Button>
                      ]}
                      trigger={
                          trigger
                      }
                      componentDidUpdate={function (prevProps) {
                          if (prevProps.json !== this.props.json) {
                              this.state.json = this.props.json;
                              localStorage.setItem('neodash-dashboard', this.state.json);
                              this.setState(this.state);
                          }
                      }}
                      stateChanged={function (e) {
                          this.setState(this.state);
                      }}
                      content={<Textarea style={{minHeight: '500px'}} id="Textarea-12" l={12} m={12} s={12} xl={12}
                                         onChange={e => {
                                             this.state.json = e.target.value;
                                             this.setState(this.state)

                                         }} value={this.state.json}
                                         placeholder={this.props.placeholder}/>}
            />;
    }


    updateConnectionModal(connect, open) {
        this.neoConnectionModal =
            <NeoModal
                header={'Connect to Neo4j'}
                style={{'maxWidth': '520px'}}
                key={this.state.count}
                id={this.state.count}
                footerType={"modal-dark-footer"}
                open={open}
                root={document.getElementById("root")}

                actions={[
                    <p>
                        NeoDash is a tool for prototyping Neo4j dashboards.
                        Building a production-grade front-end instead? &nbsp;
                        <u><a style={{color: "white"}} href="#"
                             onClick={e => this.handleGetInTouchClick(this)}>Get in touch</a></u>!
                    </p>

                ]}
                trigger={
                    <NavItem href="" onClick={e => this.stateChanged({})}>Neo4j Connection</NavItem>
                }
                content={<div className="modal-input-text" style={{margin: '20px'}}>
                    <img style={{height: '38px', right: '20px', top: '25px', position: 'absolute'}} src={"neo.png"}/>
                    <p>&nbsp;</p>
                    <form onSubmit={event => {
                        event.preventDefault();
                        connect()
                    }}>
                        <NeoTextInput onChange={this.stateChanged} changeEventLabel={"ConnectURLChanged"}
                                      style={{'width': '100%'}} label={"Connect URL"}
                                      defaultValue={this.connection.url}/>
                        <NeoTextInput onChange={this.stateChanged} changeEventLabel={"DatabaseChanged"}
                                      label={"Database"}
                                      placeholder={'neo4j'}
                                      defaultValue={this.connection.database}
                        />
                        <NeoTextInput onChange={this.stateChanged} changeEventLabel={"UsernameChanged"}
                                      label={"Username"}
                                      defaultValue={this.connection.username}/>
                        <NeoTextInput onChange={this.stateChanged} changeEventLabel={"PasswordChanged"}
                                      password={true}
                                      label={"Password"}
                                      defaultValue={this.connection.password}
                                      placeholder={''}/>
                        <div style={{marginTop: "10px"}}>

                            <NeoCheckBox onChange={this.stateChanged}
                                         changeEventLabel={"EncryptionChanged"}
                                         label={"Encrypted Connection"}
                                defaultValue={(this.connection.encryption === "on") ? "on" : "off"}>

                            </NeoCheckBox>
                            <NeoTextButton right modal="close"
                                           color={"neo-color"}
                                           icon='play_arrow'
                                           node="button"
                                           onClick={connect}
                                           text={"connect"}
                                           waves="green"></NeoTextButton>
                        </div>


                        <input style={{display: 'none'}} type="submit"/></form>

                </div>}
            />;
    }

    render() {
        this.generateSaveLoadModal(this.loadJson);
        let title = <Textarea disabled={!this.state.editable} noLayout={true}
                              style={{"width": '500px'}}
                              className="card-title editable-title"
                              key={this.state.count}
                              value={this.state.title}
                              onChange={e => this.stateChanged({
                                  label: "ReportTitleChanged",
                                  value: e.target.value
                              })}/>;
        let navbar = <Navbar alignLinks="right" brand={title} centerLogo id="mobile-nav"
                             menuIcon={<Icon>menu</Icon>}
                             style={{backgroundColor: 'black'}}>
            {this.neoSaveLoadModal}
            {this.neoConnectionModal}
        </Navbar>;
        return (
            <>
                {navbar}
                {(this.errorModal) ? this.errorModal : ""}
                <Container>
                    <div className="chart-tooltip"></div>
                    <Section>
                        <Row>
                            {this.state.cards}
                        </Row>
                    </Section>
                </Container>
            </>
        );
    }
}

class Neo4jDesktopIntegration {
    constructor(context) {
        this.desktopContext = context;
    }

    getActiveDatabase() {

        for (let pi = 0; pi < this.desktopContext.projects.length; pi++) {
            let prj = this.desktopContext.projects[pi];
            for (let gi = 0; gi < prj.graphs.length; gi++) {
                let grf = prj.graphs[gi];
                if (grf.status == 'ACTIVE') {
                    return grf;
                }
            }
        }
        return null;
    }
}

export default (NeoDash);