import Table from "react-materialize/lib/Table";
import React from "react";
import NeoReport from "./NeoReport";
import NeoGraphChips from "../NeoGraphChips";
import NeoGraphChip from "../NeoGraphChip";

class NeoTable extends NeoReport {
    constructor(props) {
        super(props);
        this.state = {
            'running': true,
            'query': 'MATCH (n)-[rel]-(x) \n RETURN n, n.name, rel, x, x.name, x.year LIMIT 100',
            'params': {}
        };
        this.runQuery();
    }


    render() {
        let data = this.state.data;
        if (this.state.running) {
            return <p>Running query...</p>
        }
        if (data == null) {
            return <p>Query returned no data.</p>
        }

        let headers =
            Object.keys(data[0]).map((item, index) => {
                return <th data-field={item}>{item}</th>
            });

        let rows = data.filter((item, index) => index >= (this.props.page - 1) * this.props.rows && index < (this.props.page) * this.props.rows)
            .map((row, index) => {
                return <tr>
                    <td>{index + (this.props.page - 1) * this.props.rows + 1}</td>
                    {Object.values(row).map(value => {
                        if (value == null){
                            return <td></td>
                        }
                        if (value["labels"] && value["identity"] && value["properties"]){
                            return <td>{value["labels"].map(label => <NeoGraphChip name={label}/>)} </td>
                        }
                        if (value["type"] && value["start"] && value["end"] && value["identity"] && value["properties"]){
                            return <td><NeoGraphChip color="grey" radius={0} name={value["type"]}/> </td>
                        }
                        if (value["low"] && value["high"] === 0) {
                            return <td>{value.low}</td>
                        }
                        return <td>{JSON.stringify(value, null, 2)}</td>
                    })}

                </tr>
            });

        return (
            <Table>
                <thead>
                <tr>
                    <th>&nbsp;</th>
                    {headers}
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>
        );
    }
}

export default (NeoTable);
