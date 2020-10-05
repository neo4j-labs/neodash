import React from "react";
import Textarea from "react-materialize/lib/Textarea";

class NeoTextArea extends React.Component {
    render(content) {
        let disclaimer = 'Limit a query to 1000 result rows for best performance. Cypher parameter keys & values must be in quotes.';
        return (
            <Textarea
                onChange={e => {
                    this.props.onChange({'label': this.props.name + "Changed", 'value': e.target.value})
                }}
                id="Textarea-12"
                l={12}
                m={12}
                s={12}
                placeholder={"Enter Cypher here... \n"}
                xl={12}><p style={{fontSize: 12}}>{disclaimer}</p></Textarea>

        );
    }
}

export default (NeoTextArea);