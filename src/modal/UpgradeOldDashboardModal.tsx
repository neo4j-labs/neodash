import React from 'react';
import { TextareaAutosize } from '@mui/material';
import { Button, Dialog } from '@neo4j-ndl/react';
import { TrashIconOutline, PlayIconSolid } from '@neo4j-ndl/react/icons';

export const NeoUpgradeOldDashboardModal = ({ open, text, clearOldDashboard, loadDashboard, themeMode }) => {
  return (
    <div>
      <Dialog
        size='large'
        open={open == true}
        aria-labelledby='form-dialog-title'
        className={`ndl-theme-${themeMode} n-bg-palette-neutral-bg-default`}
      >
        <Dialog.Header id='form-dialog-title'>Old Dashboard Found</Dialog.Header>
        <Dialog.Content>
          We've found a dashboard built with an old version of NeoDash. Would you like to attempt an upgrade, or start
          from scratch?
          <br />
          <b>Make sure you back up this dashboard first!</b>
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <Button
              onClick={() => {
                localStorage.removeItem('neodash-dashboard');
                clearOldDashboard();
              }}
              style={{ marginRight: '20px' }}
              color='danger'
              floating
            >
              Delete old dashboard
              <TrashIconOutline className='btn-icon-base-r' />
            </Button>
            <Button
              onClick={() => {
                localStorage.removeItem('neodash-dashboard');
                loadDashboard(text);
                clearOldDashboard();
              }}
              style={{ marginRight: '6px' }}
              color='success'
              size='large'
              floating
            >
              Upgrade
              <PlayIconSolid className='btn-icon-base-r' />
            </Button>
          </div>
          <TextareaAutosize
            style={{ minHeight: '200px', width: '100%', border: '1px solid lightgray' }}
            className={'textinput-linenumbers'}
            onChange={() => {}}
            value={text ? text : ''}
            aria-label=''
            placeholder=''
          />
        </Dialog.Content>
      </Dialog>
    </div>
  );
};

export default NeoUpgradeOldDashboardModal;
