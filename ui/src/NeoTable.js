import Table from "react-materialize/lib/Table";
import React from "react";

class NeoTable extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        let data = this.props.data;

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
                    {Object.values(row).map(value => <td>{value}</td>)}
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
