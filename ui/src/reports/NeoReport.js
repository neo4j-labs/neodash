import React from "react";
import neo4j from "neo4j-driver";
import Textarea from "react-materialize/lib/Textarea";

class NeoReport extends React.Component {

    constructor(props) {
        super(props);
        var driver = neo4j.driver(
            'neo4j://localhost',
            neo4j.auth.basic('neo4j', 'neo')
        );
        this.session = driver.session();
    }

    runQuery() {
        if (this.state.query.trim() === ""){
            this.state.running = false;
            this.state.data = null;
            return
        }
        this.session
            .run(this.state.query, this.state.params)
            .then(result => {

                let records = result.records;
                if (records.length >1000){
                    alert("A query returned over 1000 rows. Reports may be slow/unresponsive. \n\nYour query: \n" + this.state.query + "\n \nConsider adding a LIMIT clause to the end of your query, e.g: \nRETURN x,y,z LIMIT 100.");
                }
                this.state.data = records.map(record => {
                    var row = {};
                    record["keys"].map((key, index) => {
                        row[key] = record["_fields"][index];
                    });
                    return row;
                });

            })
            .catch(error => {
                let newline = '\n'
                this.state.data = [{error: error['stack']}];

            })
            .then(() => {
                this.state.running = false;
                this.session.close()
                this.setState(this.state);
            })
    }

    render(){
        let data = this.state.data;
        if (this.state.running) {
            return <p>Running query...</p>
        }

        if (data == null || data.length == 0) {
            return <p>Query returned no data.</p>
        }

        if (this.state.data.length == 1 && this.state.data[0]['error']) {
            let result = this.state.data[0]['error'];
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
}

export default (NeoReport)