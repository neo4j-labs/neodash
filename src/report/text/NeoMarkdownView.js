import React from "react";
import NeoReport from "../NeoReport";
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

class NeoMarkdownView extends NeoReport {
    render() {
        let rendered = super.render();
        if (rendered) {
            return rendered;
        }
        let markdown = "";
        if (this.props.data){
            markdown = this.props.data.replace(/\n\n/g, "\n\n &nbsp; \n\n").replace(/\n \n/g, "\n\n &nbsp; \n\n");
        }
        let result = <ReactMarkdown plugins={[gfm]} children={markdown} />
        return (result);
    }
}

export default (NeoMarkdownView);
