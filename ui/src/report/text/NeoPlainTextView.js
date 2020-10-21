import React from "react";
import Textarea from "react-materialize/lib/Textarea";
import NeoReport from "../NeoReport";

class NeoPlainTextView extends NeoReport {
    constructor(props) {
        super(props);
    }

    render() {
        let rendered = super.render();
        if (rendered) {
            return rendered;
        }
        let result = this.props.data.split("\n").map(paragraph => <p>{paragraph}&nbsp;</p>)
        return (result);
    }
}

export default (NeoPlainTextView);
