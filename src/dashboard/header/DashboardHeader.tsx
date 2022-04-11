import { AppBar, Toolbar, IconButton, Typography, Badge, TextField, InputBase, Tooltip } from "@material-ui/core";
import React, { useCallback, useEffect } from "react";
import NeoPageButton from "./DashboardHeaderPageButton";
import NeoPageAddButton from "./DashboardHeaderPageAddButton";
import MenuIcon from '@material-ui/icons/Menu';
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { setDashboardTitle, addPage, removePage } from "../DashboardActions";
import { getDashboardTitle, getPages } from "../DashboardSelectors";
import debounce from 'lodash/debounce';
import { setPageTitle } from "../../page/PageActions";
import { addPageThunk, movePageThunk, removePageThunk } from "../DashboardThunks";
import { setConnectionModalOpen } from "../../application/ApplicationActions";
import { setPageNumberThunk } from "../../settings/SettingsThunks";
import { getDashboardIsEditable, getPageNumber } from "../../settings/SettingsSelectors";
import { applicationIsStandalone } from "../../application/ApplicationSelectors";
import RGL, { WidthProvider } from "react-grid-layout";
const ReactGridLayout = WidthProvider(RGL);
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
    handleDrawerOpen, setDashboardTitle, editable, connection,
    addPage, movePage, removePage, selectPage, setPageTitle, onConnectionModalOpen }) => {

    const [dashboardTitleText, setDashboardTitleText] = React.useState(dashboardTitle);
    const debouncedDashboardTitleUpdate = useCallback(
        debounce(setDashboardTitle, 250),
        [],
    );
    const debouncedSetPageTitle = useCallback(
        debounce(setPageTitle, 250),
        [],
    );

    const [layout, setLayout] = React.useState([]);
    const [isDragging, setIsDragging] = React.useState(false);
    const [pageCount, setPageCount] = React.useState(pages.length);
    const [lastElement, setLastElement] = React.useState(<></>);

    useEffect(() => {
        // Reset text to the dashboard state when the page gets reorganized.
        if (dashboardTitle !== dashboardTitleText) {
            setDashboardTitleText(dashboardTitle);
        }
    }, [dashboardTitle])


    useEffect(() => {
        // Reset text to the dashboard state when the page gets reorganized.
        reComputeLayout();
    }, [pages])

    function reComputeLayout() {
        const timestamp = Date.now();

        setLayout([...pages.map((page, index) => {
            return { x: index, y: 0, i: "" + index, w: Math.min(2.0, 11.3 / pages.length), h: 1 }
        }), { x: pages.length, y: 0, i: "" + timestamp, w: 0.0001, h: 1, isDraggable: false }]);

        setLastElement(<div key={timestamp} index={timestamp}
            style={{
                background: "inherit",
                display: "inline-block",
                padding: 0, margin: 0,
                height: "100%",
            }}>
            <NeoPageAddButton onClick={addPage}></NeoPageAddButton>
        </div>);
    }

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
                <ReactGridLayout
                    className="layout"
                    layout={layout}
                    isResizable={false}
                    onDrag={() => {
                        if (!isDragging) {
                            setIsDragging(true);
                        }
                    }}
                    onDragStop={(newLayout, oldPosition, newPosition, x) => {
                        // Calculate the old and new index of the page that was just dropped.
                        const newXPositions = newLayout.map(page => page.x);
                        const oldIndex = oldPosition["i"];
                        const newIndex = Math.min(newXPositions.length - 2, newXPositions.sort().indexOf(newPosition["x"]));
                        if (oldIndex !== newIndex) {
                            movePage(oldIndex, newIndex);
                        }
                        setIsDragging(false);
                        reComputeLayout();
                    }}
                    style={{
                        width: '100%',
                        height: "47px",
                        zIndex: -112, overflowY: "hidden", overflowX: "hidden",
                        background: "rgba(240,240,240)",
                        padding: 0, margin: 0,
                        boxShadow: "2px 1px 10px 0px rgb(0 0 0 / 12%)",
                        borderBottom: "1px solid lightgrey"
                    }}
                    margin={[0, 0]}
                    maxRows={1}
                    rowHeight={47}
                    isBounded={true}
                    compactType={"horizontal"}
                >
                    {pages.map((page, i) =>
                        <div key={i} index={i}
                            style={{
                                background: "grey",
                                backgroundColor: (pagenumber == i) ? 'white' : 'inherit',
                                display: "inline-block",
                                height: "100%",
                                padding: 0, margin: 0,
                                borderRight: "1px solid #ddd", borderLeft: "1px solid #ddd"
                            }}>
                            <NeoPageButton title={page.title} selected={pagenumber == i}
                                disabled={!editable}
                                onSelect={() => selectPage(i)}
                                onRemove={() => removePage(i)}
                                onTitleUpdate={(e) => debouncedSetPageTitle(i, e.target.value)}
                            />
                        </div>
                    )}
                    {editable && !isDragging ? lastElement : <></>}
                </ReactGridLayout>

            </Toolbar>
        </AppBar>
    );
    return content;
}

const mapStateToProps = state => ({
    dashboardTitle: getDashboardTitle(state),
    standalone: applicationIsStandalone(state),
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
    movePage: (oldIndex: number, newIndex: number) => {
        dispatch(movePageThunk(oldIndex, newIndex));
    },
    onConnectionModalOpen: () => {
        dispatch(setConnectionModalOpen(true));
    }
});

//  
export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NeoDashboardHeader));


