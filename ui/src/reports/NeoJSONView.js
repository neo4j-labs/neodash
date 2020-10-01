import Table from "react-materialize/lib/Table";
import React from "react";
import Textarea from "react-materialize/lib/Textarea";
import neo4j from "neo4j-driver";
import NeoReport from "./NeoReport";

class NeoJSONView extends NeoReport {
    constructor(props) {
        super(props);
        this.state = {
            'query': 'Match (n) WITH n LIMIT 2 MATCH (n)-[e]-(m) RETURN id(n), n,e,m LIMIT 10',
            'params': {},
            'running': true
        };
        this.runQuery();
    }

    render() {
        let rendered = super.render();
        if (rendered){
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
                      xl={12}/>
        );
    }
}

export default (NeoJSONView);
