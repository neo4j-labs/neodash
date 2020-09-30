import React from "react";
import neo4j from "neo4j-driver";

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
        this.session
            .run(this.state.query, this.state.params)
            .then(result => {

                let records = result.records;
                if (records.length >5000){
                    alert("A query returned over 5000 records. Reports may be slow/unresponsive. \n\nYour query: \n" + this.state.query + "\n \nConsider adding a LIMIT clause to the end of your query, e.g: \nRETURN x,y,z LIMIT 100.");
                }
                this.state.data = records.map(record => {
                    var row = {};
                    record["keys"].map((key, index) => {
                        row[key] = record["_fields"][index];
                    });
                    return row;
                });
                if (this.state.data.length == 0){
                    this.state.data = "Query returned no results.";
                }


            })
            .catch(error => {
                this.state.data = error;
            })
            .then(() => {
                this.state.running = false;
                this.session.close()
                this.setState(this.state);
            })
    }
}

export default (NeoReport)