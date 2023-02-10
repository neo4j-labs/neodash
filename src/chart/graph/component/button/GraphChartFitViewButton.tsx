import React from 'react';
import { Tooltip } from '@material-ui/core';
import SettingsOverscanIcon from '@material-ui/icons/SettingsOverscan';
import { GraphChartVisualizationProps } from '../../GraphChartVisualization';

export const NeoGraphChartFitViewButton = (props: GraphChartVisualizationProps) => {
  return (
    <Tooltip title='Fit graph to view.' aria-label=''>
      <SettingsOverscanIcon
        onClick={() => {
          //   props.ref.current.zoomToFit(400);
          throw `Not Implemented${  props}`;
        }}
        style={{ fontSize: '1.3rem', opacity: 0.6, bottom: 11, right: 34, position: 'absolute', zIndex: 5 }}
        color='disabled'
        fontSize='small'
      ></SettingsOverscanIcon>
    </Tooltip>
  );
};
