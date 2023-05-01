import React from 'react';
import { Tooltip } from '@material-ui/core';
import TimerIcon from '@material-ui/icons/Timer';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import LoopIcon from '@material-ui/icons/Loop';
import CancelIcon from '@material-ui/icons/Cancel';
import PanToolIcon from '@material-ui/icons/PanTool';

export const getStoppingIcon = (flipped) => {
  return (
    <Tooltip title='Stopping' aria-label='stopping'>
      <PanToolIcon
        style={{
          transform: flipped ? 'rotate(180deg)' : 'rotate(0deg)',
          color: 'disabled',
        }}
      />
    </Tooltip>
  );
};
export const getCompleteIcon = (flipped) => {
  return (
    <Tooltip title='Completed' aria-label='completed'>
      <CheckCircleIcon
        style={{
          transform: flipped ? 'rotate(180deg)' : 'rotate(0deg)',
          color: '#00aa00',
        }}
      />
    </Tooltip>
  );
};

export const getRunningIcon = () => {
  return (
    <Tooltip title='Running' aria-label='running'>
      <LoopIcon
        color='disabled'
        style={{
          transformOrigin: '50% 50%',
          animation: 'MuiCircularProgress-keyframes-circular-rotate 1.4s linear infinite',
        }}
      />
    </Tooltip>
  );
};

export const getWaitingIcon = (flipped) => {
  return (
    <Tooltip title='Waiting' aria-label='waiting'>
      <TimerIcon
        color='disabled'
        style={{
          transform: flipped ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      />
    </Tooltip>
  );
};

export const getCancelledIcon = (flipped) => {
  return (
    <Tooltip title='Cancelled' aria-label='cancelled'>
      <CancelIcon
        color='disabled'
        style={{
          transform: flipped ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      />
    </Tooltip>
  );
};

export const getErrorIcon = (flipped) => {
  return (
    <Tooltip title='Error' aria-label='error'>
      <CancelIcon
        color='error'
        style={{
          transform: flipped ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      />
    </Tooltip>
  );
};
