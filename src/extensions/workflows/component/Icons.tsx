import React from 'react';
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LoopIcon from '@mui/icons-material/Loop';
import CancelIcon from '@mui/icons-material/Cancel';
import PanToolIcon from '@mui/icons-material/PanTool';
import { Tooltip } from '@mui/material';

export const getStoppingIcon = (flipped) => {
  return (
    <Tooltip title='Stopping' aria-label='stopping' disableInteractive>
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
    <Tooltip title='Completed' aria-label='completed' disableInteractive>
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
    <Tooltip title='Running' aria-label='running' disableInteractive>
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
    <Tooltip title='Waiting' aria-label='waiting' disableInteractive>
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
    <Tooltip title='Cancelled' aria-label='cancelled' disableInteractive>
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
    <Tooltip title='Error' aria-label='error' disableInteractive>
      <CancelIcon
        color='error'
        style={{
          transform: flipped ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      />
    </Tooltip>
  );
};
