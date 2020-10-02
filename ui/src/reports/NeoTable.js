import Table from "react-materialize/lib/Table";
import React from "react";
import NeoReport from "./NeoReport";
import NeoGraphChips from "../NeoGraphChips";
import NeoGraphChip from "../NeoGraphChip";
import Textarea from "react-materialize/lib/Textarea";

class NeoTable extends NeoReport {
    constructor(props) {
        super(props);
        this.state = {
            'running': true,
            'query': 'Match (n) WITH n LIMIT 20 MATCH (n)-[e]-(m) RETURN id(n), n,e,m LIMIT 100',
            'params': {}
        };
        this.runQuery();
    }

    render() {
        let rendered = super.render();
        if (rendered){
            return rendered;
        }
        let data = this.state.data;

        let headers =
            Object.keys(data[0]).map((item, index) => {
                return <th data-field={item}>{item}</th>
            });

        let rows = data.filter((item, index) => index >= (this.props.page - 1) * this.props.rows && index < (this.props.page) * this.props.rows)
            .map((row, index) => {
                return <tr>
                    <td style={{color: "lightgrey"}}>{index + (this.props.page - 1) * this.props.rows + 1}</td>
                    {Object.values(row).map(value => {
                        return <td>{this.renderExoticValueTypes(value)}</td>
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

    renderExoticValueTypes(value){
        if (value == null) {
            return ""
        }
        if (Array.isArray(value)){
            return <p> {
                value.map((item,index) =>
                {
                    return <>
                    {this.renderExoticValueTypes(item)}
                    { (index !== value.length -1 && !Array.isArray(item))  ? ', ' : ''  }
                    </>
                })
            }  </p>;
        }
        if (value["labels"] && value["identity"] && value["properties"]) {
            return value["labels"].map(label => <NeoGraphChip name={label}/>)
        }
        if (value["type"] && value["start"] && value["end"] && value["identity"] && value["properties"]) {
            return <NeoGraphChip color="grey" radius={0} name={value["type"]}/>
        }
        if (value["low"] && value["high"] === 0) {
            return value.low
        }
        if (value.startsWith("http://") || value.startsWith("https://")){
            return <a target={"_blank"} href={value}>{value}</a>
        }
        return JSON.stringify(value, null, 2)
    }
}

export default (NeoTable);
