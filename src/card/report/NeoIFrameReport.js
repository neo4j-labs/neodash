import React from "react";
import NeoReport from "./NeoReport";

class NeoIFrameReport extends NeoReport {
    constructor(props) {
        super(props);
    }

    render() {
        let rendered = super.render();
        if (rendered) {
            return rendered;
        }
        if (this.props.data.startsWith("http://") || this.props.data.startsWith("https://")){
            let yShift = -10;
            let height = -140 + this.props.height * 100 - yShift;
            return <iframe style={{width: "100%", height: height}} src={this.props.data}/>;
        }else{
            return <p>Invalid iFrame URL. Make sure your url starts with <code>http://</code> or <code>https://</code>.</p>
        }

    }
}

export default (NeoIFrameReport);
