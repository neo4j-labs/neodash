
import React from 'react';
import "codemirror/lib/codemirror.css";
import "codemirror/addon/lint/lint.css";
import "codemirror/addon/hint/show-hint.css";
import CypherEditor from './CypherEditor';


const NeoCodeEditorComponent = ({ value, onChange = (e) => { }, placeholder,
    editable = true, language = "cypher",
    style = { width: "100%", height: "auto", border: "1px solid lightgray" } }) => {

    const options = {
        viewPortMargin: Infinity,
        mode: language,
        theme: "cypher",
        height: "auto",
        lineNumberFormatter: line => line
    };

    // TODO -  we force a recreating of the editor object here in a strange way...
    const editor = (language == "cypher") ? <CypherEditor
        options={options}
        aria-label=""
        readOnly={!editable}
        value={value}
        onValueChange={(val) => {
            // TODO: there's a bug here that causes this event to be fired twice when text gets copy pasted into the editor.
            if (editable) {
                onChange(val);
            }
        }}
        placeholder={placeholder} /> : <div><CypherEditor
        options={options}
        readOnly={!editable}
        aria-label=""
        value={value}
        onValueChange={(val) => {
            if (editable) {
                onChange(val);
            }
        }}
        placeholder={placeholder} /></div>

    return (
        <div className={"autosize"} style={style}>
            {editor}</div>
    );
};

export default NeoCodeEditorComponent;