import React from "react";
import Textarea from "react-materialize/lib/Textarea";

class NeoTextArea extends React.Component {
    render(content) {
        return (
            <Textarea
                onChange={e => {this.props.onChange({'label': 'QueryChanged', 'value': e.target.value})}}
                id="Textarea-12"
                l={12}
                m={12}
                s={12}
                placeholder={"Enter Cypher here... \n"}
                xl={12}><p style={{fontSize: 12}}>Limit a query to 1000 result rows for best performance.</p></Textarea>

        );
    }
}

export default (NeoTextArea);