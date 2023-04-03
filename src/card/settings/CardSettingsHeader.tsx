import React from 'react';
import CardHeader from '@material-ui/core/CardHeader';
import { Tooltip } from '@material-ui/core';
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
      <ExpandIcon className='n-w-6 n-h-6' />
    </IconButton>
  );

  const unMaximizeButton = (
    <IconButton aria-label='un-maximize' onClick={onToggleCardExpand}>
      <ShrinkIcon className='n-w-6 n-h-6' />
    </IconButton>
  );

  return (
    <CardHeader
      avatar={
        <div style={{ marginTop: '-8px', paddingBottom: '1px' }}>
          <IconButton clean grouped size='large'>
            <DragIcon className='drag-handle n-w-6 n-h-6' />
          </IconButton>
          <Tooltip title='Help' aria-label='help'>
            <IconButton aria-label='help' onClick={onReportHelpButtonPressed} clean size='large'>
              <QuestionMarkCircleIconOutline className='n-w-6 n-h-6' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete' aria-label='delete'>
            <IconButton style={{ color: 'red' }} aria-label='remove' onClick={onRemovePressed} clean size='large'>
              <TrashIconOutline className='n-w-6 n-h-6' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Clone' aria-label='clone'>
            <IconButton style={{ color: 'green' }} aria-label='clone' onClick={onClonePressed} clean size='large'>
              <DocumentDuplicateIconOutline className='n-w-6 n-h-6' />
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
              clean
              size='large'
            >
              <PlayCircleIconSolid className='n-w-6 n-h-6' />
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
