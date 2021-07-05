import Table from "react-materialize/lib/Table";
import React from "react";
import NeoReport from "../NeoReport";
import Icon from "react-materialize/lib/Icon";
import Button from "react-materialize/lib/Button";


/**
 * A single value report that draws a single value (text, number, node).
 */
class NeoBigNumberReport extends NeoReport {

    constructor(props) {
        super(props);
    }


    render() {
        let rendered = super.render();
        if (rendered) {
            return rendered;
        }
        let data = this.state.data;
        let value = (data[0]) ? data[0].value : "(no data)";
        var renderValue = (value && value.low) ? value.low + "" : "" + value;
        var message = "";
        return (<>
                <h3 style={{marginTop: "-10px;"}}>{renderValue.split("\n")[0]}</h3>
                <h3>{renderValue.split("\n")[1]}</h3>
                {message}
            </>
        );

    }
}

export default (NeoBigNumberReport);
