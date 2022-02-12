import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { ChartProps } from './Chart';
import { getRecordType, getRendererForValue, RenderSubValue, valueIsNode, valueIsRelationship } from '../report/RecordProcessing';
import { Chip, Tooltip, withStyles } from '@material-ui/core';

function addDirection(relationship, start) {
    relationship.direction = (relationship.start.low == start.identity.low);
    return relationship;
}

const rightRelationship = "polygon(10px 0%, calc(100% - 10px) 0%, 100% 50%, 100% calc(100% - 50%), calc(100% - 10px) 100%, 0px 100%, 0% calc(100% - 0px), 0% 0px)"
const leftRelationship = "polygon(10px 0%, calc(100% - 0%) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 0%) 100%, 10px 100%, 0% calc(100% - 50%), 0% 50%)"

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        color: 'white',
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #fcfffa',
    },
}))(Tooltip);


function ApplyColumnType(column, value) {
    const renderer = getRendererForValue(value);
    const columnProperties = (renderer ? {type:renderer.type, renderCell: renderer.renderValue} : customColumnProperties["string"]);

    if (columnProperties) {
        column = { ...column, ...columnProperties }
    }

    return column;
}


const NeoTableChart = (props: ChartProps) => {
    const fullscreen = props.fullscreen ? props.fullscreen : false;
    const transposed = props.settings && props.settings.transposed ? props.settings.transposed : false;

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
        return Object.assign({ id: i, Field: key }, ...records.map((r, j) => ({ ["Value" + (j == 0 ? "" : " " + (j + 1).toString())]: RenderSubValue(r._fields[i])  })));
    }) : records.map((record, rownumber) => {
        return Object.assign({ id: rownumber }, ...record._fields.map((field, i) => ({ [record.keys[i]]: field })));
    });

    return (
        <div style={{ height: "100%", width: '100%' }}>
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
            />
        </div>
    );
}

export default NeoTableChart;