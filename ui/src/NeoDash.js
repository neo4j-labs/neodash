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


class NeoDash extends React.Component {
    version = '1.0';

    constructor(props) {
        super(props);
        this.connection = {
            url: (localStorage.getItem('neodash-url')) ? localStorage.getItem('neodash-url') : 'neo4j://localhost:7687',
            database: (localStorage.getItem('neodash-database')) ? localStorage.getItem('neodash-database') : '',
            username: (localStorage.getItem('neodash-username')) ? localStorage.getItem('neodash-username') : 'neo4j',
            password: (localStorage.getItem('neodash-password')) ? localStorage.getItem('neodash-password') : '',
        }

        this.state = {json: '{}', count: 0}
        if (localStorage.getItem('neodash-dashboard')) {
            this.state.json = localStorage.getItem('neodash-dashboard');
        }

        this.stateChanged = this.stateChanged.bind(this);
        this.loadJson = this.loadJson.bind(this);
        this.connect = this.connect.bind(this);
        this.updateConnectionModal(this.connect, true);
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
            var driver = neo4j.driver(
                url,
                neo4j.auth.basic(this.connection.username, this.connection.password)
            );
            this.session = driver.session({database: this.connection.database});
            this.session
                .run('return true;')
                .then(result => {
                    this.connected = true;
                    localStorage.setItem('neodash-database', this.connection.database);
                    localStorage.setItem('neodash-url', this.connection.url);
                    localStorage.setItem('neodash-username', this.connection.username);
                    localStorage.setItem('neodash-password', this.connection.password.toString());

                    this.updateConnectionModal(this.connect, false);
                    this.loadJson()
                })
                .catch(error => {
                    this.updateConnectionModal(this.connect, true);
                    this.stateChanged({
                        label: "CreateError",
                        value: error['message']
                    });
                });
        } catch (error) {
            this.updateConnectionModal(this.connect, true);
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
        fetch("http://localhost:3000/default_dashboard.json")
            .then(response => response.text())
            .then((jsonData) => {
                state.json = jsonData;
                this.loadJson()

            }).catch((error) => {
            // handle your errors here
            alert(error)
        })
    }

    stateChanged(update) {
        if (update.label === "ConnectURLChanged") {
            this.connection.url = update.value;
        }
        if (update.label === "DatabaseChanged") {
            this.connection.database = update.value;
        }
        if (update.label === "UsernameChanged") {
            this.connection.username = update.value;
        }
        if (update.label === "PasswordChanged") {
            this.connection.password = update.value;
        }
        if (update.label === "CreateError") {
            let content = update.value;
            if (content.startsWith("Could not perform discovery. No routing servers available.")) {
                content = "Unable to connect to the specified Neo4j database. " + content;
            }
            this.errorModal = <NeoModal header={"Error"}
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
            let newCard = <NeoCard connection={this.connection} kkey={this.state.count} width={4} height={4}
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
                open={open}
                root={document.getElementById("root")}

                actions={[
                    <Button flat modal="close"
                            node="button"
                            onClick={connect}
                            waves="green">Connect</Button>
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
                        <input style={{display: 'none'}} type="submit"/></form>
                    <p>*your credentials are only stored in your local browser cache.</p>
                </div>}
            />;
    }

    render() {
        this.generateSaveLoadModal(this.loadJson);
        let title = <Textarea disabled={!this.state.editable} defaultValue={this.state.title} noLayout={true}
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


export default (NeoDash);