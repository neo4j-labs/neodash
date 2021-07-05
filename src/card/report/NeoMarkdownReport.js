import React from "react";
import NeoReport from "./NeoReport";
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

/**
 * The markdown report does not run/execute Cypher.
 * Instead, the user input is compiled from Markdown to HTML and rendered inside the card.
 */
class NeoMarkdownReport extends NeoReport {
    render() {
        let rendered = super.render();
        if (rendered) {
            return rendered;
        }
        let markdown = "";
        if (this.props.data){
            markdown = this.props.data.replace(/\n\n/g, "\n\n &nbsp; \n\n").replace(/\n \n/g, "\n\n &nbsp; \n\n");
        }

        let result =<div><base target="_blank"/> <ReactMarkdown plugins={[gfm]} children={markdown} /></div>
        return (result);
    }
}

export default (NeoMarkdownReport);
