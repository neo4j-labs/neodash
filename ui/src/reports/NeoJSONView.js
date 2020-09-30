import Table from "react-materialize/lib/Table";
import React from "react";
import Textarea from "react-materialize/lib/Textarea";
import neo4j from "neo4j-driver";
import NeoReport from "./NeoReport";

class NeoJSONView extends NeoReport {
    constructor(props) {
        super(props);
        this.state = {
            'query': 'MATCH (n)-[rel]-(x) \n RETURN n, n.name, rel, x, x.name LIMIT 100',
            'params': {},
            'running': true
        };
        this.runQuery();
    }


    render() {
        if (this.state.running) {
            return <p>Running query...</p>
        }
        if (this.state.data == null) {
            return <p>Query returned no data.</p>
        }

        return (

            <Textarea style={{marginBottom: '100px'}}
                      id="Textarea-12"
                      l={12}
                      m={12}
                      s={12}
                      value={JSON.stringify(this.state.data, null, 2)}
                      xl={12}/>

        );
    }

}

export default (NeoJSONView);
