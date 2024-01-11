import React from 'react';
import { GraphChartVisualizationProps } from '../../GraphChartVisualization';
import { Tooltip } from '@mui/material';
import { IconButton } from '@neo4j-ndl/react';
import { LockOpenIconSolid, LockClosedIconSolid } from '@neo4j-ndl/react/icons';

/**
 * Renders a button that can be used to 'lock' = freeze the current graph layout by disabling the force layout.
 */
export const NeoGraphChartLockButton = (props: GraphChartVisualizationProps) => {
  return (
    <IconButton aria-label='Lock graph layout icon' size='small' clean grouped>
      {props.interactivity.layoutFrozen ? (
        <Tooltip title='Toggle dynamic graph layout.' aria-label='unlock graph layout' disableInteractive>
          <LockClosedIconSolid
            onClick={() => {
              props.interactivity.setLayoutFrozen(false);
            }}
          />
        </Tooltip>
      ) : (
        <Tooltip title='Toggle fixed graph layout.' aria-label='lock graph layout' disableInteractive>
          <LockOpenIconSolid
            onClick={() => {
              if (props.interactivity.nodePositions == undefined) {
                props.interactivity.nodePositions = {};
              }
              props.interactivity.setLayoutFrozen(true);
            }}
          />
        </Tooltip>
      )}
    </IconButton>
  );
};
