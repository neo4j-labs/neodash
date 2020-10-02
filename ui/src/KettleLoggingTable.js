import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import React from "react";
import Modal from "react-materialize/lib/Modal";
import Button from "react-materialize/lib/Button";
import Badge from "react-materialize/lib/Badge";

const trigger = <Button style={{backgroundColor: 'white'}}>🔍</Button>;

const GET_LOGGING_INFO = gql`
    {
        e: Execution(type:"JOB" orderBy: executionStart_desc) {
            name, executionStart, executionEnd, duration, id, file, success, RWIOR, loggingText, errors, nrResultFiles, nrResultRows,
            subexecutions{
                name, registrationDate, id, message, type, rwior
            }
            rooterrors {
                name, id, loggingText, errors
            }
        }
    }
`;

/**
 * Builds HTML for the kettle logging table based on the data retrieved through GraphQL.
 */
function KettleLoggingTable() {
    const {loading, error, data} = useQuery(GET_LOGGING_INFO, {
        variables: {},
    });

    if (loading) return <p>Loading ...</p>;
    if (error) {
        return <p>{error.toString()}</p>;
    }

    const headers = ["name", "executionStart", "executionEnd", "duration", "id", "success", "RWIOR"];
    const subheaders = ["name", "registrationDate", "id", "message", "type", "rwior"];

    const headerHTML = buildHeaderHTML(headers);
    const rowsHTML = buildRowsHTML(data, headers, subheaders);
    return <table>{headerHTML}{rowsHTML}</table>;
}

function buildRowsHTML(data, headers, subheaders) {

    const rowsHTML = data["e"].map((row, index) => {
        const modal = buildModalHTML(row, subheaders);
        return buildSingleRowHTML(headers, row, index, modal);
    });
    return <tbody>{rowsHTML}</tbody>;
}

function getModalBadgesHTML(row) {
    let badges = <><p class="badge-strip">
        <Badge className="blue left" newIcon caption="executions">{row['subexecutions'].length}</Badge>
        <Badge className="green left" newIcon caption="result file(s)">{row['nrResultFiles']}</Badge>
        {/*<Badge className="orange left" newIcon caption="result row(s)">{row['nrResultRows']}</Badge>*/}
        <Badge className="red left" newIcon caption="error(s)">{row['errors']}</Badge>
    </p><br/></>;
    return badges;
}

function getExecutionsHTML(row, subheaderHTML, subrowsHTML) {
    let executions = <><h5>Job executions:</h5>
        <p>
            <pre>File: {row['file']}</pre>
        </p>
        <table>{subheaderHTML}
            <tbody>{subrowsHTML}</tbody>
        </table>
    </>;
    return executions;
}

function getLogsHTML(row) {
    let log = <><h5>Complete log:</h5>
        <pre class="log">
            {row['loggingText']}
            </pre>
    </>;
    return log;
}

function buildModalHTML(row, subheaders) {
    const subheaderHTML = buildHeaderHTML(subheaders);
    const subrowsHTML = row['subexecutions'].map((subrow, index) => {
        return buildSingleRowHTML(subheaders, subrow, index);
    });
    let header = 'Execution of ' + row['name'] + " (" + row['executionStart'] + ")";
    let errorheader = row['rooterrors'].length > 0 ? <h5>Errors:</h5> : "";
    let errors = Object.values(row['rooterrors']).map((row, index) => {
        return <p><h6>({index + 1}): Execution Failed - {row['name']} [{row['id']}]</h6>
            <pre class="log-snip">{row['loggingText']}</pre>
        </p>
    });
    let badges = getModalBadgesHTML(row);
    let executions = getExecutionsHTML(row, subheaderHTML, subrowsHTML);
    let log = getLogsHTML(row);

    return <td><Modal header={header} trigger={trigger}>{badges}{errorheader}{errors}{executions}{log}</Modal></td>
}

function buildSingleRowHTML(headers, row, index, optional = "") {
    const rowhtml = headers.map((header) => {
        if (header === "duration") {
            var date = new Date(0);
            date.setMilliseconds(row[header]);
            var timeString = date.toISOString().substr(11, 12);
            row[header] = timeString;
        }

        return <td>{row[header]}</td>;
    });
    return <tr>
        <td>{index}</td>
        {rowhtml}{optional}</tr>;
}


function buildHeaderHTML(headers) {
    return <thead>
    <tr>
        <th></th>
        {headers.map((key) => {
            return <th>{key}</th>
        })}
        <th></th>
    </tr>
    </thead>;
}

export default (KettleLoggingTable);