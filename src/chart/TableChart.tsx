import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Chip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { ChartProps } from './Chart';
import { valueIsArray, valueIsNode, valueIsRelationship, valueIsPath, valueIsObject } from '../report/RecordProcessing';

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

function RenderTableValue(value, key = 0) {
    if (value == undefined) {
        return "";
    }
    if (valueIsArray(value)) {
        const mapped = value.map((v, i) => {
            return <div>
                {RenderTableValue(v)}
                {i < value.length - 1 && !valueIsNode(v) && !valueIsRelationship(v) ? <span>,&nbsp;</span> : <></>}
            </div>
        });
        return mapped;
    } else if (valueIsNode(value)) {
        return <HtmlTooltip key={key + "-" + value.identity} arrow title={<div><b> {value.labels.length > 0 ? value.labels.join(", ") : "Node"}</b><table><tbody>{Object.keys(value.properties).length == 0 ? <tr><td>(No properties)</td></tr> : Object.keys(value.properties).map((k, i) => <tr key={i}><td key={0}>{k.toString()}:</td><td key={1}>{value.properties[k].toString()}</td></tr>)}</tbody></table></div>}>
            <Chip label={value.labels.length > 0 ? value.labels.join(", ") : "Node"} />
        </HtmlTooltip>
    } else if (valueIsRelationship(value)) {
        return <HtmlTooltip key={key + "-" + value.identity} arrow title={<div><b> {value.type}</b><table><tbody>{Object.keys(value.properties).length == 0 ? <tr><td>(No properties)</td></tr> : Object.keys(value.properties).map((k, i) => <tr key={i}><td key={0}>{k.toString()}:</td><td key={1}>{value.properties[k].toString()}</td></tr>)}</tbody></table></div>}>
            <Chip style={{ borderRadius: 0, clipPath: (value.direction == undefined) ? "none" : ((value.direction) ? rightRelationship : leftRelationship) }} label={value.type} />
        </HtmlTooltip>
    } else if (valueIsPath(value)) {
        return value.segments.map((segment, i) => {
            return RenderTableValue((i < value.segments.length - 1) ?
                [segment.start, addDirection(segment.relationship, segment.start)] :
                [segment.start, addDirection(segment.relationship, segment.start), segment.end], i)
        });
    } else if (valueIsObject(value)) {
        return JSON.stringify(value);
    }
    const str = value.toString();
    if (str.startsWith("http") || str.startsWith("https")) {
        return <a target="_blank" href={str}>{str}</a>;
    }
    return str;
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
        return {
            field: key,
            headerName: key,
            headerClassName: 'table-small-header',
            renderCell: (c) => RenderTableValue(c.value),
            disableColumnSelector: true,
            flex: columnWidths ? columnWidths[i] % columnWidths.length : 1,
            disableClickEventBubbling: true
        }
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