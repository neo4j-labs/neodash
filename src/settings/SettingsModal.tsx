import React from 'react';
import NeoSetting from '../component/field/Setting';
import { DASHBOARD_SETTINGS } from '../config/DashboardConfig';
import { Dialog, IconButton, MenuItem } from '@neo4j-ndl/react';
import { Cog6ToothIconOutline } from '@neo4j-ndl/react/icons';
import Tooltip from '@mui/material/Tooltip/Tooltip';

export const NeoSettingsModal = ({ dashboardSettings, updateDashboardSetting }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const settings = DASHBOARD_SETTINGS;
  // Else, build the advanced settings view.
  const advancedDashboardSettings = (
    <div style={{ marginLeft: '-10px' }}>
      {Object.keys(settings)
        .filter((setting) => !settings[setting].hidden)
        .map((setting) => (
          <div key={setting}>
            <NeoSetting
              key={setting}
              value={dashboardSettings[setting]}
              type={settings[setting].type}
              disabled={settings[setting].disabled}
              helperText={settings[setting].helperText}
              label={settings[setting].label}
              defaultValue={settings[setting].default}
              choices={settings[setting].values}
              onChange={(e) => updateDashboardSetting(setting, e)}
            />
            <br />
          </div>
        ))}
    </div>
  );

  return (
    <>
      <Tooltip title='Settings' aria-label='settings' disableInteractive>
        <IconButton className='n-mx-1' onClick={handleClickOpen} aria-label='Settings'>
          <Cog6ToothIconOutline />
        </IconButton>
      </Tooltip>

      <Dialog size='large' open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <Dialog.Header id='form-dialog-title'>
          <Cog6ToothIconOutline className='icon-base icon-inline text-r' />
          Dashboard Settings
        </Dialog.Header>
        <Dialog.Content>
          You can modify settings for your entire dashboard here.
          <br />
          <br />
          {advancedDashboardSettings}
          <br />
        </Dialog.Content>
      </Dialog>
    </>
  );
};

export default NeoSettingsModal;
