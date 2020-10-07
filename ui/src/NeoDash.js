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


class NeoDash extends React.Component {
    constructor(props) {
        super(props);
        this.stateChanged = this.stateChanged.bind(this);
        this.load = this.load.bind(this);
        this.load();
    }

    load() {
        this.state = {
            key: 3,
            title: "NeoDash ⚡"
        }
        this.state.cards =
            [<NeoCard key={0} id={0} onChange={this.stateChanged} type='graph' query="CALL db.schema.visualization"/>,
                <NeoCard key={1} id={1} onChange={this.stateChanged} type='table'/>,
                <NeoCard key={2} id={2} onChange={this.stateChanged} type='json'/>,
                <AddNeoCard key={9999999} id={9999999} onClick={this.stateChanged}/>
            ]
        this.state.cardState = this.state.cards.map(c => []);
        this.stateChanged({})
    }

    stateChanged(update) {
        this.updateStateObject(update);
        this.updateSaveModal();
        this.setState(this.state);

    }

    updateStateObject(update) {
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
        let onClick = this.load;
        this.neoSaveLoadModal =
            <NeoModal header={"Edit/Export Dashboard (Copy me!)"}
                      root={document.getElementById("root")}
                      json={this.state.json}
                      placeholder={"Paste a dashboard JSON file here..."}
                      actions={[
                          <Button style={{position: 'absolute', right: '20px', top: '20px'}} modal="close"
                                  node="button"
                                  onClick={onClick}
                                  waves="green">Save</Button>
                      ]}
                      trigger={
                          <NavItem href="" onClick={e => this.stateChanged({})}>Save/Load</NavItem>
                      }
                      componentDidUpdate={function (prevProps) {
                          if (prevProps.json !== this.props.json) {
                              this.state.json = this.props.json;
                              this.setState(this.state);
                          }
                      }}
                      stateChanged={function (e) {
                          this.setState(this.state);
                          this.state.json = e.target.value;
                      }}
                      content={<Textarea style={{minHeight: '500px'}} id="Textarea-12" l={12} m={12} s={12} xl={12}
                                         onChange={this.stateChanged} value={this.state.json}
                                         placeholder={this.props.placeholder}/>}
            />;
    }

    render() {
        let title = <Textarea defaultValue={this.state.title} noLayout={true} style={{"width": '500px'}}
                              className="card-title editable-title"
                              onChange={e => this.stateChanged({
                                  label: "ReportTitleChanged",
                                  value: e.target.value
                              })}/>;

        let navbar = <Navbar alignLinks="right" brand={title} centerLogo id="mobile-nav" menuIcon={<Icon>menu</Icon>}
                             style={{backgroundColor: 'black'}}>{this.neoSaveLoadModal}
            <NavItem href="">Neo4j Settings</NavItem></Navbar>;
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