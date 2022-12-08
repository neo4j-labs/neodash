
import React from 'react';
import { CypherEditor, CypherEditorProps } from '@neo4j-cypher/react-codemirror';

import "@neo4j-cypher/codemirror/css/cypher-codemirror.css";

const NeoCodeEditorComponent = ({ value, onChange = (e) => { }, placeholder,
    editable = true, language = "cypher",
    style = { width: "100%", height: "auto", border: "1px solid lightgray" } }) => {

    const editorProps: CypherEditorProps = {
        readOnly: !editable,
        placeholder: placeholder,
        value: value,
        autocompleteCloseOnBlur: false,
        tooltipAbsolute: true,
        onValueChanged: (val, change) => {
            if (editable) {
                onChange(val);
            }
        },

    }

    // TODO -  we force a recreating of the editor object here in a strange way...
    const editor = (language == "cypher") ?
        <CypherEditor {...editorProps}/> :
        <div><CypherEditor {...editorProps} /></div>

    return (
        <div className={"autosize"} style={style}>
            {editor}</div>
    );
};

export default NeoCodeEditorComponent;