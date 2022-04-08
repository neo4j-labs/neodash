import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { ChartProps } from './Chart';
import { getRecordType, getRendererForValue, rendererForType, RenderSubValue, valueIsNode, valueIsRelationship } from '../report/ReportRecordProcessing';
import { makeStyles } from '@material-ui/styles';
import { evaluateRulesOnDict, generateClassDefinitionsBasedOnRules } from '../report/ReportRuleEvaluator';
import GetAppIcon from '@material-ui/icons/GetApp';
import { IconButton, Tooltip } from '@material-ui/core';

function ApplyColumnType(column, value) {
    const renderer = getRendererForValue(value);
    const columnProperties = (renderer ? { type: renderer.type, renderCell: renderer.renderValue } : rendererForType["string"]);
    if (columnProperties) {
        column = { ...column, ...columnProperties }
    }
    return column;
}
/**
 * Basic function to convert a table row output to a CSV file, and download it.
 * TODO: Make this more robust. Probably the commas should be escaped to ensure the CSV is always valid.
 */
const downloadCSV = (rows) => {
    const element = document.createElement("a");
    let csv = "";
    const headers = Object.keys(rows[0]);
    csv += headers.join(", ") + "\n";
    rows.forEach(row => {
        headers.forEach((header) => {
            // Parse value
            var value = row[header];
            if (value && value["low"]) {
                value = value["low"];
            }
            csv += JSON.stringify(value).replaceAll(",",";");
            csv += (headers.indexOf(header) < headers.length - 1) ? ", " : "";
        });
        csv += "\n";
    });
   
    const file = new Blob([csv], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "table.csv";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
}


const NeoTableChart = (props: ChartProps) => {
    const fullscreen = props.fullscreen ? props.fullscreen : false;
    const transposed = props.settings && props.settings.transposed ? props.settings.transposed : false;
    const allowDownload = props.settings && props.settings.allowDownload !== undefined ? props.settings.allowDownload : false;
    const styleRules = props.settings && props.settings.styleRules ? props.settings.styleRules : [];

    const useStyles = generateClassDefinitionsBasedOnRules(styleRules);
    const classes = useStyles();
    if (props.records == null || props.records.length == 0 || props.records[0].keys == null) {
        return <>No data, re-run the report.</>
    }

    var columnWidths = null;
    try {
        columnWidths = props.settings && props.settings.columnWidths && JSON.parse(props.settings.columnWidths);
    } catch (e) {
        // do nothing
    } finally {
        // do nothing
    }

    const records = props.records;

    const columns = (transposed) ? ["Field"].concat(records.map((r, j) => "Value" + (j == 0 ? "" : " " + (j + 1).toString()))).map((key, i) => {
        const value = key;
        return ApplyColumnType({
            field: key,
            headerName: key,
            headerClassName: 'table-small-header',
            disableColumnSelector: true,
            flex: (columnWidths && i < columnWidths.length) ? columnWidths[i] : 1,
            disableClickEventBubbling: true
        }, value)
    }) : records[0].keys.map((key, i) => {
        const value = records[0].get(key);
        return ApplyColumnType({
            field: key,
            headerName: key,
            headerClassName: 'table-small-header',
            disableColumnSelector: true,
            flex: (columnWidths && i < columnWidths.length) ? columnWidths[i] : 1,
            disableClickEventBubbling: true
        }, value)
    });

    const rows = (transposed) ? records[0].keys.map((key, i) => {
        return Object.assign({ id: i, Field: key }, ...records.map((r, j) => ({ ["Value" + (j == 0 ? "" : " " + (j + 1).toString())]: RenderSubValue(r._fields[i]) })));
    }) : records.map((record, rownumber) => {
        return Object.assign({ id: rownumber }, ...record._fields.map((field, i) => ({ [record.keys[i]]: field })));
    });

    return (
        <div className={classes.root} style={{ height: "100%", width: '100%', position: "relative" }}>
           {(allowDownload && rows && rows.length > 0) ? <Tooltip title="Download CSV" aria-label="">
                <IconButton aria-label="download csv" style={{ bottom: "9px", left: "3px", position: "absolute"}}>
                    <GetAppIcon onClick={(e) => {
                        downloadCSV(rows);
                    }} style={{ fontSize: "1.3rem", zIndex: 5 }} fontSize="small">
                    </GetAppIcon>
                </IconButton>
            </Tooltip> : <></>}
            <DataGrid
                headerHeight={32}
                rows={rows}
                columns={columns}
                pageSize={fullscreen ? 15 : (props.dimensions && props.dimensions.height == 3) ? 5 : 13}
                rowsPerPageOptions={[fullscreen ? 15 : (props.dimensions && props.dimensions.height == 3) ? 5 : 13]}
                disableSelectionOnClick
                components={{
                    ColumnSortedDescendingIcon: () => <></>,
                    ColumnSortedAscendingIcon: () => <></>,
                }}
                getRowClassName={(params) => {
                    return "rule" + evaluateRulesOnDict(params.row, styleRules, ['row color', 'row text color']);
                }}
                getCellClassName={(params) => {
                    return "rule" + evaluateRulesOnDict({ [params.field]: params.value }, styleRules, ['cell color', 'cell text color']);
                }}
            />

        </div>
    );
}

export default NeoTableChart;