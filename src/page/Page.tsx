import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import NeoAddCard from '../card/CardAddButton';
import NeoCard from '../card/Card';
import { getReports } from './PageSelectors';
import { removeReportRequest } from './PageThunks';
import Grid from '@material-ui/core/Grid';
import { getDashboardIsEditable } from '../settings/SettingsSelectors';
import { getDashboardSettings } from '../dashboard/DashboardSelectors';
import { Responsive, WidthProvider } from "react-grid-layout";
import { GRID_COMPACTION_TYPE } from '../config/PageConfig';
import { minWidth } from '@mui/system';

const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * A component responsible for rendering the page, a collection of reports.
 */
export const NeoPage = (
    {
        editable = true, // Whether the page is editable.
        dashboardSettings, // global settings for the entire dashboard.
        reports = [], // list of reports as defined in the dashboard state.
        onRemovePressed = (index) => { }, // action to take when a report gets removed.
        isLoaded = true // Whether the page is loaded and the cards can be displayed.
    }) => {

    const loadingMessage = <div>Loading card...</div>;
    const [isDragging, setIsDragging] = React.useState(false);
    const [layouts, setLayouts] = React.useState([]);
    const [lastElement, setLastElement] = React.useState(<></>);


    /**
    * Recompute the layout of the page buttons.This is called whenever the pages get reorganized.
    */
    const recomputeLayout = () => {
        const timestamp = Date.now();

        setLayouts({
            // @ts-ignore
            "lg": [...reports.map((report, index) => {
                return {
                    x: index*3, //report.x,
                    y: 3, //report.y,
                    i: "" + index,
                    w: 3, //report.width,
                    h: 2, //report.height,
                    minW: 2,
                    minH: 1
                }
            }), {
                x: 9,
                y: 12,
                i: "" + timestamp,
                w: 3,
                h: 2,
                isDraggable: false
            }]
        });
        setLastElement(<Grid style={{ width: "100%", paddingBottom: "6px" }} key={timestamp}>
            <NeoAddCard />
        </Grid>);
    }


    useEffect(() => {
        recomputeLayout();
    }, [reports])

    const content = (
        <div style={{ paddingTop: "52px" }}>
            <ResponsiveGridLayout
                draggableHandle=".drag-handle"
                layouts={layouts}
                classname={"layout"}
                // className={"layout neodash-card-editable-" + editable}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                rowHeight={210}
                isBounded={true}
                compactType={GRID_COMPACTION_TYPE}
                onDrag={() => {
                    if (!isDragging) {
                        setIsDragging(true);
                        recomputeLayout(true);
                    }
                }}
                onDragStop={(newLayout, oldPosition, newPosition) => {
                    setIsDragging(false);
                    recomputeLayout();
                }}>
                {reports.map((report, index) => {
                    const w = 12;
                    // @ts-ignore
                    return <Grid key={index} style={{ paddingBottom: "6px" }} item xs={Math.min(w * 4, 12)} sm={Math.min(w * 2, 12)} md={Math.min(w * 2, 12)} lg={Math.min(w, 12)} xl={Math.min(w, 12)}>
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
    editable: getDashboardIsEditable(state),
    dashboardSettings: getDashboardSettings(state),
    reports: getReports(state),
});

const mapDispatchToProps = dispatch => ({
    onRemovePressed: index => dispatch(removeReportRequest(index))
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoPage);