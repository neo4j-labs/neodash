import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import { GraphChartVisualizationProps } from '../GraphChartVisualization';
import { Card, CardHeader, IconButton } from '@material-ui/core';
import { NestedMenuItem, IconMenuItem } from 'mui-nested-menu';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import { RenderNode } from '../../../report/ReportRecordProcessing';
import { getNodeLabel } from '../util/NodeUtils';
import { GraphChartCreateModal } from './GraphChartCreateEntityModal';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import EditIcon from '@material-ui/icons/Edit';

export const GraphChartContextMenu = (props: GraphChartVisualizationProps) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedNode, setSelectedNode] = React.useState(undefined);
  const handleClose = () => {
    props.interactivity.setContextMenuOpen(false);
  };
  const dialogProps = { ...props, selectedNode: selectedNode, dialogOpen: dialogOpen, setDialogOpen: setDialogOpen };
  const dialog = <GraphChartCreateModal {...dialogProps} />;

  const menu = (
    <div
      style={{
        position: 'absolute',
        zIndex: 999,
        top: props.interactivity.clickPosition.y,
        left: props.interactivity.clickPosition.x,
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
          title={props.interactivity.selectedEntity && props.interactivity.selectedEntity.labels}
        />
        <IconMenuItem
          rightIcon={<SearchIcon />}
          label='Inspect'
          onClick={() => {
            props.interactivity.setContextMenuOpen(false);
            props.interactivity.setPropertyInspectorOpen(true);
          }}
        ></IconMenuItem>
        <IconMenuItem
          rightIcon={<EditIcon />}
          label='Edit'
          onClick={() => {
            props.interactivity.setContextMenuOpen(false);
            props.interactivity.setPropertyInspectorOpen(true);
          }}
        ></IconMenuItem>

        <NestedMenuItem label='Create relationship...' nonce={undefined} parentMenuOpen={true}>
          <div style={{ maxHeight: '400px', overflow: 'scroll' }}>
            <table>
              {props.data &&
                props.data.nodes.map((node) => (
                  <tr>
                    <MenuItem
                      onClick={() => {
                        setSelectedNode(node);
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
        <IconMenuItem
          rightIcon={<ZoomOutMapIcon />}
          label='Expand'
          onClick={() => {
            props.interactivity.setContextMenuOpen(false);
            props.interactivity.setPropertyInspectorOpen(true);
          }}
        ></IconMenuItem>
      </Card>
    </div>
  );

  return (
    <>
      {dialog}
      {props.interactivity.contextMenuOpen ? menu : <></>}
    </>
  );
};
