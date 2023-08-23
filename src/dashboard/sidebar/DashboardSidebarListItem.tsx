import { Button, IconButton, SideNavigationGroupHeader } from '@neo4j-ndl/react';
import React from 'react';
import {
  CloudArrowDownIconOutline,
  CloudArrowUpIconOutline,
  EllipsisVerticalIconOutline,
} from '@neo4j-ndl/react/icons';
import Tooltip from '@mui/material/Tooltip';

export const DashboardSidebarListItem = ({ title, selected, saved, onSelect, onSave, onSettingsOpen }) => {
  return (
    <SideNavigationGroupHeader>
      <div style={{ display: 'contents', width: '100%' }}>
        <Button
          aria-label={'dashboard'}
          fill={selected == true ? 'outlined' : 'text'}
          size='medium'
          color={selected == true ? (saved == true ? 'primary' : 'warning') : 'neutral'}
          style={{
            width: '300px',
            whiteSpace: 'nowrap',
            overflowX: 'clip',
            justifyContent: 'left',
            marginRight: '10px',
            paddingLeft: '5px',
            paddingRight: '5px',
          }}
          onClick={() => {
            onSelect();
          }}
        >
          {saved == false ? <b>(Draft)</b> : <></>}
          {title ? title : '(no title)'}
        </Button>
        <IconButton
          aria-label={'new dashboard'}
          clean
          size='small'
          color={'neutral'}
          style={{
            justifyContent: 'left',
            paddingLeft: '0px',
            marginRight: '10px',
          }}
          onClick={(event) => {
            saved == false ? onSave() : onSettingsOpen(event);
          }}
        >
          {saved == true ? (
            <Tooltip title='Settings' aria-label='settings' disableInteractive>
              <EllipsisVerticalIconOutline
                style={{ float: 'right', marginRight: '-6px' }}
                className='btn-icon-base-r'
              />
            </Tooltip>
          ) : (
            <Tooltip title='Save' aria-label='save' disableInteractive>
              <CloudArrowUpIconOutline
                color='rgb(var(--palette-warning-text))'
                style={{ float: 'right', marginRight: '-6px' }}
                className='btn-icon-base-r'
              />
            </Tooltip>
          )}
        </IconButton>
      </div>
    </SideNavigationGroupHeader>
  );
};
