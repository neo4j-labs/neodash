import React from "react";
import NeoReport from "./NeoReport";
import NeoOptionSelect from "../../component/NeoOptionSelect";
import NeoTextInput from "../../component/NeoTextInput";
import NeoAutoCompleteText from "../../component/NeoAutoCompleteText";
import neo4j from "neo4j-driver";
import {Preloader} from "react-materialize";

/**
 * The NeoPropertySelectReport allows a user to select a Cypher parameter based on existing node property values.
 */
class NeoPropertySelectReport extends NeoReport {

    constructor(props) {
        super(props);
        this.initializeNeo4jConnection();
    }

    /**
     * Set up a Neo4j connection that the autocompletion box will use.
     */
    initializeNeo4jConnection() {
        var url = this.props.connection.url;
        if (!(url.startsWith("bolt://") || url.startsWith("bolt+routing://") || url.startsWith("neo4j://"))) {
            url = "neo4j://" + url;
        }
        if (url) {
            let config = {
                encrypted: (this.props.connection.encryption === "on") ? 'ENCRYPTION_ON' : 'ENCRYPTION_OFF'
            };
            var driver = neo4j.driver(url,
                neo4j.auth.basic(this.props.connection.username, this.props.connection.password),
                config
            );
            this.state = {}
            this.state.session = driver.session({database: this.props.connection.database});
        }
    }

    /**
     * Render the report. (A NeoAutoCompleteText component is used to handle property selection).
     */
    render() {
        // Render the auto completion box.
        let content = <div>
            <NeoAutoCompleteText
                query={this.props.query}
                label={this.props.label}
                property={this.props.property}
                propertyId={this.props.propertyId}
                onAutoComplete={this.props.onSelectionChange}
                changeEventLabel={"PropertySelectedChanged"}
                session={this.state.session}
                customStyle={{paddingTop: "5px", marginBottom: "200px", width: "100%"}}
                defaultValue={""}>

            </NeoAutoCompleteText>
        </div>
        return (content);
    }
}

export default (NeoPropertySelectReport);
