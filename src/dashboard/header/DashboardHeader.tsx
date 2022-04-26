import { AppBar } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
<<<<<<< HEAD
=======
import { setDashboardTitle, addPage, removePage } from "../DashboardActions";
import { getDashboardSettings, getDashboardTitle, getPages } from "../DashboardSelectors";
import debounce from 'lodash/debounce';
import { setPageTitle } from "../../page/PageActions";
import { addPageThunk, removePageThunk } from "../DashboardThunks";
>>>>>>> master
import { setConnectionModalOpen } from "../../application/ApplicationActions";
import { applicationIsStandalone } from "../../application/ApplicationSelectors";
<<<<<<< HEAD
import { getDashboardIsEditable } from "../../settings/SettingsSelectors";
import { setDashboardTitle } from "../DashboardActions";
import { getDashboardTitle } from "../DashboardSelectors";
import NeoDashboardHeaderPageList from "./DashboardHeaderPageList";
import { NeoDashboardHeaderTitleBar } from "./DashboardHeaderTitleBar";

const drawerWidth = 240;

=======
import ImageIcon from '@material-ui/icons/Image';

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


export const NeoDashboardHeader = ({ classes, open, standalone, pagenumber, pages, dashboardTitle,
    handleDrawerOpen, setDashboardTitle, editable, connection, settings,
    addPage, removePage, selectPage, setPageTitle, onConnectionModalOpen, onDownloadImage }) => {

    const downloadImageEnabled = settings ? settings.downloadImageEnabled : false;
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

>>>>>>> master

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
<<<<<<< HEAD
            <NeoDashboardHeaderTitleBar 
            dashboardTitle={dashboardTitle} setDashboardTitle={setDashboardTitle} editable={editable} standalone={standalone} open={open}
                onConnectionModalOpen={onConnectionModalOpen} handleDrawerOpen={handleDrawerOpen} connection={connection}></NeoDashboardHeaderTitleBar>
            <NeoDashboardHeaderPageList open={open}></NeoDashboardHeaderPageList>
=======
            <Toolbar key={1} style={{ paddingRight: 24, minHeight: "64px", background: '#0B297D', zIndex: 1201 }}>
                {!standalone ? <IconButton
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
                </IconButton> : <></>}
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
                        if (editable) {
                            setDashboardTitleText(event.target.value);
                            debouncedDashboardTitleUpdate(event.target.value);
                        }
                    }}
                />
                {downloadImageEnabled ? <Tooltip title={"Download Dashboard as Image"}>
                    <IconButton style={{background: "#ffffff22", padding: "3px", marginRight: "3px"}} onClick={(e) => onDownloadImage()}>
                        <ImageIcon style={{ padding: 6, color: "#ffffffdd", width: "36px", height: "36px", fontSize: "1.3rem", zIndex: 5 }} fontSize="small">
                        </ImageIcon>
                    </IconButton>
                </Tooltip> : <></>}

                <Tooltip title={connection.protocol + "://" + connection.url + ":" + connection.port} placement="left" aria-label="host">
                    <IconButton style={{ background: "#ffffff22", padding: "3px" }} onClick={(e) => {
                        if (!standalone) {
                            onConnectionModalOpen();
                        }
                    }}>
                        <Badge badgeContent={""} >
                            <img style={{ width: "36px", height: "36px" }} src="neo4j-icon.png" />
                        </Badge>
                    </IconButton>
                </Tooltip>
            </Toolbar>
            <Toolbar key={2} style={{ zIndex: 1001, minHeight: "50px", paddingLeft: "0px", paddingRight: "0px", background: "white" }}>
                {!standalone ? <div style={{ width: open ? "0px" : "57px", zIndex: open ? 999 : 999, transition: "width 125ms cubic-bezier(0.4, 0, 0.6, 1) 0ms", height: "0px", background: "white" }}> </div> : <></>}

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
>>>>>>> master
        </AppBar>
    );
    return content;
}

const mapStateToProps = state => ({
    dashboardTitle: getDashboardTitle(state),
    standalone: applicationIsStandalone(state),
<<<<<<< HEAD
    editable: getDashboardIsEditable(state)
=======
    pages: getPages(state),
    settings: getDashboardSettings(state),
    editable: getDashboardIsEditable(state),
    pagenumber: getPageNumber(state)
>>>>>>> master
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


