import React from 'react';
import { GraphChartVisualizationProps } from '../GraphChartVisualization';
import { getEntityHeader } from '../util/NodeUtils';
import { Dialog } from '@neo4j-ndl/react';
import GraphEntityInspectionTable from './GraphEntityInspectionTable';

/**
 * Renders a pop-up window to inspect a node/relationship properties in a read-only table.
 */
export const NeoGraphChartInspectModal = (props: GraphChartVisualizationProps) => {
  return (
    <div>
      <Dialog
        size='large'
        open={props.interactivity.showPropertyInspector}
        onClose={() => props.interactivity.setPropertyInspectorOpen(false)}
        aria-labelledby='form-dialog-title'
      >
        <Dialog.Header id='form-dialog-title'>
          {props.interactivity.selectedEntity
            ? getEntityHeader(props.interactivity.selectedEntity, props?.engine?.selection)
            : ''}
        </Dialog.Header>
        <Dialog.Content>
          <GraphEntityInspectionTable
            entity={props.interactivity.selectedEntity}
            theme={props.style.theme}
          ></GraphEntityInspectionTable>
        </Dialog.Content>
      </Dialog>
    </div>
  );
};

export default NeoGraphChartInspectModal;
