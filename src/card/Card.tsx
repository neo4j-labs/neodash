import Card from '@material-ui/core/Card';
import Collapse from '@material-ui/core/Collapse';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import NeoCardSettings from './settings/CardSettings';
import NeoCardView from './view/CardView';
import { connect } from 'react-redux';
import {
  updateCypherParametersThunk,
  updateFieldsThunk,
  updateSelectionThunk,
  updateReportQueryThunk,
  toggleCardSettingsThunk,
  updateReportRefreshRateThunk,
  updateReportSettingThunk,
  updateReportTitleThunk,
  updateReportTypeThunk,
  updateReportDatabaseThunk,
} from './CardThunks';
import { toggleReportSettings } from './CardActions';
import { getReportState } from './CardSelectors';
import { debounce, Dialog, DialogContent } from '@material-ui/core';
import {
  getDashboardIsEditable,
  getDatabase,
  getGlobalParameters,
  getSessionParameters,
} from '../settings/SettingsSelectors';
import { updateGlobalParameterThunk } from '../settings/SettingsThunks';
import { createNotificationThunk } from '../page/PageThunks';
import useDimensions from 'react-cool-dimensions';
import {setReportHelpModalOpen} from '../application/ApplicationActions';
import {loadDatabaseListFromNeo4jThunk} from "../dashboard/DashboardThunks";
import {Neo4jContext, Neo4jContextState} from "use-neo4j/dist/neo4j.context";
import { getDashboardExtensions } from '../dashboard/DashboardSelectors';


const NeoCard = ({
                     index, // index of the card.
                     report, // state of the card, retrieved based on card index.
                     editable, // whether the card is editable.
                     database, // the neo4j database that the card is running against.
                     extensions, // A set of enabled extensions.
                     globalParameters, // Query parameters that are globally set for the entire dashboard.
                     dashboardSettings, // Dictionary of settings for the entire dashboard.
                     onRemovePressed, // action to take when the card is removed. (passed from parent)
                     onClonePressed, // action to take when user presses the clone button
                     onReportHelpButtonPressed, // action to take when someone clicks the 'help' button in the report settings.
                     onTitleUpdate, // action to take when the card title is updated.
                     onTypeUpdate, // action to take when the card report type is updated.
                     onFieldsUpdate, // action to take when the set of returned query fields is updated.
                     onQueryUpdate, // action to take when the card query is updated.
                     onRefreshRateUpdate, // action to take when the card refresh rate is updated.
                     onReportSettingUpdate, // action to take when an advanced report setting is updated.
                     onSelectionUpdate, // action to take when the selected visualization fields are updated.
                     onGlobalParameterUpdate, // action to take when a report updates a dashboard parameter.
                     onToggleCardSettings, // action to take when the card settings button is clicked.
                     onToggleReportSettings, // action to take when the report settings (advanced settings) button is clicked.
                     onCreateNotification, // action to take when an (error) notification is created.
                     onDatabaseChanged, // action to take when the user changes the database related to the card
                     loadDatabaseListFromNeo4j // Thunk to get the list of databases
                 }) => {

  const [databaseList, setDatabaseList] = React.useState([database]);
  const [databaseListLoaded, setDatabaseListLoaded] = React.useState(false);

  // fetching the list of databases from neo4j, filtering out the 'system' db
  useEffect(() => {
    if (!databaseListLoaded) {
      loadDatabaseListFromNeo4j(driver, (result) => {
        const index = result.indexOf('system');
        if (index > -1) {
          // only splice array when item is found
          result.splice(index, 1); // 2nd parameter means remove one item only
        }
        setDatabaseList(result);
      });
      setDatabaseListLoaded(true);
    }
  }, [report.query]);

  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const debouncedOnToggleCardSettings = useCallback(debounce(onToggleCardSettings, 500), []);
  const [collapseTimeout, setCollapseTimeout] = React.useState(report.collapseTimeout);

  const { observe, unobserve, width, height, entry } = useDimensions({
    onResize: ({ observe, unobserve }) => {
      // Triggered whenever the size of the target is changed...
      unobserve(); // To stop observing the current target element
      observe(); // To re-start observing the current target element
    },
  });

  const [expanded, setExpanded] = useState(false);
  const onToggleCardExpand = () => {
    // When we re-minimize a card, close the settings to avoid position issues.
    if (expanded && settingsOpen) {
      onToggleCardSettings(index, false);
    }
    setExpanded(!expanded);
  };

  const [active, setActive] = React.useState(
    report.settings && report.settings.autorun !== undefined ? report.settings.autorun : true,
  );

  useEffect(() => {
    if (!report.settingsOpen) {
      setActive(report.settings && report.settings.autorun !== undefined ? report.settings.autorun : true);
    }
  }, [report.query]);

  useEffect(() => {
    setSettingsOpen(report.settingsOpen);
  }, [report.settingsOpen]);

  useEffect(() => {
    setCollapseTimeout(report.collapseTimeout);
  }, [report.collapseTimeout]);

    // TODO - get rid of some of the props-drilling here...
    const component = <div style={{height: "100%"}} ref={observe}>
        {/* The front of the card, referred to as the 'view' */}
        <Collapse disableStrictModeCompat in={!settingsOpen} timeout={collapseTimeout} style={{height: "100%"}}>
            <Card style={{height: "100%"}}>
                <NeoCardView
                    settingsOpen={settingsOpen}
                    editable={editable}
                    dashboardSettings={dashboardSettings}
                    extensions={extensions}
                    settings={report.settings ? report.settings : {}}
                    type={report.type}
                    database={database}
                    active={active}
                    setActive={setActive}
                    query={report.query}
                    globalParameters={globalParameters}
                    fields={report.fields ? report.fields : []}
                    refreshRate={report.refreshRate}
                    selection={report.selection}
                    widthPx={width}
                    heightPx={height}
                    title={report.title}
                    expanded={expanded}
                    onToggleCardExpand={onToggleCardExpand}
                    onGlobalParameterUpdate={onGlobalParameterUpdate}
                    onSelectionUpdate={(selectable, field) => onSelectionUpdate(index, selectable, field)}
                    onTitleUpdate={(title) => onTitleUpdate(index, title)}
                    onFieldsUpdate={(fields) => onFieldsUpdate(index, fields)}
                    onToggleCardSettings={() => {
                        setSettingsOpen(true);
                        setCollapseTimeout("auto");
                        debouncedOnToggleCardSettings(index, true)
                    }}/>
            </Card>
        </Collapse>
        {/* The back of the card, referred to as the 'settings' */}
        <Collapse disableStrictModeCompat in={settingsOpen} timeout={collapseTimeout}>
            <Card style={{height: "100%"}}>
                <NeoCardSettings
                    settingsOpen={settingsOpen}
                    query={report.query}
                    database={database}
                    databaseList={databaseList}
                    width={report.width}
                    height={report.height}
                    heightPx={height}
                    fields={report.fields}
                    type={report.type}
                    refreshRate={report.refreshRate}
                    expanded={expanded}
                    extensions={extensions}
                    dashboardSettings={dashboardSettings}
                    onToggleCardExpand={onToggleCardExpand}
                    setActive={setActive}
                    reportSettings={report.settings}
                    reportSettingsOpen={report.advancedSettingsOpen}
                    onQueryUpdate={(query) => onQueryUpdate(index, query)}
                    onRefreshRateUpdate={(rate) => onRefreshRateUpdate(index, rate)}
                    onDatabaseChanged={(database) => onDatabaseChanged(index, database)}
                    onReportSettingUpdate={(setting, value) => onReportSettingUpdate(index, setting, value)}
                    onTypeUpdate={(type) => onTypeUpdate(index, type)}
                    onReportHelpButtonPressed={() => onReportHelpButtonPressed()}
                    onRemovePressed={() => onRemovePressed(index)}
                    onClonePressed={() => onClonePressed(index)}
                    onCreateNotification={(title, message) => onCreateNotification(title, message)}
                    onToggleCardSettings={() => {
                        setSettingsOpen(false);
                        setCollapseTimeout("auto");
                        debouncedOnToggleCardSettings(index, false);
                    }}
                    onToggleReportSettings={() => onToggleReportSettings(index)}/>
            </Card>
        </Collapse>
    </div>;

  // If the card is viewed in fullscreen, wrap it in a dialog.
  // TODO - this causes a re-render (and therefore, a re-run of the report)
  // Look into React Portals: https://stackoverflow.com/questions/61432878/how-to-render-child-component-outside-of-its-parent-component-dom-hierarchy
  if (expanded) {
    return (
      <Dialog maxWidth={'xl'} open={expanded} aria-labelledby="form-dialog-title">
        <DialogContent
          style={{
            width: Math.min(1920, document.documentElement.clientWidth - 64),
            height: document.documentElement.clientHeight,
          }}
        >
          {component}
        </DialogContent>
      </Dialog>
    );
  }
  return component;
};

const mapStateToProps = (state, ownProps) => ({
    report: getReportState(state, ownProps.index),
    extensions: getDashboardExtensions(state),
    editable: getDashboardIsEditable(state),
    database: getDatabase(state, ownProps && ownProps.dashboardSettings ? ownProps.dashboardSettings.pagenumber : undefined, ownProps.index),
    globalParameters: {...getGlobalParameters(state), ...getSessionParameters(state)} 
});

const mapDispatchToProps = (dispatch) => ({
  onTitleUpdate: (index: any, title: any) => {
    dispatch(updateReportTitleThunk(index, title));
  },
  onQueryUpdate: (index: any, query: any) => {
    dispatch(updateReportQueryThunk(index, query));
  },
  onRefreshRateUpdate: (index: any, rate: any) => {
    dispatch(updateReportRefreshRateThunk(index, rate));
  },
  onTypeUpdate: (index: any, type: any) => {
    dispatch(updateReportTypeThunk(index, type));
  },
  onReportSettingUpdate: (index: any, setting: any, value: any) => {
    dispatch(updateReportSettingThunk(index, setting, value));
  },
  onFieldsUpdate: (index: any, fields: any) => {
    dispatch(updateFieldsThunk(index, fields));
  },
  onGlobalParameterUpdate: (key: any, value: any) => {
    dispatch(updateGlobalParameterThunk(key, value));
  },
  onSelectionUpdate: (index: any, selectable: any, field: any) => {
    dispatch(updateSelectionThunk(index, selectable, field));
  },
  onToggleCardSettings: (index: any, open: any) => {
    dispatch(toggleCardSettingsThunk(index, open));
  },
  onReportHelpButtonPressed: () => {
    dispatch(setReportHelpModalOpen(true));
  },
  onToggleReportSettings: (index: any) => {
    dispatch(toggleReportSettings(index));
  },
  onCreateNotification: (title: any, message: any) => {
    dispatch(createNotificationThunk(title, message));
  },
  onDatabaseChanged: (index: any, database: any) => {
    dispatch(updateReportDatabaseThunk(index, database));
  },
  loadDatabaseListFromNeo4j: (driver, callback) => dispatch(loadDatabaseListFromNeo4jThunk(driver, callback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoCard);
