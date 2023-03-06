import React from 'react';
import { GraphChartVisualizationProps } from '../../GraphChartVisualization';
import { Tooltip } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';

/**
 * Renders a button that can be used to 'lock' = freeze the current graph layout by disabling the force layout.
 */
export const NeoGraphChartLockButton = (props: GraphChartVisualizationProps) => {
  return props.interactivity.layoutFrozen ? (
    <Tooltip title='Toggle dynamic graph layout.' aria-label=''>
      <LockIcon
        onClick={() => {
          props.interactivity.setLayoutFrozen(false);
        }}
        style={{ fontSize: '1.3rem', opacity: 0.6, bottom: 12, right: 12, position: 'absolute', zIndex: 5 }}
        color='disabled'
        fontSize='small'
      ></LockIcon>
    </Tooltip>
  ) : (
    <Tooltip title='Toggle fixed graph layout.' aria-label=''>
      <LockOpenIcon
        onClick={() => {
          if (props.interactivity.nodePositions == undefined) {
            props.interactivity.nodePositions = {};
          }
          props.interactivity.setLayoutFrozen(true);
        }}
        style={{ fontSize: '1.3rem', opacity: 0.6, bottom: 12, right: 12, position: 'absolute', zIndex: 5 }}
        color='disabled'
        fontSize='small'
      ></LockOpenIcon>
    </Tooltip>
  );
};
