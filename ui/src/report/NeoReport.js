import React from "react";
import neo4j from "neo4j-driver";
import Textarea from "react-materialize/lib/Textarea";
import Icon from "react-materialize/lib/Icon";
import Chip from "react-materialize/lib/Chip";

class NeoReport extends React.Component {

    constructor(props) {
        super(props);
        var url = this.props.connection.url;
        if (!(url.startsWith("bolt://") || url.startsWith("bolt+routing://") || url.startsWith("neo4j://"))){
            url = "neo4j://" + url;
        }
        if (url){
            var driver = neo4j.driver(
                url,
                neo4j.auth.basic(this.props.connection.username, this.props.connection.password)
            );
            this.state = {}
            this.session = driver.session({database: this.props.connection.database});
            this.runTimer({})
        }

    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    componentDidUpdate(prevProps, prevState, ss) {
        let refresh = this.props.refresh;
        if (prevProps.refresh !== refresh) {
            this.runTimer(prevProps);
        }

    }

    runTimer(prevProps) {
        let refresh = this.props.refresh;
        if (prevProps.refresh !== refresh) {
            clearTimeout(this.timer);
            if (refresh > 0) {
                let report = this;
                this.timer = setInterval(function () {
                    report.runQuery();
                    report.state.repeat = true;
                    report.setState(report.state);
                    // alert(refresh)
                }, refresh * 1000.0);
            }
        }
    }

    runQuery() {
        this.state.running = true;
        if (this.props.query.trim() === "") {
            this.state = {}
            this.state.running = false;
            this.state.data = null;
            return
        }

        this.session
            .run(this.props.query, this.props.params)
            .then(result => {

                let error = "A query returned over 1000 rows. Only the first 1000 results have been rendered. \n\nConsider adding a LIMIT clause to the end of your query: \n \n \"" + this.props.query + " LIMIT 100\n \n \n\"";
                let records = result.records;
                if (error !== this.prevError && records.length > 1000) {
                    this.props.stateChanged({
                        label: "CreateError",
                        value: error
                    })
                    this.prevError = error;
                }
                this.state.data = records.slice(0,1000).map((record,i) => {
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

    render() {
        if (this.state.running && !this.state.repeat) {
            return <p>Running query...</p>
        }

        if (this.state.prevQuery !== this.props.query) {
            this.state.prevQuery = this.props.query;
            this.state.repeat = false;
            this.runQuery();
            this.setState(this.state);
        }

        let data = this.state.data;


        if (data == null) {
            return <><span>No query specified.
                <br/> Click the &nbsp;
                <Chip
                    close={false}
                    closeIcon={<Icon className="close">close</Icon>}
                    options={null}
                    style={{height: '24px', lineHeight: '24px'}}
                >
                    Settings &nbsp;&nbsp;&nbsp;&nbsp;
                    <i style={{right: '4px', position: "absolute"}} className="material-icons">more_vert</i>
                </Chip>
                 to get started. </span></>
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
                          onChange={e => null}
                          value={result}
                          xl={12}/>
            );
        }

    }
}

export default (NeoReport)