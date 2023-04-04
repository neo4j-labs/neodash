import React from 'react';
import { GraphChartVisualizationProps } from '../../GraphChartVisualization';
import { Tooltip } from '@material-ui/core';
import { IconButton } from '@neo4j-ndl/react';
import { LockOpenIconSolid, LockClosedIconSolid } from '@neo4j-ndl/react/icons';

export const NeoGraphChartLockButton = (props: GraphChartVisualizationProps) => {
  return (
    <IconButton aria-label='Lock graph layout icon' size='small' clean grouped>
      {props.interactivity.layoutFrozen ? (
        <Tooltip title='Toggle dynamic graph layout.' aria-label='unlock graph layout'>
          <LockClosedIconSolid
            onClick={() => {
              props.interactivity.setLayoutFrozen(false);
            }}
          />
        </Tooltip>
      ) : (
        <Tooltip title='Toggle fixed graph layout.' aria-label='lock graph layout'>
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
