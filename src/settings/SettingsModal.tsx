
import React from 'react';
import { Grid, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import NeoSetting from '../component/field/Setting';
import { DASHBOARD_SETTINGS } from '../config/DashboardConfig';
import { HeroIcon, IconButton, Dialog } from '@neo4j-ndl/react';



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
    const advancedDashboardSettings = <div style={{ marginLeft: "-10px" }}>
        {Object.keys(settings).map(setting =>
            <>
            <NeoSetting key={setting} name={setting}
                value={dashboardSettings[setting]}
                type={settings[setting]["type"]}
                disabled={settings[setting]["disabled"]}
                helperText={settings[setting]["helperText"]}
                label={settings[setting]["label"]}
                defaultValue={settings[setting]["default"]}
                choices={settings[setting]["values"]}
                onChange={(e) => updateDashboardSetting(setting, e)}
            /><br/></>
        )}
    </div>

    return (
        <div>
            <ListItem button onClick={handleClickOpen}>
                <ListItemIcon>
                    <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="CogIcon" />
                </ListItemIcon>
                <ListItemText primary="Settings" />
            </ListItem>

            <Dialog size="large" open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <Dialog.Header id="form-dialog-title">
                <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="CogIcon"
                            style={{ display: "inline", marginRight: "5px", marginBottom: "5px" }} />
                    Dashboard Settings
                </Dialog.Header>
                <Dialog.Content>
                    You can modify settings for your entire dashboard here.      
                    <br/><br/>
                    {advancedDashboardSettings}

                </Dialog.Content>
            </Dialog>
        </div>
    );
}

export default (NeoSettingsModal);


