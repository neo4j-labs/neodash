import React, { useCallback } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Badge from '@material-ui/core/Badge';
import { GraphChartVisualizationProps } from '../GraphChartVisualization';
import { getEntityHeader } from '../util/NodeUtils';
import GraphEntityInspectionTable from './GraphEntityInspectionTable';

/**
 * Renders a pop-up window to inspect a node/relationship properties in a read-only table.
 */
export const NeoGraphChartInspectModal = (props: GraphChartVisualizationProps) => {
  return (
    <div>
      <Dialog
        maxWidth={'lg'}
        open={props.interactivity.showPropertyInspector}
        onClose={() => {
            props.interactivity.setPropertyInspectorOpen(false)
            console.log("here")
            console.log(props.interactivity.selectedEntity?.id)
          }
        }
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>
          {props.interactivity.selectedEntity ? getEntityHeader(props.interactivity.selectedEntity) : ''}
          <IconButton
            onClick={() => props.interactivity.setPropertyInspectorOpen(false)}
            style={{ padding: '3px', marginLeft: '20px', float: 'right' }}
          >
            <Badge overlap='rectangular' badgeContent={''}>
              <CloseIcon />
            </Badge>
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <GraphEntityInspectionTable entity={props.interactivity.selectedEntity}></GraphEntityInspectionTable>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NeoGraphChartInspectModal;
