import React from 'react';
import NeoSetting from '../component/field/Setting';
import { DASHBOARD_SETTINGS } from '../config/DashboardConfig';
import { SideNavigationItem } from '@neo4j-ndl/react';
import { Cog6ToothIconOutline } from '@neo4j-ndl/react/icons';
import { Dialog } from '@neo4j-ndl/react';

export const NeoSettingsModal = ({ dashboardSettings, updateDashboardSetting, navItemClass }) => {
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
      {Object.keys(settings).map((setting) => (
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
    <div>
      <SideNavigationItem onClick={handleClickOpen} icon={<Cog6ToothIconOutline className={navItemClass} />}>
        Settings
      </SideNavigationItem>

      <Dialog size='large' open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <Dialog.Header id='form-dialog-title'>
          <Cog6ToothIconOutline
            className='n-w-6 n-h-6'
            style={{ display: 'inline', marginRight: '5px', marginBottom: '5px' }}
          />
          Dashboard Settings
        </Dialog.Header>
        <Dialog.Content>
          You can modify settings for your entire dashboard here.
          <br />
          <br />
          {advancedDashboardSettings}
        </Dialog.Content>
      </Dialog>
    </div>
  );
};

export default NeoSettingsModal;
