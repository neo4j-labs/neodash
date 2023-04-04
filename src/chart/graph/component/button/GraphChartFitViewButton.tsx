import React from 'react';
import { Tooltip } from '@material-ui/core';
import { GraphChartVisualizationProps } from '../../GraphChartVisualization';
import { IconButton } from '@neo4j-ndl/react';
import { FitToScreenIcon } from '@neo4j-ndl/react/icons';

export const NeoGraphChartFitViewButton = (props: GraphChartVisualizationProps) => {
  return (
    <IconButton aria-label='fit graph to view' size='small' clean grouped>
      <Tooltip title='Fit graph to view.'>
        <FitToScreenIcon
          onClick={() => {
            props.interactivity.zoomToFit();
            throw `Not Implemented${props}`;
          }}
        />
      </Tooltip>
    </IconButton>
  );
};
