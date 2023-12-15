import React from 'react';
import { Tooltip } from '@mui/material';
import { GraphChartVisualizationProps } from '../../GraphChartVisualization';
import { IconButton } from '@neo4j-ndl/react';
import { FitToScreenIcon } from '@neo4j-ndl/react/icons';

/**
 * Renders an icon on the bottom-right of the graph visualization to fit the current graph to the user's view.
 */
export const NeoGraphChartFitViewButton = (props: GraphChartVisualizationProps) => {
  return (
    <Tooltip title='Fit graph to view.' aria-label={'fit to screen'} disableInteractive>
      <IconButton
        aria-label='fit graph to view'
        size='small'
        onClick={() => {
          props.interactivity.zoomToFit();
        }}
        clean
        grouped
      >
        <FitToScreenIcon
          onClick={() => {
            props.interactivity.zoomToFit();
          }}
        />
      </IconButton>
    </Tooltip>
  );
};
