import { IconButton, TextField, Tooltip } from '@material-ui/core';
import React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AlertSettingsModal from './AlertSettingsModal';

// The sidebar that appears on the left side of the dashboard.
export const AlertDrawerHeader = ({ databaseList }) => {
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  return (
    <table style={{ width: '100%' }}>
      <tbody>
        <tr>
          <td>
            <TextField
              id='standard-outlined'
              label=''
              placeholder='Drawer Name...'
              className={'no-underline large'}
              maxRows={4}
            />
          </td>
          <td>
            <Tooltip title='Settings' aria-label='settings'>
              <IconButton
                aria-label='settings'
                onClick={() => {
                  setSettingsOpen(true);
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
            <AlertSettingsModal
              databaseList={databaseList}
              settingsOpen={settingsOpen}
              setSettingsOpen={setSettingsOpen}
            ></AlertSettingsModal>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default AlertDrawerHeader;
