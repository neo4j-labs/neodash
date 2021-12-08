import React, { useCallback } from 'react';
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

function getIdentity(row, idColumnHeader) {
    return row[idColumnHeader]?.toInt();
}

function getEditableMapping(key) {
    // Expected format is:
    // editable,e.checked,boolean,Done
    // But this is acceptable too:
    // editable,e.checked,,Column label
    if(key.startsWith("editable,")){
        
        let parts = key.split(",");
        if(parts.length >= 4){
            
            let editable = {};    
            
            // Remove "editable" prefix
            parts.shift();
            
            let selectorVariableDotProperty = parts.shift().split(".");

            if(selectorVariableDotProperty.length != 2){
                return undefined;
            }

            editable.selectorVariable = selectorVariableDotProperty[0];
            editable.selectedProperty = selectorVariableDotProperty[1];
            editable.type = parts.shift();
            
            // Fallback in case no type is specified
            if(!editable.type.length){
                editable.type = "string";
            }

            editable.headerName = parts.join(",");

            return editable
        }
    }
    
    return undefined;
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
    return value.toString();
}
const NeoTableChartEditable = (props: ChartProps) => {
    if (props.records == null || props.records.length == 0 || props.records[0].keys == null) {
        return <>No data, re-run the report.</>
    }

    const [extraRecords, setExtraRecords] = React.useState([]);

    const columHeadersToHide = [];

    const columns = props.records[0].keys.map((key, value) => {

        const editable = getEditableMapping(key);

        // Common properties for all columns
        var column = {
            field: key,
            headerName: key,
            headerClassName: 'table-small-header',
            disableColumnSelector: true,
            flex: 1,
            disableClickEventBubbling: true,
            minWidth: 150
        }
        
        if (editable) {
            // Properties for editable columns
            column = {
                ...column, ...{
                    headerName: editable.headerName,
                    type: editable.type,
                    editable: true
                }
            };

            // Remember to hide the corresponding id column from view
            columHeadersToHide.push(`id(${editable.selectorVariable})`);
        } else {
            column = {
                // Properties for all other columns
                ...column, ...{
                    // Render the cell according to a custom function
                    renderCell: (c) => RenderTableValue(c.value),
                    // TODO: assign correct type for remaining types (to get the correct sorting/filtering comparator):
                    // https://v4.mui.com/components/data-grid/columns/#column-types
                    type: props.records[0]._fields[value].__isInteger__ ? "number" : "string"
                }
            };
        }

        return column;
    })

    // Hide column id headers after the columns have been mapped
    for (var x in columns){
        if(columHeadersToHide.indexOf(columns[x].field) > -1){
            columns[x].hide = true;
        }
    }

    const [rows, setRows] = React.useState(props.records.map((record, rownumber) => {
        return Object.assign({ id: rownumber }, ...record._fields.map((field, i) => ({ [record.keys[i]]: field })));
    }));

    const pagination = {
        //   pagination: true,
        //   autoPageSize: true
    };

    // NOTE: Tested with this cypher query:
    // MATCH Path=(e:Entity)-[:COUNTRY]->(c:Country), (f:Filing)-[:BENEFITS]->(e) RETURN Path, e.name as Entity, c.name AS `editable,c.name,,Country`, id(c), suM(f.amount) as `Total Benefit ($)`, e.checked AS `editable,e.checked,boolean,Done`, id(e)

    const handleCellEditCommit = useCallback(

        ({ id, field, value }) => {
            const row = rows[id];
            const editable = getEditableMapping(field);

            if (editable) {
                const s = editable.selectorVariable;
                const property = editable.selectedProperty;
                const idColumnHeader = `id(${s})`;
                const identity = getIdentity(row, idColumnHeader);
                const query = `MATCH (${s}) WHERE id(${s}) = $id SET ${s}.${property} = $value RETURN ${s}`;
                const parameters = { id: identity, value: value };
                console.log(query, parameters);

                props.queryCallback && props.queryCallback(query, parameters, setExtraRecords);

                // Apply changes to each row which shows the changed property of the same node.
                // NOTE: May occur in unexpected behavior when properties of multiple nodes are shown in a table row.
                const newRows = rows.map(newRow => {
                    
                    if (newRow[idColumnHeader] && getIdentity(newRow, idColumnHeader) === identity) {
                        newRow[field] = value;
                    }
                    
                    return newRow;
                });

                setRows(newRows);
            }

            // TODO: Refresh other dashboards in response to this change,
            // else the other charts will not show the new value

            // Setting a global parameter will force all charts to refresh (including this one),
            // which is not what I want because I'll lose my scroll position
            // props.setGlobalParameter('jiptest', Date.now());
        },
        [rows],
    );

    return (
        <div style={{ height: "100%", width: '100%' }}>

            <DataGrid
                rows={rows}
                columns={columns}
                disableSelectionOnClick
                onCellEditCommit={handleCellEditCommit}
                {...pagination}
            />

        </div>
    );
}

export default NeoTableChartEditable;