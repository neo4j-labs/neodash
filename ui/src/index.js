import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import ApolloClient from "apollo-boost";
import {ApolloProvider} from "@apollo/react-hooks";
import Navbar from "react-materialize/lib/Navbar";
import Container from "react-materialize/lib/Container";
import Section from "react-materialize/lib/Section";
import Col from "react-materialize/lib/Col";
import Row from "react-materialize/lib/Row";
import Textarea from "react-materialize/lib/Textarea";
import Graph from './NeoGraphVis'
import NeoTable from "./NeoTable";
import {AddNeoCard, NeoCard} from "./NeoCard";
import {Footer} from "react-materialize";

let root = document.getElementById("root");
let pagetitle = <Textarea noLayout={true} className="card-title editable-title"
                          defaultValue={"neodash.js ⚡"}/>;
const client = new ApolloClient({uri: process.env.REACT_APP_GRAPHQL_URI});

let data =
    [
        {'Store':'LDN','date': '9-3-2020',  'Person': 'Jim', 'Food': 'Chicken', 'Price ($)': 5.20},
        {'Store':'END','Day': '10-3-2020','Person': 'Bob', 'Food': 'Ham', 'Price ($)': 2.00},
        {'Store':'END','Day': '10-3-2020','Person': 'Alice', 'Food': 'Noodles', 'Price ($)': 1.50},
        {'Store':'LDN','Day': '11-3-2020','Person': 'Anna', 'Food': 'Noodles', 'Price ($)': 2.50},
        {'Store':'END','Day': '11-3-2020','Person': 'Kenny', 'Food': 'Beer', 'Price ($)': 8.60}
    ]

let cards = <>
        <NeoCard data={data} size='small' report='table' />
        <NeoCard data={data} size='small' report='table' />
        <NeoCard data={data} size='small' report='table' />
        <NeoCard data={data} size='small' report='graph' />
        <NeoCard data={data} size='small' report='graph' />
        <NeoCard data={data} size='small' report='table' />
        <AddNeoCard/></>;

const Main = () => {

    return (
        <ApolloProvider client={client}>
            <Navbar style={{backgroundColor: 'black'}} brand={pagetitle} id="mobile-nav" centerLogo></Navbar>
            <Container>
                <Section>
                    <Row>
                        {cards}
                    </Row>
                </Section>
            </Container>
            <Footer style={{backgroundColor: '#ddd'}}></Footer>
        </ApolloProvider>
    );
};

ReactDOM.render(<Main/>, root);
registerServiceWorker();


