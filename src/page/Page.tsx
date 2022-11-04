import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import NeoAddCard from '../card/CardAddButton';
import NeoCard from '../card/Card';
import { getReports } from './PageSelectors';
import { addReportThunk, removeReportThunk, updatePageLayoutThunk, cloneReportThunk } from './PageThunks';
import Grid from '@material-ui/core/Grid';
import { getDashboardIsEditable, getPageNumber } from '../settings/SettingsSelectors';
import { getDashboardSettings } from '../dashboard/DashboardSelectors';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { GRID_COMPACTION_TYPE } from '../config/PageConfig';

const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * A component responsible for rendering the **current** page, a collection of reports.
 */
export const NeoPage = ({
  editable = true, // Whether the page is editable.
  dashboardSettings, // global settings for the entire dashboard.
  pagenumber, // The page number to render.
  reports = [], // list of reports as defined in the dashboard state.
  onCreatePressed = () => {}, // callback for when the user wants to add a new report.
  onClonePressed = () => {}, // callback/action to take when a user wants to clone a report
  onRemovePressed = () => {}, // action to take when a report gets removed.
  isLoaded = true, // Whether the page is loaded and the cards can be displayed.
  onPageLayoutUpdate = () => {}, // action to take when the page layout is updated.
}) => {
  const getReportIndex = (pagenumber: number, index: number) => {
    return `${pagenumber}:${index}`;
  };

  const defaultLayouts = [
    {
      x: 0,
      y: 0,
      i: getReportIndex(pagenumber, 999999),
      w: 3,
      h: 2,
      isDraggable: false,
    },
  ];

  const loadingMessage = <div>Loading card...</div>;
  const [isDragging, setIsDragging] = React.useState(false);
  const [layouts, setLayouts] = React.useState(defaultLayouts);
  const [lastElement, setLastElement] = React.useState(<div key={getReportIndex(pagenumber, 999999)}></div>);
  const [animated, setAnimated] = React.useState(false); // To turn off animations when cards are dragged around.

  const availableHandles = () => {
    if (dashboardSettings.resizing && dashboardSettings.resizing == 'all') {
      return ['s', 'w', 'e', 'sw', 'se'];
    }
    return ['se'];
  };

  /**
   * Based on the current layout, determine where the 'add report' card should be placed.
   * The position here is the 'first available (2x2) spot' on a row, starting from the top.
   * @returns the position (x,y) of the add card button.
   */
  const getAddCardButtonPosition = () => {
    // Find all reports that touch on a specific y-level.
    if (reports.length == 0) {
      return { x: 0, y: 0 };
    }

    const maxY = Math.max.apply(
      Math,
      reports.map((o) => {
        return o.y + o.height;
      }),
    );
    const maxXbyYLevel = {}; // The max x value for each y-level.
    for (let i = 0; i < maxY; i++) {
      maxXbyYLevel[i] = Math.max(
        0,
        Math.max.apply(
          Math,
          reports
            .filter((report) => report.y + report.height > i && report.y <= i)
            .map((o) => {
              return o.x + o.width;
            }),
        ),
      );
    }

    for (let level = 0; level < maxY; level++) {
      if (maxXbyYLevel[level] <= 9 && (maxXbyYLevel[level + 1] === undefined || maxXbyYLevel[level + 1] <= 9)) {
        return { x: maxXbyYLevel[level] !== undefined ? maxXbyYLevel[level] : 0, y: level };
      }
    }
    return { x: 0, y: maxY };
  };
  /**
   * Recompute the layout of the page buttons.This is called whenever the pages get reorganized.
   */
  const recomputeLayout = () => {
    const { x, y } = getAddCardButtonPosition();
    setLayouts({
      // @ts-ignore
      lg: [
        ...reports.map((report, index) => {
          return {
            x: report.x !== undefined ? report.x : 0,
            y: report.y !== undefined ? report.y : 0,
            i: getReportIndex(pagenumber, index),
            w: report.width !== undefined ? Math.max(parseInt(report.width), 2) : 3,
            h: report.height !== undefined ? Math.max(parseInt(report.height), 1) : 2,
            minW: 2,
            minH: 1,
            resizeHandles: availableHandles(),
          };
        }),
        {
          x: x,
          y: y,
          i: getReportIndex(pagenumber, 999999),
          w: 3,
          h: 2,
          minW: 3,
          minH: 2,
          isDraggable: false,
          isResizable: false,
        },
      ],
    });
    setLastElement(
      <Grid style={{ paddingBottom: '6px' }} key={getReportIndex(pagenumber, 999999)}>
        <NeoAddCard
          onCreatePressed={() => {
            const { x, y } = getAddCardButtonPosition();
            onCreatePressed(x, y, 3, 2);
          }}
        />
      </Grid>,
    );
  };

  useEffect(() => {
    setAnimated(false);
    recomputeLayout();
  }, [reports, dashboardSettings.resizing]);

  const content = (
    <div style={{ paddingTop: '52px' }}>
      <ResponsiveGridLayout
        draggableHandle=".drag-handle"
        layouts={layouts}
        className={`layout neodash-card-editable-${editable} ${animated ? 'animated' : 'not-animated'}`}
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
          setIsDragging(true);
          if (!animated) {
            setAnimated(true);
          }
        }}
        onResizeStop={(newLayout) => {
          setIsDragging(false);
          onPageLayoutUpdate(newLayout);
        }}
      >
        {reports.map((report, index) => {
          const w = 12;
          // @ts-ignore
          return (
            <Grid
              index={getReportIndex(pagenumber, index)}
              key={getReportIndex(pagenumber, index)}
              style={{ paddingBottom: '6px' }}
              item
              xs={Math.min(w * 4, 12)}
              sm={Math.min(w * 2, 12)}
              md={Math.min(w * 2, 12)}
              lg={Math.min(w, 12)}
              xl={Math.min(w, 12)}
            >
              <NeoCard
                index={index}
                key={getReportIndex(pagenumber, index)}
                dashboardSettings={dashboardSettings}
                onRemovePressed={onRemovePressed}
                onClonePressed={(index) => {
                  const { x, y } = getAddCardButtonPosition();
                  onClonePressed(index, x, y);
                }}
              />
            </Grid>
          );
        })}
        {editable && !isDragging ? lastElement : <div key={getReportIndex(pagenumber, 999999)}></div>}
      </ResponsiveGridLayout>
    </div>
  );
  return !isLoaded ? loadingMessage : content;
};

const mapStateToProps = (state) => ({
  isLoaded: true,
  pagenumber: getPageNumber(state),
  editable: getDashboardIsEditable(state),
  dashboardSettings: getDashboardSettings(state),
  reports: getReports(state),
});

const mapDispatchToProps = (dispatch) => ({
  onRemovePressed: (index) => dispatch(removeReportThunk(index)),
  onClonePressed: (index, x, y) => dispatch(cloneReportThunk(index, x, y)),
  onCreatePressed: (x, y, width, height) => dispatch(addReportThunk(x, y, width, height, undefined)),
  onPageLayoutUpdate: (layout) => dispatch(updatePageLayoutThunk(layout)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoPage);
