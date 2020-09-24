import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import ApolloClient from "apollo-boost";
import {ApolloProvider} from "@apollo/react-hooks";
import App from "./KettleLoggingTable";
import Navbar from "react-materialize/lib/Navbar";
import Container from "react-materialize/lib/Container";

const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_URI
});

let brand = <a className="brand-logo" href="#">&nbsp; Neo4j Kettle Logging Dashboard </a>;

const Main = () => (
    <ApolloProvider client={client}>
        <Navbar style={{backgroundColor: 'black'}}  brand={brand} id="mobile-nav" centerLogo>
        </Navbar>
        <Container>
            <App/>
        </Container>
    </ApolloProvider>
);

ReactDOM.render(<Main/>, document.getElementById("root"));
registerServiceWorker();


