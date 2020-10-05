import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import ApolloClient from "apollo-boost";
import {ApolloProvider} from "@apollo/react-hooks";
import Navbar from "react-materialize/lib/Navbar";
import Textarea from "react-materialize/lib/Textarea";
import NeoDash from "./card/NeoDash";
import NeoSaveLoadModal from "./component/NeoSaveLoadModal";
import NeoButton from "./component/NeoButton";
import Button from "react-materialize/lib/Button";
import Icon from "react-materialize/lib/Icon";
import NavItem from "react-materialize/lib/NavItem";
import Footer from "react-materialize/lib/Footer";

let root = document.getElementById("root");

const client = new ApolloClient({uri: process.env.REACT_APP_GRAPHQL_URI});



const Main = () => {

    document.title = "Neodash - Neo4j Dashboard"

    return (

        <ApolloProvider client={client}>
            <NeoDash/>
            <Footer copyrights={"NeoDash v1.0"} style={{backgroundColor: '#ddd'}}></Footer>
        </ApolloProvider>
    );
};

ReactDOM.render(<Main/>, root);
registerServiceWorker();


