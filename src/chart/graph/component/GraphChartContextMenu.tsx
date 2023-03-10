import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import { GraphChartVisualizationProps } from '../GraphChartVisualization';
import { Card, CardHeader, IconButton } from '@material-ui/core';
import { NestedMenuItem, IconMenuItem } from 'mui-nested-menu';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import { RenderNode, RenderNodeChip, RenderRelationshipChip } from '../../../report/ReportRecordProcessing';
import { getNodeLabel } from '../util/NodeUtils';
import { EditAction, EditType, GraphChartEditModal } from './GraphChartEditModal';
import EditIcon from '@material-ui/icons/Edit';
import { handleExpand, handleGetNodeRelTypes } from '../util/ExplorationUtils';
import { useEffect } from 'react';
import { mergeDatabaseStatCountsWithCountsInView } from '../util/ExplorationUtils';

/**
 * Renders the context menu that is present when a user right clicks on a node or relationship in the graph.
 * The context menu can be used to inspect and edit nodes/relationships, or explore the graph.
 */
export const GraphChartContextMenu = (props: GraphChartVisualizationProps) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editableEntity, setEditableEntity] = React.useState(undefined);
  const [editableEntityType, setEditableEntityType] = React.useState(EditType.Node);
  const [action, setAction] = React.useState(EditAction.Create);
  const [neighbourRelCounts, setNeighbourRelCounts] = React.useState([]);
  const handleClose = () => {
    props.interactivity.setContextMenuOpen(false);
  };
  const dialogProps = { ...props, selectedNode: editableEntity, dialogOpen: dialogOpen, setDialogOpen: setDialogOpen };
  const expandable = props.interactivity.selectedEntity && props.interactivity.selectedEntity.labels !== undefined;
  const [cachedNeighbours, setCachedNeighbours] = React.useState(false);
  // Clear neighbour cache when selection changes.
  useEffect(() => {
    setCachedNeighbours(false);
  }, [props.interactivity.selectedEntity]);

  const menu = (
    <div
      style={{
        position: 'absolute',
        zIndex: 999,
        top: Math.min(props.interactivity.clickPosition.y, props.style.height - 200),
        left: Math.min(props.interactivity.clickPosition.x, props.style.width - 200),
      }}
    >
      <Card id='basic-menu'>
        <CardHeader
          style={{ marginTop: '-6px', marginBottom: '-8px', color: 'black' }}
          action={
            <IconButton
              aria-label='close'
              style={{
                padding: '4px',
                marginLeft: '20px',
                marginTop: '7px',
              }}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          }
          titleTypographyProps={{ variant: 'h6' }}
          title={
            props.interactivity.selectedEntity
              ? expandable
                ? props.interactivity.selectedEntity.labels.join(', ')
                : props.interactivity.selectedEntity.type
              : ''
          }
        />
        <IconMenuItem
          rightIcon={<SearchIcon />}
          label='Inspect'
          onClick={() => {
            props.interactivity.setContextMenuOpen(false);
            props.interactivity.setPropertyInspectorOpen(true);
          }}
        ></IconMenuItem>
        {props.interactivity.enableEditing ? (
          <IconMenuItem
            rightIcon={<EditIcon />}
            label='Edit'
            onClick={() => {
              setEditableEntityType(expandable ? EditType.Node : EditType.Relationship);
              setAction(EditAction.Edit);
              props.interactivity.setContextMenuOpen(false);
              setDialogOpen(true);
            }}
          ></IconMenuItem>
        ) : (
          <></>
        )}

        {props.interactivity.enableExploration && expandable ? (
          <NestedMenuItem
            label='Expand...'
            nonce={undefined}
            parentMenuOpen={true}
            onMouseOver={() => {
              if (!cachedNeighbours) {
                setCachedNeighbours(true);
                const id = props.interactivity.selectedEntity?.id;
                if (id < 0) {
                  setNeighbourRelCounts([]);
                  return;
                }
                handleGetNodeRelTypes(id, props.engine, (records) =>
                  setNeighbourRelCounts(mergeDatabaseStatCountsWithCountsInView(id, records, props.data.links))
                );
              }
            }}
          >
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table>
                {neighbourRelCounts.length == 0 ? (
                  <tr>
                    <td style={{ paddingLeft: 15, minWidth: '250px' }}> No relationships...</td>
                  </tr>
                ) : (
                  <></>
                )}
                {neighbourRelCounts.length > 0 &&
                  neighbourRelCounts.map((item) => {
                    const dir = item[1] == 'any' ? undefined : item[1] == 'out';
                    return (
                      <tr>
                        <MenuItem
                          onClick={() => {
                            props.interactivity.setContextMenuOpen(false);
                            handleExpand(props.interactivity.selectedEntity.id, item[0], item[1], props);
                            setDialogOpen(false);
                            setCachedNeighbours(false);
                          }}
                        >
                          <td style={{ minWidth: '250px', overflow: 'hidden' }}>
                            {RenderNodeChip(props.interactivity.selectedEntity.labels, '#fff', '1px solid lightgrey')}
                            &nbsp;
                            {RenderRelationshipChip(item[0], dir, '#dedede')}
                            &nbsp;
                            {RenderNodeChip('...', '#fff', '1px solid lightgrey')}
                          </td>
                          <td style={{ width: 'auto', marginLeft: '15px' }}>{item[2]}</td>
                        </MenuItem>
                      </tr>
                    );
                  })}
              </table>
            </div>
          </NestedMenuItem>
        ) : (
          <></>
        )}

        {props.interactivity.enableEditing && expandable ? (
          <NestedMenuItem label='Create relationship...' nonce={undefined} parentMenuOpen={true}>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table>
                {props.data &&
                  props.data.nodes.map((node) => (
                    <tr>
                      <MenuItem
                        onClick={() => {
                          setEditableEntityType(EditType.Relationship);
                          setAction(EditAction.Create);
                          setEditableEntity(node);
                          props.interactivity.setContextMenuOpen(false);
                          setDialogOpen(true);
                        }}
                      >
                        <td style={{ width: '150px', overflow: 'hidden' }}>{RenderNode(node)}</td>
                        <td style={{ width: 'auto', marginLeft: '15px' }}>
                          {props.engine.selection[node.mainLabel] ? getNodeLabel(props.engine.selection, node) : ''}
                        </td>
                      </MenuItem>
                    </tr>
                  ))}
              </table>
            </div>
          </NestedMenuItem>
        ) : (
          <></>
        )}
      </Card>
    </div>
  );

  return (
    <>
      <GraphChartEditModal type={editableEntityType} action={action} {...dialogProps} />
      {props.interactivity.contextMenuOpen ? menu : <></>}
    </>
  );
};
