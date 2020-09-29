import React from "react";
import Textarea from "react-materialize/lib/Textarea";

class NeoTextArea extends React.Component {
    render(content) {
        return (
            <Textarea
                id="Textarea-12"
                l={12}
                m={12}
                s={12}
                placeholder={"Enter Cypher here..."}
                xl={12}></Textarea>
        );
    }
}

export default (NeoTextArea);