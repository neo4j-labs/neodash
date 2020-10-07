import React from "react";
import Textarea from "react-materialize/lib/Textarea";
import NeoReport from "../NeoReport";

class NeoJSONView extends NeoReport {
    constructor(props) {
        super(props);
    }

    render() {
        let rendered = super.render();
        if (rendered) {
            return rendered;
        }
        let result = JSON.stringify(this.state.data, null, 2);
        return (
            <Textarea style={{marginBottom: '100px'}}
                      id="Textarea-12"
                      l={12}
                      m={12}
                      s={12}
                      value={result}
                      onChange={e => null}
                      xl={12}/>
        );
    }
}

export default (NeoJSONView);
