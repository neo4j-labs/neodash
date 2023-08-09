import React from 'react';
import { Tooltip } from '@mui/material';
import { replaceDashboardParametersInString } from '../../../ChartUtils';
import { GraphChartVisualizationProps } from '../../GraphChartVisualization';
import { IconButton } from '@neo4j-ndl/react';
import { MagnifyingGlassIconOutline } from '@neo4j-ndl/react/icons';

/**
 * If a deep-link URL is specified in the advanced settings, renders an icon at the top right of the graph visualization that redirects to the link.
 */
export const NeoGraphChartDeepLinkButton = (props: GraphChartVisualizationProps) => {
  return (
    <IconButton
      aria-label='investigate graph'
      size='small'
      clean
      grouped
      href={replaceDashboardParametersInString(props.interactivity.drilldownLink, props.data.parameters)}
      target='_blank'
    >
      <Tooltip title='Investigate' disableInteractive>
        <MagnifyingGlassIconOutline />
      </Tooltip>
    </IconButton>
  );
};
