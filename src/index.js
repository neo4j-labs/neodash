import React from "react";
import ReactDOM from "react-dom";
import Footer from "react-materialize/lib/Footer";
import NeoDash from "./NeoDash";
import appLogo from './logo.png'

const root = document.getElementById("root");
const url = "https://github.com/nielsdejong/neodash/";
const link = <u><a href={"https://github.com/nielsdejong/neodash/blob/master/README.md"} style={{color: "dimgrey"}}
                   target={"_blank"}>NeoDash 1.0.5 - Neo4j Dashboard Builder</a></u>
const copyrights = <div style={{textAlign: 'center', color: 'dimgrey'}}>{link}</div>;
const footer = <Footer style={{backgroundColor: '#ddd'}} moreLinks={copyrights}></Footer>
const logo = () => {
    return (<div className="logo"><img src={appLogo} alt="logo"/></div>)
}

const Main = () => {

    document.title = "NeoDash - Neo4j Dashboard Builder"

    // hard reset option - append a '?reset=true' to the URL if dashboards break.
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const reset = params.get('reset');
    if (reset === "true") {
        let text = localStorage.getItem("neodash-dashboard");
        localStorage.removeItem("neodash-dashboard")
        return <div><p>Cache cleared. Your latest dashboard:</p><code>{text}</code></div>
    }
    var neoDash = <NeoDash/>;


    return (
        <>{neoDash}{footer}</>
    );
};




ReactDOM.render(<Main/>, root);
