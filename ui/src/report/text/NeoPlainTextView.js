import React from "react";
import NeoReport from "../NeoReport";
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

class NeoPlainTextView extends NeoReport {
    render() {
        let rendered = super.render();
        if (rendered) {
            return rendered;
        }
        // let result = this.props.data.split("\n").map(paragraph => <p>{paragraph}&nbsp;</p>)
        let markdown = this.props.data.replaceAll("\n\n", "\n\n &nbsp; \n\n").replaceAll("\n \n", "\n\n &nbsp; \n\n");
        let result = <ReactMarkdown plugins={[gfm]} children={markdown} />
        return (result);
    }
}

export default (NeoPlainTextView);
