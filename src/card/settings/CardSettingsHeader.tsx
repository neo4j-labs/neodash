import React from 'react';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import { FullscreenExit } from '@material-ui/icons';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { Tooltip } from '@material-ui/core';

const NeoCardSettingsHeader = ({
  onRemovePressed,
  onToggleCardSettings,
  onToggleCardExpand,
  expanded,
  fullscreenEnabled,
  onReportHelpButtonPressed,
  onClonePressed,
}) => {
  const maximizeButton = (
    <IconButton aria-label='maximize' onClick={onToggleCardExpand}>
      <FullscreenIcon />
    </IconButton>
  );

  const unMaximizeButton = (
    <IconButton aria-label='un-maximize' onClick={onToggleCardExpand}>
      <FullscreenExit />
    </IconButton>
  );

  return (
    <CardHeader
      avatar={
        <div style={{ marginTop: '-8px' }}>
          <DragIndicatorIcon
            className='drag-handle'
            style={{ color: 'grey', cursor: 'pointer', marginTop: '8px', marginLeft: '-7px', marginRight: '10px' }}
          ></DragIndicatorIcon>
          <Tooltip title='Help' aria-label='help'>
            <IconButton
              size='medium'
              style={{ marginTop: '-16px', padding: '8px' }}
              aria-label='help'
              onClick={onReportHelpButtonPressed}
            >
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete' aria-label='delete'>
            <IconButton
              size='medium'
              style={{ marginTop: '-16px', padding: '8px', color: 'red' }}
              aria-label='remove'
              onClick={onRemovePressed}
            >
              <DeleteOutlineIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Clone' aria-label='clone'>
            <IconButton
              size='medium'
              style={{ marginTop: '-16px', padding: '8px', color: 'green' }}
              aria-label='clone'
              onClick={onClonePressed}
            >
              <FileCopyOutlinedIcon />
            </IconButton>
          </Tooltip>
        </div>
      }
      action={
        <>
          {fullscreenEnabled ? expanded ? unMaximizeButton : maximizeButton : <></>}
          <Tooltip title='Save' aria-label='save'>
            <IconButton
              aria-label='save'
              onClick={(e) => {
                e.preventDefault();
                onToggleCardSettings();
              }}
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>
        </>
      }
      title=''
      subheader=''
    />
  );
};

export default NeoCardSettingsHeader;
