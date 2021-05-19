import React from "react";
import NeoFooter from "./NeoFooter";

class NeoMapFooter extends NeoFooter {
    constructor(props) {
        super(props);
    }

    render() {
        return (<p>I'm a footer</p>);
    }
}

export default (NeoMapFooter);