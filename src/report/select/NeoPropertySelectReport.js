import React from "react";
import Textarea from "react-materialize/lib/Textarea";
import NeoReport from "../NeoReport";
import NeoOptionSelect from "../../component/NeoOptionSelect";
import NeoTextInput from "../../component/NeoTextInput";
import NeoAutoCompleteText from "../../component/NeoAutoCompleteText";
import neo4j from "neo4j-driver";

class NeoPropertySelectReport extends NeoReport {
    constructor(props) {
        super(props);

        var url = this.props.connection.url;
        if (!(url.startsWith("bolt://") || url.startsWith("bolt+routing://") || url.startsWith("neo4j://"))) {
            url = "neo4j://" + url;
        }
        if (url) {
            let config = {
                encrypted: (this.props.connection.encryption === "on") ? 'ENCRYPTION_ON' : 'ENCRYPTION_OFF'
            };

            var driver = neo4j.driver(
                url,
                neo4j.auth.basic(this.props.connection.username, this.props.connection.password),
                config
            );
            this.state = {}

            this.state.session = driver.session({database: this.props.connection.database});

        }
    }


    render() {
        let rendered = super.render();
        if (rendered) {
            return rendered;
        }

        let options = {
            'table': 'Table',
            'graph': 'Graph',
            'line': 'Line Chart',
            'bar': 'Bar Chart',
            'json': 'Raw JSON',
            'select': 'Selection',
            'text': 'Markdown',
        };
        let result = <div>
            <NeoAutoCompleteText
                onSelectionChange={
                   this.props.onSelectionChange
                }
                changeEventLabel={"PropertySelectedChanged"}
                session={this.state.session}
                style={{'width': '100%'}} label={"Movie"} property={"title"}
                defaultValue={""}/>
        </div>
        return (result);
    }
}

export default (NeoPropertySelectReport);
