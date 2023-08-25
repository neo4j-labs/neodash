import React from 'react';
import { GraphChartVisualizationProps } from '../GraphChartVisualization';
import { getEntityHeader, getEntityHeaderForEdge } from '../util/NodeUtils';
import { Dialog } from '@neo4j-ndl/react';
import GraphEntityInspectionTable from './GraphEntityInspectionTable';

/**
 * Renders a pop-up window to inspect a node/relationship properties in a read-only table.
 */
export const NeoGraphChartInspectModal = (props: GraphChartVisualizationProps) => {
  let headerName = '';
  const propertySelections = props?.engine.selection ? props.engine.selection : {};
  const selectedEntity = props.interactivity?.selectedEntity;

  // Check if the user clicked relationship or edge
  const isRelationshipOrEdge = selectedEntity ? Object.getOwnPropertyNames(selectedEntity).includes('type') : false;

  if (selectedEntity) {
    // Get header name of modal based on the node or edge clicked by user
    headerName = isRelationshipOrEdge
      ? getEntityHeaderForEdge(selectedEntity, propertySelections)
      : getEntityHeader(selectedEntity);
  }

  return (
    <div>
      <Dialog
        size='large'
        open={props.interactivity.showPropertyInspector}
        onClose={() => props.interactivity.setPropertyInspectorOpen(false)}
        aria-labelledby='form-dialog-title'
      >
        <Dialog.Header id='form-dialog-title'>{headerName}</Dialog.Header>
        <Dialog.Content>
          <GraphEntityInspectionTable entity={props.interactivity.selectedEntity}></GraphEntityInspectionTable>
        </Dialog.Content>
      </Dialog>
    </div>
  );
};

export default NeoGraphChartInspectModal;
