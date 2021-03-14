import React from "react";
import neo4j from "neo4j-driver";
import Textarea from "react-materialize/lib/Textarea";
import Icon from "react-materialize/lib/Icon";
import Chip from "react-materialize/lib/Chip";

/**
 * A NeoReport is a base class for any type of visualization/rendering method inside a card.
 * General methods shared between all report types will reside here.
 *
 * Each NeoReport will have their own driver session to Neo4j, so that they can eventually be used with multiple databases.
 */
class NeoReport extends React.Component {

    /**
     * Sets up the component and the connection to Neo4j.
     * If this report has a refresh rate specified, also sets up the timer.
     */
    constructor(props) {
        super(props);
        this.state = {}

        // If people don't specify a URL protocol, add a default one.
        let url = this.props.connection.url;
        //
        if (!(url.startsWith("bolt://") || url.startsWith("bolt+routing://") || url.startsWith("neo4j://"))) {
            url = "neo4j://" + url;
        }
        if (url) {
            // Configure whether to use an encrypted connection or not.
            let config = {
                encrypted: (this.props.connection.encryption === "on") ? 'ENCRYPTION_ON' : 'ENCRYPTION_OFF'
            };
            // Instantiate a driver object.
            var driver = neo4j.driver(
                url,
                neo4j.auth.basic(this.props.connection.username, this.props.connection.password),
                config
            );
            // Instantiate a driver session.
            this.session = driver.session({database: this.props.connection.database});
            this.runTimer({})
        }

    }

    /**
     * Delete the active timer when the component gets removed.
     */
    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    /**
     * If the component is updated, possibly remove/reset the timer frequency.
     */
    componentDidUpdate(prevProps, prevState, ss) {
        let refresh = this.props.refresh;
        if (prevProps.refresh !== refresh) {
            this.runTimer(prevProps);
        }
    }

    /**
     * (re)-sets the timer responsible for running the Cypher query at a given interval.
     * @param prevProps - previous properties of the NeoReport component.
     */
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
                }, refresh * 1000.0);
            }
        }
    }

    /**
     * Runs the selected Cypher query and saves the result for the report to render.
     * This also handles errors and truncation of the results for large return datasets.
     */
    runQuery() {
        this.state.running = true;
        if (!this.props.query || this.props.query.trim() === "") {
            this.state = {}
            this.state.running = false;
            this.state.data = null;
            return
        }
        this.session
            .run(this.props.query, this.props.params)
            .then(result => {
                let error = "A query returned over 1000 rows. Only the first 1000 results have been rendered. \n\n" +
                    "Consider adding a LIMIT clause to the end of your query: \n \n \"" +
                    this.props.query + " LIMIT 100\n \n \n\"";

                let records = result.records;
                if (error !== this.prevError && records.length > 1000) {
                    this.props.stateChanged({
                        label: "CreateError",
                        value: error
                    })
                    this.prevError = error;
                }
                this.state.data = records.slice(0, 1000).map((record, i) => {
                    var row = {};
                    record["keys"].map((key, index) => {
                        row[key] = record["_fields"][index];
                    });
                    return row;
                });

            })
            .catch(error => {
                this.props.stateChanged({
                    label: "CypherError"
                })
                let newline = '\n'
                this.state.data = [{error: error['stack']}];

            })
            .then(() => {
                this.state.running = false;
                this.setState(this.state);
                this.props.stateChanged({
                    label: "CypherSuccess"
                })
            })
    }

    /**
     * Renders the report. By default, this should not return anything.
     * If there are errors, it will return an error message, thus overridden whatever the child components
     * is rendering.
     */
    render() {
        if (this.state.type === "select") {
            return;
        }
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
        if (data.length === 0) {
            return <p>Query returned no data.</p>
        }

        if (this.state.data.length === 1 && this.state.data[0]['error']) {
            let result = this.state.data[0]['error'];

            if (result.startsWith("Neo4jError: Expected parameter(s):")) {
                let missingParameters = result.split("\n")[0].split(":")[2].split(",");
                if (missingParameters.every(p => p.startsWith(" neodash_"))) {
                    return <p>Select a parameter to view this report.</p>
                }
            }
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