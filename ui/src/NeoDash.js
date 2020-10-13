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


class NeoDash extends React.Component {
    version = '1.0';

    constructor(props) {
        super(props);
        this.state = {json: '{}', count: 0}
        this.stateChanged = this.stateChanged.bind(this);
        this.loadJson = this.loadJson.bind(this);
    }

    componentDidMount() {
        this.loadJson()
    }

    connect(e) {

    }

    loadJson() {
        console.log(this.state)
        if (this.state.json) {
            try {
                let loaded = JSON.parse(this.state.json)


                if (loaded.version && loaded.version !== this.version) {
                    this.stateChanged({
                        label: "CreateError",
                        value: "Invalid NeoDash version " + loaded.version + ". Dashboard was not loaded."
                    });
                    return
                }
                this.state = {
                    key: loaded.reports ?  loaded.reports.length : 0,
                    title:(loaded.title) ? loaded.title : 'NeoDash ⚡',
                    count: this.state.count + ((this.state.cards) ? this.state.cards.length : 0)
                };


                if (loaded.reports) {

                    this.state.cardState = loaded.reports.map(c => []);
                    this.state.cards = loaded.reports.map((report, index) => {
                            if (report.type) {
                                // let page = (report.type === 'graph') ? index + this.state.count : 1;
                                return <NeoCard page={1} width={report.width} height={report.height}
                                                key={this.state.count + index} id={index}
                                                onChange={this.stateChanged}
                                                type={report.type} properties={report.properties} title={report.title}
                                                query={report.query} params={report.parameters} refresh={report.refresh}/>
                            } else {
                                return <AddNeoCard key={99999999} id={99999999} onClick={this.stateChanged}/>
                            }
                        }
                    );
                    this.state.count += 1;
                } else {
                    this.state.cards =
                        [<NeoCard page={1} width={12} height={4} key={0} id={0} onChange={this.stateChanged}
                                  type='graph'
                                  query="CALL db.schema.visualization"/>,
                            <NeoCard page={1} width={4} height={4} key={1} id={1} onChange={this.stateChanged}
                                     type='table'/>,
                            <NeoCard page={1} width={4} height={4} key={2} id={2} onChange={this.stateChanged}
                                     type='json'/>,
                            <AddNeoCard key={9999999} id={9999999} onClick={this.stateChanged}/>
                        ]
                    this.state.cardState = this.state.cards.map(c => []);
                }

                this.stateChanged({})
            } catch (e) {
                this.stateChanged({label: "CreateError", value: e.toString() + ". Dashboard was not loaded."});
            }
        }
    }

    stateChanged(update) {
        if (update.label === "CreateError") {
            this.errorModal = <NeoModal header={"Error"}
                                        style={{'maxWidth': '550px'}}
                                        open={true}
                                        trigger={null}
                                        content={<p>{update.value}</p>}
                                        key={this.state.count}
                                        root={document.getElementById("root")}
                                        actions={[
                                            <Button flat modal="close"
                                                    node="button"
                                                    waves="red">Close</Button>
                                        ]}/>
            this.state.count += 1;
        }
        this.updateStateObject(update);
        if (update.label !== "SaveModalUpdated") {
            this.updateSaveModal();
        }
        this.setState(this.state);
    }

    updateStateObject(update) {
        console.log(update)
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
            let newCard = <NeoCard id={this.state.key} key={this.state.key} onChange={this.stateChanged} type='table'/>;
            this.state.key += 1;
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
    }

    updateSaveModal() {
        let value = {
            "title": this.state.title,
            "version": "1.0",
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

    generateModals(loadJson, connect) {
        let trigger = <NavItem href="" onClick={e => this.stateChanged({})}>Save/Load</NavItem>;

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

        this.neoConnectionModal =
            <NeoModal header={"📶 Neo4j Connection Settings"}
                      style={{'maxWidth': '520px'}}
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
                      content={<div class="modal-input-text" style={{margin: '20px'}}>
                          <p>&nbsp;</p>
                          <NeoTextInput onChange={this.stateChanged} changeEventLabel={"CypherParamsChanged"}
                                        style={{'width': '100%'}} label={"Connect URL"}
                                        placeholder={'neo4j://localhost:7687'}/>
                          <NeoTextInput onChange={this.stateChanged} changeEventLabel={"CypherParamsChanged"}
                                        label={"Database"}
                                        placeholder={'neo4j'}/>
                          <NeoTextInput onChange={this.stateChanged} changeEventLabel={"CypherParamsChanged"}
                                        label={"Username"}
                                        placeholder={'neo4j'}/>
                          <NeoTextInput onChange={this.stateChanged} changeEventLabel={"CypherParamsChanged"}
                                        password={true}
                                        label={"Password"}
                                        placeholder={''}/></div>}
            />;
    }

    render() {
        this.generateModals(this.loadJson, this.connect);
        let title = <Textarea defaultValue={this.state.title} noLayout={true} style={{"width": '500px'}}
                              className="card-title editable-title"
                              key={this.state.count}
                              value={this.state.title}
                              onChange={e => this.stateChanged({
                                  label: "ReportTitleChanged",
                                  value: e.target.value
                              })}/>;
        console.log(this.errorModal)
        let navbar = <Navbar alignLinks="right" brand={title} centerLogo id="mobile-nav" menuIcon={<Icon>menu</Icon>}
                             style={{backgroundColor: 'black'}}>
            {this.neoSaveLoadModal}
            {this.neoConnectionModal}
            {(this.errorModal) ? this.errorModal : ""}
        </Navbar>;
        return (
            <>
                {navbar}
                <Container>
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