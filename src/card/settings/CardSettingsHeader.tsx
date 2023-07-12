import React from 'react';
import { Tooltip, CardHeader } from '@mui/material';
import { IconButton } from '@neo4j-ndl/react';
import {
  ExpandIcon,
  ShrinkIcon,
  DragIcon,
  QuestionMarkCircleIconOutline,
  TrashIconOutline,
  DocumentDuplicateIconOutline,
  PlayCircleIconSolid,
} from '@neo4j-ndl/react/icons';

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
      <ExpandIcon />
    </IconButton>
  );

  const unMaximizeButton = (
    <IconButton aria-label='un-maximize' onClick={onToggleCardExpand}>
      <ShrinkIcon />
    </IconButton>
  );

  return (
    <CardHeader
      avatar={
        <div style={{ marginTop: '-8px', paddingBottom: '1px' }}>
          <IconButton clean size='medium' aria-label={'Move Report'} className='n-relative -n-left-3 drag-handle'>
            <DragIcon aria-label={'Move Report'} />
          </IconButton>
          <Tooltip title='Help' aria-label='Help' disableInteractive>
            <IconButton aria-label='Help' onClick={onReportHelpButtonPressed} clean size='medium'>
              <QuestionMarkCircleIconOutline aria-label={'Help'} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete' aria-label='Delete' disableInteractive>
            <IconButton style={{ color: 'red' }} aria-label='remove' onClick={onRemovePressed} clean size='medium'>
              <TrashIconOutline aria-label={'Delete'} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Clone' aria-label='Clone' disableInteractive>
            <IconButton style={{ color: 'green' }} aria-label='Clone' onClick={onClonePressed} clean size='medium'>
              <DocumentDuplicateIconOutline aria-label={'Clone'} />
            </IconButton>
          </Tooltip>
        </div>
      }
      action={
        <>
          {fullscreenEnabled ? expanded ? unMaximizeButton : maximizeButton : <></>}
          <Tooltip title='Run' aria-label='run' disableInteractive>
            <IconButton
              aria-label='run'
              onClick={(e) => {
                e.preventDefault();
                onToggleCardSettings();
              }}
              clean
              size='medium'
            >
              <PlayCircleIconSolid />
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
