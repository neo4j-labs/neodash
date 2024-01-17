import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import NeoAddCard from '../card/CardAddButton';
import NeoCard from '../card/Card';
import { getPageDetails, getReports, getToolBox } from './PageSelectors';
import {
  addReportThunk,
  removeReportThunk,
  updatePageLayoutThunk,
  cloneReportThunk,
  moveReportToToolboxThunk,
  removeReportFromToolboxThunk,
} from './PageThunks';
import Grid from '@mui/material/Grid';
import { getDashboardIsEditable, getPageNumber } from '../settings/SettingsSelectors';
import { getDashboardSettings } from '../dashboard/DashboardSelectors';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { GRID_COMPACTION_TYPE } from '../config/PageConfig';
import PageToolBox from './PageToolBox';
import GroupReport from '../component/groupreport/GroupReport';

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
  onPageLayoutUpdate = () => {}, // action to take when the page layout is updated.
  onMinimizeClick = () => {}, // moves report to toolbox.
  onMaximizeClick = () => {}, // removes report from toolbox to reports.
  pageDetails, // Page object of a tab.
  toolbox, // reports list which are moved to toolbox.
}) => {
  const getReportKey = (pagenumber: number, id: string) => {
    return `${pagenumber}:${id}`;
  };

  const defaultLayouts = {
    lg: [
      {
        x: 0,
        y: 0,
        i: getReportKey(pagenumber, '999999'),
        w: 6,
        h: 3,
        isDraggable: false,
      },
    ],
  };

  const [isDragging, setIsDragging] = React.useState(false);
  const [layouts, setLayouts] = React.useState(defaultLayouts);
  const [lastElement, setLastElement] = React.useState(<div key={getReportKey(pagenumber, '999999')}></div>);
  const [animated, setAnimated] = React.useState(false); // To turn off animations when cards are dragged around.
  const [isListOpen, setListOpen] = React.useState(true);
  const notGroupReports = reports.filter((report: any) => !report.groupId);
  const filteredReports = reports.filter((report: any) => report.groupId); // Filter only reports with groupId

  const availableHandles = () => {
    if (dashboardSettings.resizing && dashboardSettings.resizing == 'all') {
      return ['s', 'w', 'e', 'sw', 'se'];
    }
    return ['se'];
  };

  const toggleToolBox = () => {
    setListOpen(!isListOpen);
  };

  const groupReportsByGroupId = (reports: any[]) => {
    const groupedReports = {
      defaultGroup: [], // Group for reports without groupId
    };

    reports.forEach((report: { groupId: string }) => {
      const groupId = report.groupId || 'defaultGroup';

      if (!groupedReports[groupId]) {
        groupedReports[groupId] = [];
      }
      groupedReports[groupId].push(report);
    });

    return groupedReports;
  };

  const groupedReports = groupReportsByGroupId(filteredReports);

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
      })
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
            })
        )
      );
    }

    for (let level = 0; level < maxY; level++) {
      if (maxXbyYLevel[level] <= 18 && (maxXbyYLevel[level + 1] === undefined || maxXbyYLevel[level + 1] <= 18)) {
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
        ...reports.map((report) => {
          return {
            x: report.x || 0,
            y: report.y || 0,
            i: getReportKey(pagenumber, report.id),
            w: Math.max(parseInt(report.width), 4) || 4,
            h: Math.max(parseInt(report.height), 2) || 2,
            minW: 4,
            minH: 2,
            resizeHandles: availableHandles(),
            isDraggable: true,
          };
        }),
        {
          x: x,
          y: y,
          i: getReportKey(pagenumber, '999999'),
          w: 6,
          h: 4,
          minW: 6,
          minH: 4,
          isDraggable: false,
          isResizable: false,
        },
      ],
    });
    setLastElement(
      <Grid style={{ paddingBottom: '6px' }} key={getReportKey(pagenumber, '999999')}>
        <NeoAddCard
          onCreatePressed={() => {
            const { x, y } = getAddCardButtonPosition();
            onCreatePressed(x, y, 6, 4);
          }}
        />
      </Grid>
    );
  };

  // Remove element/report from toolbox and set it in report
  const onTakeItem = (item: { id: any }) => {
    onMaximizeClick(item.id);
  };

  // Move element/report to toolbox
  const onPutItem = (item: { id: any }) => {
    onMinimizeClick(item.id);
  };

  const groupedReportContainerStyle = {
    border: '1px solid #000',
    padding: '10px',
    margin: '10px',
  };

  const getBorderSpecsForGroupId = (groupId: any) => {
    const borderStyles = pageDetails?.groups?.find((group: any) => group.groupId.toString() === groupId);

    if (borderStyles) {
      return { border: borderStyles.border, borderColor: borderStyles.borderColor, padding: '10px', margin: '10px' };
    }
    return groupedReportContainerStyle;
  };

  useEffect(() => {
    setAnimated(false);
    recomputeLayout();
  }, [reports, dashboardSettings.resizing, pagenumber]);

  const content = (
    <div className='n-pt-3'>
      {toolbox && toolbox.length > 0 && (
        <PageToolBox
          items={toolbox || []}
          onTakeItem={onTakeItem}
          toggleToolBox={toggleToolBox}
          isListOpen={isListOpen}
        />
      )}
      {groupedReports &&
        Object.keys(groupedReports).map((groupId) => (
          <GroupReport
            key={groupId}
            groupedReports={groupedReports}
            groupId={groupId}
            getBorderSpecsForGroupId={getBorderSpecsForGroupId}
            getReportKey={getReportKey}
            pagenumber={pagenumber}
            dashboardSettings={dashboardSettings}
            onRemovePressed={onRemovePressed}
            onPutItem={onPutItem}
            getAddCardButtonPosition={getAddCardButtonPosition}
            onClonePressed={onClonePressed}
          />
        ))}
      <ResponsiveGridLayout
        draggableHandle='.drag-handle'
        layouts={layouts}
        className={`layout neodash-card-editable-${editable} ${animated ? 'animated' : 'not-animated'}`}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 24, md: 20, sm: 12, xs: 8, xxs: 4 }}
        rowHeight={100}
        compactType={GRID_COMPACTION_TYPE}
        style={{ marginBottom: 100 }}
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
        {notGroupReports.map((report) => {
          const w = 24;
          const { id } = report;
          // @ts-ignore
          return (
            <Grid
              key={getReportKey(pagenumber, id)}
              style={{ paddingBottom: '6px' }}
              item
              xs={Math.min(w * 4, 24)}
              sm={Math.min(w * 2, 24)}
              md={Math.min(w * 2, 24)}
              lg={Math.min(w, 24)}
              xl={Math.min(w, 24)}
            >
              <NeoCard
                id={id}
                key={getReportKey(pagenumber, id)}
                dashboardSettings={dashboardSettings}
                onRemovePressed={onRemovePressed}
                onPutItem={onPutItem}
                onClonePressed={(id) => {
                  const { x, y } = getAddCardButtonPosition();
                  onClonePressed(id, x, y);
                }}
              />
            </Grid>
          );
        })}
        {editable && !isDragging ? lastElement : <div key={getReportKey(pagenumber, '999999')}></div>}
      </ResponsiveGridLayout>
    </div>
  );
  return content;
};

const mapStateToProps = (state) => ({
  pagenumber: getPageNumber(state),
  editable: getDashboardIsEditable(state),
  dashboardSettings: getDashboardSettings(state),
  reports: getReports(state),
  toolbox: getToolBox(state),
  pageDetails: getPageDetails(state),
});

const mapDispatchToProps = (dispatch) => ({
  onRemovePressed: (id) => dispatch(removeReportThunk(id)),
  onClonePressed: (id, x, y) => dispatch(cloneReportThunk(id, x, y)),
  onCreatePressed: (x, y, width, height) => dispatch(addReportThunk(x, y, width, height, undefined)),
  onPageLayoutUpdate: (layout) => dispatch(updatePageLayoutThunk(layout)),
  onMinimizeClick: (reportId: string) => dispatch(moveReportToToolboxThunk(reportId)),
  onMaximizeClick: (reportId: string) => dispatch(removeReportFromToolboxThunk(reportId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoPage);
