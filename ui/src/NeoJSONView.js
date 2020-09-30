import Table from "react-materialize/lib/Table";
import React from "react";
import Textarea from "react-materialize/lib/Textarea";

class NeoJSONView extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        let data = this.props.data;

        if (data == null) {
            return <p>Query returned no data.</p>
        }

        return (
            <div>
            <Textarea style={{marginBottom: '100px'}}
                id="Textarea-12"
                l={12}
                m={12}
                s={12}
                value={JSON.stringify(data, null, 2)}
                xl={12}></Textarea>
            </div>
        );
    }
}

export default (NeoJSONView);
