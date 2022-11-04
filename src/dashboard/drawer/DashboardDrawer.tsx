import { Drawer, ListItem, IconButton, Divider, ListItemIcon, ListItemText, List, Button } from '@material-ui/core';
import React from 'react';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import OfflineBoltIcon from '@material-ui/icons/OfflineBolt';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import NeoSaveModal from '../../modal/SaveModal';
import NeoLoadModal from '../../modal/LoadModal';
import NeoShareModal from '../../modal/ShareModal';
import { NeoAboutModal } from '../../modal/AboutModal';
import { NeoReportExamplesModal } from '../../modal/ReportExamplesModal';
import {
  applicationGetConnection,
  applicationHasAboutModalOpen,
  applicationIsStandalone,
} from '../../application/ApplicationSelectors';
import { connect } from 'react-redux';
import { setAboutModalOpen, setConnected, setWelcomeScreenOpen } from '../../application/ApplicationActions';
import NeoSettingsModal from "../../settings/SettingsModal";
import { createNotificationThunk } from "../../page/PageThunks";
import { getDashboardExtensions, getDashboardSettings } from "../DashboardSelectors";
import { updateDashboardSetting } from "../../settings/SettingsActions";
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import CategoryIcon from '@material-ui/icons/Category';
import NeoExtensionsModal from "../../extensions/ExtensionsModal"; 
import { getExampleReports } from "../../extensions/ExtensionUtils";


// The sidebar that appears on the left side of the dashboard.
export const NeoDrawer = ({ open, hidden, connection, dashboardSettings, extensions,
    updateDashboardSetting, handleDrawerClose, onAboutModalOpen, resetApplication }) => {

  const content = (
    <Drawer
      variant="permanent"
      style={
        open
          ? {
              position: 'relative',
              overflowX: 'hidden',
              width: '240px',
              transition: 'width 125ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
              boxShadow: '2px 1px 10px 0px rgb(0 0 0 / 12%)',
            }
          : {
              position: 'relative',
              overflowX: 'hidden',
              boxShadow: ' 2px 1px 10px 0px rgb(0 0 0 / 12%)',

              transition: 'width 125ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
              width: '56px',
            }
      }
      open={open == true}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          overflowX: 'hidden',
          justifyContent: 'flex-end',
          padding: '0 8px',
          minHeight: '64px',
        }}
      >
        <ListItem>
          <Button
            component="label"
            onClick={resetApplication}
            style={{ backgroundColor: 'white', marginLeft: '-8px' }}
            color="default"
            variant="outlined"
            size="small"
            startIcon={<ExitToAppIcon />}
          >
            Menu
          </Button>
        </ListItem>

                <IconButton onClick={handleDrawerClose}>
                    <ChevronLeftIcon />
                </IconButton>
            </div>
            <Divider />
            <div >
                <ListItem style={{ background: "white", height: "47px" }} >
                    <ListItemIcon>
                    </ListItemIcon>
                    <ListItemText primary="" />
                </ListItem>
            </div>
            <Divider />
            <List>
                <div>
                    <NeoSettingsModal dashboardSettings={dashboardSettings} updateDashboardSetting={updateDashboardSetting}></NeoSettingsModal>
                    <NeoSaveModal></NeoSaveModal>
                    <NeoLoadModal></NeoLoadModal>
                    <NeoShareModal></NeoShareModal>
                </div>
            </List>
            <Divider />
            <List>

                <NeoReportExamplesModal
                    extensions={extensions}
                    examples={getExampleReports(extensions)}
                    database={connection.database}>
                </NeoReportExamplesModal>
                <NeoExtensionsModal></NeoExtensionsModal>

            </List>
            <Divider />
            <List>
                <ListItem button onClick={(e) => window.open("https://neo4j.com/labs/neodash/2.2/user-guide/", "_blank")}>
                    <ListItemIcon>
                        <LibraryBooksIcon />
                    </ListItemIcon>
                    <ListItemText primary="Documentation" />
                </ListItem>
                <ListItem button onClick={onAboutModalOpen}>
                    <ListItemIcon>
                        <InfoOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="About" />
                </ListItem>
            </List>
            <Divider />
        </Drawer>

    );
    return content;
}

const mapStateToProps = state => ({
    dashboardSettings: getDashboardSettings(state),
    hidden: applicationIsStandalone(state),
    extensions: getDashboardExtensions(state),
    aboutModalOpen: applicationHasAboutModalOpen(state),
    connection: applicationGetConnection(state)
});

const mapDispatchToProps = (dispatch) => ({
  onAboutModalOpen: () => dispatch(setAboutModalOpen(true)),
  updateDashboardSetting: (setting, value) => {
    dispatch(updateDashboardSetting(setting, value));
  },
  resetApplication: () => {
    dispatch(setWelcomeScreenOpen(true));
    dispatch(setConnected(false));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoDrawer);
