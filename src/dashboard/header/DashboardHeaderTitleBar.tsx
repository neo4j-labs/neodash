import { Toolbar, Badge, InputBase, Tooltip } from "@material-ui/core";
import React, { useCallback, useEffect } from "react";
import { connect } from "react-redux";
import debounce from 'lodash/debounce';
import { HeroIcon, IconButton } from '@neo4j-ndl/react';

export const NeoDashboardHeaderTitleBar = ({ dashboardTitle, downloadImageEnabled, onDownloadImage, open, setDashboardTitle, connection, editable, standalone, handleDrawerOpen, onConnectionModalOpen }) => {

    const [dashboardTitleText, setDashboardTitleText] = React.useState(dashboardTitle);
    const debouncedDashboardTitleUpdate = useCallback(
        debounce(setDashboardTitle, 250),
        [],
    );

    useEffect(() => {
        // Reset text to the dashboard state when the page gets reorganized.
        if (dashboardTitle !== dashboardTitleText) {
            setDashboardTitleText(dashboardTitle);
        }
    }, [dashboardTitle])


    const content = <Toolbar key={1} style={{ paddingRight: 24, minHeight: "64px", background: '#004092', zIndex: 1000 }}>
        {!standalone ? <IconButton
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            style={
                (open) ? {
                    display: 'none',
                } : {
                    marginRight: 34,
                    marginLeft: -17,
                    color: 'white'
                }
            }
            buttonSize="large"
            clean
        >
            <HeroIcon className="ndl-icon n-w-6 n-h-6" type="solid" iconName="MenuIcon" />
        </IconButton> : <></>}
        <InputBase
            id="center-aligned"
            style={{ textAlign: 'center', fontSize: "22px", flexGrow: 1, color: "white" }}
            placeholder="Dashboard Name..."
            fullWidth
            maxRows={4}
            value={dashboardTitleText}
            onChange={(event) => {
                if (editable) {
                    setDashboardTitleText(event.target.value);
                    debouncedDashboardTitleUpdate(event.target.value);
                }
            }}
        />
        {downloadImageEnabled ? <Tooltip title={"Download Dashboard as Image"}>
    <IconButton style={{ marginRight: "3px", background: "#ffffff22" }} onClick={(e) => onDownloadImage()} buttonSize="large" clean>
        <HeroIcon className="ndl-icon n-w-6 n-h-6" type="solid" iconName="CameraIcon"
            style={{ color: "#ffffffdd" }} />
    </IconButton>
</Tooltip> : <></>}

        <Tooltip title={connection.protocol + "://" + connection.url + ":" + connection.port} placement="left" aria-label="host">
            <IconButton className="logo-btn" style={{ background: "#ffffff22" }} onClick={(e) => {
                if (!standalone) {
                    onConnectionModalOpen();
                }
            }} buttonSize="large" clean>
                <img src="neo4j-icon.png" />
            </IconButton>
        </Tooltip>
    </Toolbar>;
    return content;
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});


export default connect(mapStateToProps, mapDispatchToProps)(NeoDashboardHeaderTitleBar);


