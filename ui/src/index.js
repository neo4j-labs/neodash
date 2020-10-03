import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import ApolloClient from "apollo-boost";
import {ApolloProvider} from "@apollo/react-hooks";
import Navbar from "react-materialize/lib/Navbar";
import Textarea from "react-materialize/lib/Textarea";
import NeoCardContainer from "./card/NeoCardContainer";

let root = document.getElementById("root");
let pagetitle = <Textarea noLayout={true} className="card-title editable-title" defaultValue={"Neodash ⚡"}/>;
const client = new ApolloClient({uri: process.env.REACT_APP_GRAPHQL_URI});


const Main = () => {
    document.title = "Neodash - Neo4j Dashboard"
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


