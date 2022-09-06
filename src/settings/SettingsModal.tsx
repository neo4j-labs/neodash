
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import NeoSetting from '../component/field/Setting';
import { DASHBOARD_SETTINGS } from '../config/DashboardConfig';
import { HeroIcon, IconButton } from '@neo4j-ndl/react';



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

            <Dialog maxWidth={"lg"} open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="CogIcon"
                            style={{ display: "inline", marginRight: "5px", marginBottom: "5px" }} />
                    Dashboard Settings
                    
                    <IconButton onClick={handleClose} style={{ float: "right" }} clean>
                        <HeroIcon className="ndl-icon n-w-6 n-h-6" type="outline" iconName="XIcon" />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You can modify settings for your entire dashboard here.      
                        <br/><br/>
                        {advancedDashboardSettings}
                    </DialogContentText>

                </DialogContent>
            </Dialog>
        </div>
    );
}

export default (NeoSettingsModal);


