import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./ServiceWorker";
import ApolloClient from "apollo-boost";
import {ApolloProvider} from "@apollo/react-hooks";
import Footer from "react-materialize/lib/Footer";
import NeoDash from "./NeoDash";

const root = document.getElementById("root");
const url = "https://github.com/nielsdejong/neodash/";
const client = new ApolloClient({uri: process.env.REACT_APP_GRAPHQL_URI});
const link = <a target={"_blank"} style={{color: 'rgb(180,180,180)'}} href={url}>NeoDash</a>
const copyrights = <div style={{textAlign: 'center', color: 'rgb(180,180,180)'}}>{link}- Neo4j Dashboard Builder</div>;
const footer = <Footer style={{backgroundColor: '#ddd'}} copyrights={copyrights}/>

const Main = () => {
    document.title = "NeoDash - Neo4j Dashboard"
    return (
        <ApolloProvider client={client}>
            <NeoDash/>
            {footer}
        </ApolloProvider>
    );
};

ReactDOM.render(<Main/>, root);
registerServiceWorker();


