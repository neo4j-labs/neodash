import { AppBar, Toolbar, IconButton, Typography, Badge, TextField, InputBase, Tooltip } from "@material-ui/core";
import React, { useCallback, useEffect } from "react";
import NeoPageButton from "./DashboardHeaderPageButton";
import NeoPageAddButton from "./DashboardHeaderPageAddButton";
import MenuIcon from '@material-ui/icons/Menu';
import ConnectionModal from '../modal/ConnectionModal';
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { setDashboardTitle, addPage, removePage } from "./DashboardActions";
import { getDashboardTitle, getPages } from "./DashboardSelectors";
import debounce from 'lodash/debounce';
import { setPageTitle } from "../page/PageActions";
import { addPageThunk, removePageThunk } from "./DashboardThunks";
import { setConnectionModalOpen } from "../application/ApplicationActions";
import { setPageNumberThunk } from "../settings/SettingsThunks";
import { getDashboardIsEditable, getPageNumber } from "../settings/SettingsSelectors";

const drawerWidth = 240;

const styles = {
    root: {
        background: "transparent",
        marginLeft: "30px",
        marginRight: "30px",

    },
    input: {
        color: "white",
        fontSize: 20
    }
};


export const NeoDashboardHeader = ({ classes, open, pagenumber, pages, dashboardTitle,
     handleDrawerOpen, setDashboardTitle, editable, connection,
    addPage, removePage, selectPage, setPageTitle, onConnectionModalOpen }) => {

    const [dashboardTitleText, setDashboardTitleText] = React.useState(dashboardTitle);
    const debouncedDashboardTitleUpdate = useCallback(
        debounce(setDashboardTitle, 250),
        [],
    );
    const debouncedSetPageTitle = useCallback(
        debounce(setPageTitle, 250),
        [],
    );

    useEffect(() => {
        // Reset text to the dashboard state when the page gets reorganized.
        if (dashboardTitle !== dashboardTitleText) {
            setDashboardTitleText(dashboardTitle);
        }
    }, [dashboardTitle])


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
            <Toolbar key={1} style={{ paddingRight: 24, minHeight: "64px", background: '#0B297D', zIndex: 1201 }}>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    style={
                        (open) ? {
                            display: 'none',
                        } : {
                            marginRight: 36,
                            marginLeft: -19,
                        }
                    }
                >
                    <MenuIcon />
                </IconButton>
                <InputBase
                    id="center-aligned"
                    className={classes.root}
                    InputProps={{
                        className: classes.input
                    }}
                    style={{ textAlign: 'center', fontSize: "22px", flexGrow: 1, color: "white" }}
                    placeholder="Dashboard Name..."
                    fullWidth
                    maxRows={4}
                    value={dashboardTitleText}
                    onChange={(event) => {
                        setDashboardTitleText(event.target.value);
                        debouncedDashboardTitleUpdate(event.target.value);
                    }}
                />
                <Tooltip title={connection.protocol + "://" + connection.url + ":" + connection.port} placement="left" aria-label="host">
                    <IconButton style={{ background: "#ffffff22", padding: "3px" }} onClick={onConnectionModalOpen}>
                        <Badge badgeContent={""} >
                            <img style={{ width: "36px", height: "36px" }} src="neo4j-icon.png" />
                        </Badge>
                    </IconButton>
                </Tooltip>
            </Toolbar>
            <Toolbar key={2} style={{ zIndex: 1001, minHeight: "50px", paddingLeft: "0px", paddingRight: "0px", background: "white" }}>
                <div style={{ width: open ? "0px" : "57px", zIndex: open ? 999 : 999, transition: "width 125ms cubic-bezier(0.4, 0, 0.6, 1) 0ms", height: "0px", background: "white" }}> </div>
                <div style={{
                    width: '100%', zIndex: -112, height: "48px", overflowX: "hidden", overflowY: "auto", background: "rgba(240,240,240)",
                    boxShadow: "2px 1px 10px 0px rgb(0 0 0 / 12%)",
                    borderBottom: "1px solid lightgrey"
                }}>
                    {pages.map((page, i) => 
                        <NeoPageButton index={i} title={page.title} selected={pagenumber == i}
                            disabled={!editable}
                            onSelect={() => selectPage(i)}
                            onRemove={() => removePage(i)}
                            onTitleUpdate={(e) => debouncedSetPageTitle(i, e.target.value)
                            }
                        />)
                    }
                    {editable ? <NeoPageAddButton onClick={addPage}></NeoPageAddButton> : <></>}
                </div>
            </Toolbar>
        </AppBar>
    );
    return content;
}

const mapStateToProps = state => ({
    dashboardTitle: getDashboardTitle(state),
    pages: getPages(state),
    editable: getDashboardIsEditable(state),
    pagenumber: getPageNumber(state)
});

const mapDispatchToProps = dispatch => ({
    setDashboardTitle: (title: any) => {
        dispatch(setDashboardTitle(title));
    },
    selectPage: (number: any) => {
        dispatch(setPageNumberThunk(number));
    },
    setPageTitle: (number: any, title: any) => {
        dispatch(setPageTitle(number, title));
    },
    addPage: () => {
        dispatch(addPageThunk());
    },
    removePage: (index: any) => {
        dispatch(removePageThunk(index));
    },
    onConnectionModalOpen: () => {
        dispatch(setConnectionModalOpen(true));
    }
});

//  
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NeoDashboardHeader));


