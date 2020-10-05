import React from "react";
import neo4j from "neo4j-driver";
import Textarea from "react-materialize/lib/Textarea";
import Icon from "react-materialize/lib/Icon";
import Chip from "react-materialize/lib/Chip";

class NeoReport extends React.Component {

    constructor(props) {
        super(props);
        var driver = neo4j.driver(
            'neo4j://localhost',
            neo4j.auth.basic('neo4j', 'neo')
        );
        this.state = {}
        this.session = driver.session();
    }

    runQuery() {
        this.state.running = true;
        if (this.props.query.trim() === ""){
            this.state = {}
            this.state.running = false;
            this.state.data = null;
            return
        }

        this.session
            .run(this.props.query, this.props.params)
            .then(result => {

                let records = result.records;
                if (records.length >1000){
                    alert("A query returned over 1000 rows. Reports may be slow/unresponsive. \n\nYour query: \n" + this.props.query + "\n \nConsider adding a LIMIT clause to the end of your query, e.g: \nRETURN x,y,z LIMIT 100.");
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
                this.setState(this.state);
            })
    }

    render(){

        if (this.state.prevQuery !== this.props.query){
            this.state.prevQuery = this.props.query;
            this.runQuery();
        }
        let data = this.state.data;
        if (this.state.running) {
            return <p>Running query...</p>
        }

        if (data == null){
            return <><span>No query specified.
                <br/> Use the &nbsp;
                <Chip
                    close={false}
                    closeIcon={<Icon className="close">close</Icon>}
                    options={null}
                    style={{height: '24px',lineHeight: '24px'}}
                >
                    Settings &nbsp;&nbsp;&nbsp;&nbsp;
                    <i style={{right: '4px', position: "absolute"}} className="material-icons">more_vert</i>
                </Chip>
                 to get started.</span></>
        }
        if (data.length == 0) {
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