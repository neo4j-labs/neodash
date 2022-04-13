import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import NeoAddCard from '../card/CardAddButton';
import NeoCard from '../card/Card';
import { getReports } from './PageSelectors';
import { addReportThunk, removeReportThunk, updatePageLayoutThunk } from './PageThunks';
import Grid from '@material-ui/core/Grid';
import { getDashboardIsEditable, getPageNumber } from '../settings/SettingsSelectors';
import { getDashboardSettings } from '../dashboard/DashboardSelectors';
import { Responsive, WidthProvider } from "react-grid-layout";
import { GRID_COMPACTION_TYPE } from '../config/PageConfig';

const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * A component responsible for rendering the page, a collection of reports.
 */
export const NeoPage = (
    {
        editable = true, // Whether the page is editable.
        dashboardSettings, // global settings for the entire dashboard.
        pagenumber, // The page number.
        reports = [], // list of reports as defined in the dashboard state.
        onCreatePressed, // callback for when the user wants to add a new report.
        onRemovePressed = (index) => { }, // action to take when a report gets removed.
        isLoaded = true, // Whether the page is loaded and the cards can be displayed.
        onPageLayoutUpdate // action to take when the page layout is updated.
    }) => {

    const loadingMessage = <div>Loading card...</div>;
    const [isDragging, setIsDragging] = React.useState(false);
    const [layouts, setLayouts] = React.useState([]);
    const [lastElement, setLastElement] = React.useState(<></>);
    const [animated, setAnimated] = React.useState(false);


    const getAddCardButtonPosition = () => {
        const maxY = Math.max(...reports.map(report => report.y + report.height));
        const maxX = Math.max(...reports.filter(report => report.y + report.height == maxY).map(report => report.x + report.width));
        return {x: maxX, y: maxY};
    }
    /**
    * Recompute the layout of the page buttons.This is called whenever the pages get reorganized.
    */
    const recomputeLayout = () => {
        const {x, y} = getAddCardButtonPosition();
        setLayouts({
            // @ts-ignore
            "lg": [...reports.map((report, index) => {
                return {
                    x: report.x !== undefined ? report.x : 0,
                    y: report.y !== undefined ? report.y : 0,
                    i: pagenumber + ":" + index,
                    w: report.width !== undefined ? parseInt(report.width) : 3,
                    h: report.height !== undefined ? parseInt(report.height) : 2,
                    minW: 2,
                    minH: 1
                }
            }), {
                x: x,
                y: y,
                i: pagenumber + ":" + 999999,
                w: 3,
                h: 2,
                isDraggable: false
            }]
        });
        setLastElement(<Grid style={{ width: "100%", paddingBottom: "6px" }} key={pagenumber + ":" + 999999}>
            <NeoAddCard onCreatePressed={()=>{
                const {x, y} = getAddCardButtonPosition();
                onCreatePressed(x, y, 3, 2);
            }} />
        </Grid>);
    }


    useEffect(() => {
        setAnimated(false);
        recomputeLayout();
    }, [reports])

    const content = (
        <div style={{ paddingTop: "52px" }}>
            <ResponsiveGridLayout
                draggableHandle=".drag-handle"
                layouts={layouts}
                className={"layout neodash-card-editable-" + editable + " " + (animated ? "animated" : "not-animated")}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={210}
                compactType={GRID_COMPACTION_TYPE}
                onDrag={() => {
                    if (!isDragging) {
                        setAnimated(true);
                        setIsDragging(true);
                        recomputeLayout();
                    }
                }}
                onDragStop={(newLayout) => {
                    if (isDragging) {
                        onPageLayoutUpdate(newLayout);
                        setIsDragging(false);
                    }
                }}
                onResize={() => {
                    if(!animated){
                        setAnimated(true);
                    }
                }}
                onResizeStop={(newLayout) => {
                    onPageLayoutUpdate(newLayout);
                }}>
                {reports.map((report, index) => {
                    const w = 12;
                    // @ts-ignore
                    return <Grid key={pagenumber + ":" + index} style={{ paddingBottom: "6px" }} item xs={Math.min(w * 4, 12)} sm={Math.min(w * 2, 12)} md={Math.min(w * 2, 12)} lg={Math.min(w, 12)} xl={Math.min(w, 12)}>
                        <NeoCard index={index}
                            dashboardSettings={dashboardSettings}
                            onRemovePressed={onRemovePressed} />
                    </Grid>
                })}
                {editable && !isDragging ? lastElement : <></>}
            </ResponsiveGridLayout>
        </div >
    );
    return !isLoaded ? loadingMessage : content;
}

const mapStateToProps = state => ({
    isLoaded: true,
    pagenumber: getPageNumber(state),
    editable: getDashboardIsEditable(state),
    dashboardSettings: getDashboardSettings(state),
    reports: getReports(state),
});

const mapDispatchToProps = dispatch => ({
    onRemovePressed: index => dispatch(removeReportThunk(index)),
    onCreatePressed: (x, y, width, height) => dispatch(addReportThunk(x, y, width, height)),
    onPageLayoutUpdate: layout => dispatch(updatePageLayoutThunk(layout))
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoPage);