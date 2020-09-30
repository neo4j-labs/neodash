import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import ApolloClient from "apollo-boost";
import {ApolloProvider} from "@apollo/react-hooks";
import Navbar from "react-materialize/lib/Navbar";
import Container from "react-materialize/lib/Container";
import Section from "react-materialize/lib/Section";
import Row from "react-materialize/lib/Row";
import Textarea from "react-materialize/lib/Textarea";
import {AddNeoCard, NeoCard} from "./NeoCard";
import {Footer} from "react-materialize";
import NeoCardContainer from "./NeoCardContainer";

let root = document.getElementById("root");
let pagetitle = <Textarea noLayout={true} className="card-title editable-title"  defaultValue={"neodash.js ⚡"}/>;
const client = new ApolloClient({uri: process.env.REACT_APP_GRAPHQL_URI});


const Main = () => {

    return (
        <ApolloProvider client={client}>
            <Navbar style={{backgroundColor: 'black'}} brand={pagetitle} id="mobile-nav" centerLogo></Navbar>
            <NeoCardContainer/>
            {/*<Footer style={{backgroundColor: '#ddd'}}></Footer>*/}
        </ApolloProvider>
    );
};

ReactDOM.render(<Main/>, root);
registerServiceWorker();


