import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Chip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { ChartProps } from './Chart';
import { valueIsNode, valueIsRelationship, getRecordType } from '../report/RecordProcessing';

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

function RenderNode(value, key = 0) {
    return <HtmlTooltip key={key + "-" + value.identity} arrow title={<div><b> {value.labels.length > 0 ? value.labels.join(", ") : "Node"}</b><table><tbody>{Object.keys(value.properties).length == 0 ? <tr><td>(No properties)</td></tr> : Object.keys(value.properties).map((k, i) => <tr key={i}><td key={0}>{k.toString()}:</td><td key={1}>{value.properties[k].toString()}</td></tr>)}</tbody></table></div>}>
        <Chip label={value.labels.length > 0 ? value.labels.join(", ") : "Node"} />
    </HtmlTooltip>
}

function RenderRelationship(value, key = 0) {
    return <HtmlTooltip key={key + "-" + value.identity} arrow title={<div><b> {value.type}</b><table><tbody>{Object.keys(value.properties).length == 0 ? <tr><td>(No properties)</td></tr> : Object.keys(value.properties).map((k, i) => <tr key={i}><td key={0}>{k.toString()}:</td><td key={1}>{value.properties[k].toString()}</td></tr>)}</tbody></table></div>}>
        <Chip style={{ borderRadius: 0, clipPath: (value.direction == undefined) ? "none" : ((value.direction) ? rightRelationship : leftRelationship) }} label={value.type} />
    </HtmlTooltip>
}

function RenderPath(value) {
    return value.segments.map((segment, i) => {
        return RenderSubValue((i < value.segments.length - 1) ?
            [segment.start, addDirection(segment.relationship, segment.start)] :
            [segment.start, addDirection(segment.relationship, segment.start), segment.end], i)
    });
}

function RenderArray(value) {
    const mapped = value.map((v, i) => {
        return <div>
            {RenderSubValue(v)}
            {i < value.length - 1 && !valueIsNode(v) && !valueIsRelationship(v) ? <span>,&nbsp;</span> : <></>}
        </div>
    });
    return mapped;
}

function RenderString(value) {
    const str = value.toString();
    if (str.startsWith("http") || str.startsWith("https")) {
        return <a target="_blank" href={str}>{str}</a>;
    }
    return str;
}

const customColumnProperties: any = {
    "node": {
        type: 'string',
        renderCell: (c) => RenderNode(c.value),
    },
    "relationship": {
        type: 'string',
        renderCell: (c) => RenderRelationship(c.value),
    },
    "path": {
        type: 'string',
        renderCell: (c) => RenderPath(c.value),
    },
    "object": {
        type: 'string',
        // valueGetter enables sorting and filtering on string values inside the object
        valueGetter: (c) => { return JSON.stringify(c.value) },
    },
    "array": {
        type: 'string',
        renderCell: (c) => RenderArray(c.value),
    },
    "string": {
        type: 'string',
        renderCell: (c) => RenderString(c.value),
    }
};

function ApplyColumnType(column, value) {
    column.type = getRecordType(value);
    const columnProperties = customColumnProperties[column.type];

    if (columnProperties) {
        column = { ...column, ...columnProperties }
    }

    return column;
}

function RenderSubValue(value, key = 0) {

    if (value == undefined) {
        return "";
    }

    const type = getRecordType(value);
    const columnProperties = customColumnProperties[type];
    if (columnProperties.renderCell) {
        return columnProperties.renderCell({ value: value });
    }

    return RenderString(value);
}

const NeoTableChart = (props: ChartProps) => {
    const fullscreen = props.fullscreen ? props.fullscreen : false;

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

    const columns = props.records[0].keys.map((key, i) => {
        const value = props.records[0].get(key);
        return ApplyColumnType({
            field: key,
            headerName: key,
            headerClassName: 'table-small-header',
            disableColumnSelector: true,
            flex: columnWidths ? columnWidths[i] % columnWidths.length : 1,
            disableClickEventBubbling: true
        }, value)
    })

    const rows = props.records.map((record, rownumber) => {
        return Object.assign({ id: rownumber }, ...record._fields.map((field, i) => ({ [record.keys[i]]: field })));
    });

    return (
        <div style={{ height: "100%", width: '100%' }}>
            <DataGrid
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