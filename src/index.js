import React from "react";
import ReactDOM from "react-dom";
import Footer from "react-materialize/lib/Footer";
import NeoDash from "./NeoDash";

// Configurable text for the interface
const version = "1.1.2"
const readme = "https://github.com/nielsdejong/neodash/blob/master/README.md";
const appName = "NeoDash";
const title = "NeoDash - Neo4j Dashboard Builder";
const subtitle = "Neo4j Dashboard Builder";
const cacheClearedMessage = "Cache cleared. Your latest dashboard: ";

// Components for the page footer
let footerStyle = {color: "dimgrey"};
const footerLink = <u><a href={readme} style={footerStyle} target={"_blank"}>{appName} {version} - {subtitle}</a></u>
const footerCopyrights = <div style={{textAlign: 'center', color: 'dimgrey'}}>{footerLink}</div>;
const footer = <Footer style={{backgroundColor: '#ddd'}} moreLinks={footerCopyrights}/>


/**
 * This is a basic way to embed NeoDash in a webpage.
 * A minor note here is that this method provides people with a hard reset option,
 * appending a '?reset=true' to the URL will clear the browser cache if dashboards break.
 */
const Main = () => {
    document.title = title

    // Check if there's a hard reset, if yes, override everything and dump the latest dashboard JSON.
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reset') === "true") {
        let text = localStorage.getItem("neodash-dashboard");
        localStorage.removeItem("neodash-dashboard")
        return <div><p>{cacheClearedMessage}</p><code>{text}</code></div>;
    }

    return (<><NeoDash/>{footer}</>);
};

ReactDOM.render(<Main/>, document.getElementById("root"));
