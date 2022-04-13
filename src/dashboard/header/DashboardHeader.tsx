import { AppBar } from "@material-ui/core";
import React, {  } from "react";
import { connect } from "react-redux";
import { setConnectionModalOpen } from "../../application/ApplicationActions";
import { applicationIsStandalone } from "../../application/ApplicationSelectors";
import { getDashboardIsEditable } from "../../settings/SettingsSelectors";
import { setDashboardTitle } from "../DashboardActions";
import { getDashboardTitle } from "../DashboardSelectors";
import NeoDashboardHeaderPageList from "./DashboardHeaderPageList";
import { NeoDashboardHeaderTitleBar } from "./DashboardHeaderTitleBar";

const drawerWidth = 240;


export const NeoDashboardHeader = ({ open, editable, standalone, dashboardTitle, setDashboardTitle, handleDrawerOpen,connection, onConnectionModalOpen }) => {

    const content = (
        <AppBar position="absolute" style={
            (open) ? {
                zIndex: "auto",
                boxShadow: "none",
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`,
                transition: "width 125ms cubic-bezier(0.4, 0, 0.6, 1) 0ms"
            } : {
                zIndex: "auto",
                boxShadow: "none",
                transition: "width 125ms cubic-bezier(0.4, 0, 0.6, 1) 0ms"
            }
        }>
            <NeoDashboardHeaderTitleBar 
            dashboardTitle={dashboardTitle} setDashboardTitle={setDashboardTitle} editable={editable} standalone={standalone}
                onConnectionModalOpen={onConnectionModalOpen} handleDrawerOpen={handleDrawerOpen} connection={connection}></NeoDashboardHeaderTitleBar>
            <NeoDashboardHeaderPageList open={open}></NeoDashboardHeaderPageList>
        </AppBar>
    );
    return content;
}

const mapStateToProps = state => ({
    dashboardTitle: getDashboardTitle(state),
    standalone: applicationIsStandalone(state),
    editable: getDashboardIsEditable(state)
});

const mapDispatchToProps = dispatch => ({
    setDashboardTitle: (title: any) => {
        dispatch(setDashboardTitle(title));
    },
    
    onConnectionModalOpen: () => {
        dispatch(setConnectionModalOpen(true));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoDashboardHeader);


