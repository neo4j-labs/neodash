import React from "react";
import TextInput from "react-materialize/lib/TextInput";
import {Autocomplete} from "react-materialize";


class NeoAutoCompleteText extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            key: 0,
            input: "",
            value: this.props.defaultValue,
            running: false,
            data: {}
        }
        this.onChange = this.onChange.bind(this);
        this.onAutoComplete = this.onAutoComplete.bind(this);
        this.onChange(null)
    }

    onChange(e) {
        if (this.state.running) {
            return;
        }
        if (e !== null && e.target !== null) {
            this.state.input = e.target.value;
        }

        let query = `MATCH (n:Movie) 
                     WHERE toLower(n.title) CONTAINS toLower($input) 
                     RETURN n.title LIMIT 4`;

        this.state.running = true;
        this.props.session
            .run(query, {input: this.state.input})
            .catch(error => {
                this.state.running = false;
            })
            .then(result => {
                if (result !== null && result.records !== null) {
                    var choices = {};
                    result.records.map((record, i) => {
                        record["_fields"].map((key, index) => {
                            choices[record["_fields"][index]] = null;
                        });
                    });
                    this.state.running = false;
                    this.state.data = choices;
                    this.forceUpdate()
                }
            })

    }

    onAutoComplete(value) {
        this.props.onSelectionChange(this.props.label, this.props.property, value)
    }

    render() {
        let options = {
            data: this.state.data,
            limit: 4,
            onAutocomplete: this.onAutoComplete
        };
        let autocomplete = <Autocomplete
            autocomplete={"off"}
            options={options}
            onChange={this.onChange}
            placeholder={""}
            style={{width: "100%"}}
            title={this.props.label + " " + this.props.property}
        />;

        return <div style={{paddingTop: "5px", minHeight: "275px", width: "100%"}}>
            {autocomplete}
        </div>;
    }
}

export default (NeoAutoCompleteText);