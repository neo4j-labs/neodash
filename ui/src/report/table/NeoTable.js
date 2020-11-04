import Table from "react-materialize/lib/Table";
import React from "react";
import NeoReport from "../NeoReport";
import NeoGraphChip from "../../component/NeoGraphChip";


class NeoTable extends NeoReport {
    constructor(props) {
        super(props);
    }

    render() {
        let rendered = super.render();
        if (rendered) {
            return rendered;
        }
        let data = this.state.data;

        let headers =
            Object.keys(data[0]).map((item, index) => {
                return <th key={index} data-field={item}>{item}</th>
            });

        let rows = data.filter((item, index) => index >= (this.props.page - 1) * this.props.rows && index < (this.props.page) * this.props.rows)
            .map((row, index) => {
                return <tr key={index}>
                    <td key={-1}
                        style={{color: "lightgrey"}}>{index + (this.props.page - 1) * this.props.rows + 1}</td>
                    {Object.values(row).map((value, index) => {
                        return <td key={index}>{this.renderExoticValueTypes(value)}</td>
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

    renderExoticValueTypes(value) {
        if (value == null) {
            return ""
        }
        if (Array.isArray(value)) {
            return <div style={{display: 'inline-block'}}> {
                value.map((item, index) => {
                    return <div style={{display: 'inline-block'}} key={index}>
                        {this.renderExoticValueTypes(item)}{(index !== value.length - 1 && !Array.isArray(item)) ? ',' : ''}
                    </div>
                })
            } <br/> </div>;
        }
        if (value["start"] && value["end"] && value["segments"] && value["length"]) {
            // let segment = ;
            let path = [value.start];
            value.segments.forEach(segment => {
                path = path.concat(segment.relationship).concat(segment.end);
            });
            return this.renderExoticValueTypes(path);
        }
        if (value["labels"] && value["identity"] && value["properties"]) {
            return value["labels"].map((label, index) => <div style={{display: 'inline-block'}} key={index} index={index}><NeoGraphChip name={label}/></div>)
        }
        if (value["type"] && value["start"] && value["end"] && value["identity"] && value["properties"]) {
            return <NeoGraphChip color="grey" radius={0} name={value["type"]}/>
        }
        if (value["low"] && value["high"] === 0) {
            return value.low
        }
        if (value.constructor === String) {
            if (value.startsWith("http://") || value.startsWith("https://")) {
                return <a target={"_blank"} href={value}>{value}</a>
            }
        }
        return JSON.stringify(value, null, 2)
    }
}

export default (NeoTable);
