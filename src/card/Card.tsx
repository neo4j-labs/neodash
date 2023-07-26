import { Card, Collapse, debounce } from '@mui/material';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import NeoCardSettings from './settings/CardSettings';
import NeoCardView from './view/CardView';
import { connect } from 'react-redux';
import {
  updateFieldsThunk,
  updateSelectionThunk,
  updateReportQueryThunk,
  toggleCardSettingsThunk,
  updateReportSettingThunk,
  updateReportTitleThunk,
  updateReportTypeThunk,
  updateReportDatabaseThunk,
} from './CardThunks';
import { toggleReportSettings } from './CardActions';
import { getReportState } from './CardSelectors';
import {
  getDashboardIsEditable,
  getDatabase,
  getGlobalParameters,
  getSessionParameters,
} from '../settings/SettingsSelectors';
import { updateGlobalParameterThunk } from '../settings/SettingsThunks';
import useDimensions from 'react-cool-dimensions';
import { setReportHelpModalOpen } from '../application/ApplicationActions';
import { loadDatabaseListFromNeo4jThunk } from '../dashboard/DashboardThunks';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { getDashboardExtensions } from '../dashboard/DashboardSelectors';
import { downloadComponentAsImage } from '../chart/ChartUtils';
import { Dialog } from '@neo4j-ndl/react';
import { createNotificationThunk } from '../page/PageThunks';

const NeoCard = ({
  id, // id of the card.
  report, // state of the card, retrieved based on card id.
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
  onReportSettingUpdate, // action to take when an advanced report setting is updated.
  onSelectionUpdate, // action to take when the selected visualization fields are updated.
  onGlobalParameterUpdate, // action to take when a report updates a dashboard parameter.
  onToggleCardSettings, // action to take when the card settings button is clicked.
  onToggleReportSettings, // action to take when the report settings (advanced settings) button is clicked.
  onDatabaseChanged, // action to take when the user changes the database related to the card
  loadDatabaseListFromNeo4j, // Thunk to get the list of databases
  createNotification, // Thunk to create a global notification pop-up.
}) => {
  // Will be used to fetch the list of current databases
  const { driver } = useContext<Neo4jContextState>(Neo4jContext);

  const [databaseList, setDatabaseList] = React.useState([database]);
  const [databaseListLoaded, setDatabaseListLoaded] = React.useState(false);

  const ref = React.useRef();

  // fetching the list of databases from neo4j, filtering out the 'system' db
  useEffect(() => {
    if (!databaseListLoaded) {
      loadDatabaseListFromNeo4j(driver, (result) => {
        let index = result.indexOf('system');
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

  const { observe, width, height } = useDimensions({
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
      onToggleCardSettings(id, false);
    }
    setExpanded(!expanded);
  };

  const [active, setActive] = React.useState(
    report.settings && report.settings.autorun !== undefined ? report.settings.autorun : true
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
  const component = (
    <div
      ref={observe}
      className='bg-light-neutral-bg-weak overflow-hidden n-shadow-l4 border-2 border-light-neutral-border-strong min-w-max rounded-lg px-4 py-5 sm:p-6 n-h-full'
    >
      {/* The front of the card, referred to as the 'view' */}
      <Collapse disablestrictmodecompat='true' in={!settingsOpen} timeout={collapseTimeout} className='n-h-full'>
        <Card ref={ref} className='n-h-full'>
          <NeoCardView
            id={id}
            settingsOpen={settingsOpen}
            editable={editable}
            dashboardSettings={dashboardSettings}
            extensions={extensions}
            settings={report.settings ? report.settings : {}}
            updateReportSetting={(name, value) => onReportSettingUpdate(id, name, value)}
            createNotification={(title, message) => createNotification(title, message)}
            type={report.type}
            database={database}
            active={active}
            setActive={setActive}
            onDownloadImage={() => downloadComponentAsImage(ref)}
            query={report.query}
            globalParameters={globalParameters}
            fields={report.fields ? report.fields : []}
            selection={report.selection}
            widthPx={width}
            heightPx={height}
            title={report.title}
            expanded={expanded}
            onToggleCardExpand={onToggleCardExpand}
            onGlobalParameterUpdate={onGlobalParameterUpdate}
            onSelectionUpdate={(selectable, field) => onSelectionUpdate(id, selectable, field)}
            onTitleUpdate={(title) => onTitleUpdate(id, title)}
            onFieldsUpdate={(fields) => onFieldsUpdate(id, fields)}
            onToggleCardSettings={() => {
              setSettingsOpen(true);
              setCollapseTimeout('auto');
              debouncedOnToggleCardSettings(id, true);
            }}
          />
        </Card>
      </Collapse>
      {/* The back of the card, referred to as the 'settings' */}
      <Collapse disablestrictmodecompat='true' in={settingsOpen} timeout={collapseTimeout}>
        <Card className='n-h-full'>
          <NeoCardSettings
            pagenumber={dashboardSettings.pagenumber}
            reportId={id}
            settingsOpen={settingsOpen}
            query={report.query}
            database={database}
            databaseList={databaseList}
            width={report.width}
            height={report.height}
            heightPx={height}
            fields={report.fields}
            type={report.type}
            expanded={expanded}
            extensions={extensions}
            dashboardSettings={dashboardSettings}
            onToggleCardExpand={onToggleCardExpand}
            setActive={setActive}
            reportSettings={report.settings}
            reportSettingsOpen={report.advancedSettingsOpen}
            onQueryUpdate={(query) => onQueryUpdate(id, query)}
            onDatabaseChanged={(database) => onDatabaseChanged(id, database)}
            onReportSettingUpdate={(setting, value) => onReportSettingUpdate(id, setting, value)}
            onTypeUpdate={(type) => onTypeUpdate(id, type)}
            onReportHelpButtonPressed={() => onReportHelpButtonPressed()}
            onRemovePressed={() => onRemovePressed(id)}
            onClonePressed={() => onClonePressed(id)}
            onToggleCardSettings={() => {
              setSettingsOpen(false);
              setCollapseTimeout('auto');
              debouncedOnToggleCardSettings(id, false);
            }}
            onToggleReportSettings={() => onToggleReportSettings(id)}
          />
        </Card>
      </Collapse>
    </div>
  );

  // If the card is viewed in fullscreen, wrap it in a dialog.
  // TODO - this causes a re-render (and therefore, a re-run of the report)
  // Look into React Portals: https://stackoverflow.com/questions/61432878/how-to-render-child-component-outside-of-its-parent-component-dom-hierarchy
  if (expanded) {
    return (
      <Dialog open={expanded} aria-labelledby='form-dialog-title' className='dialog-xxl'>
        <Dialog.Content style={{ height: document.documentElement.clientHeight }}>{component}</Dialog.Content>
      </Dialog>
    );
  }
  return component;
};

const mapStateToProps = (state, ownProps) => ({
  report: getReportState(state, ownProps.id),
  extensions: getDashboardExtensions(state),
  editable: getDashboardIsEditable(state),
  database: getDatabase(
    state,
    ownProps && ownProps.dashboardSettings ? ownProps.dashboardSettings.pagenumber : undefined,
    ownProps.id
  ),
  globalParameters: { ...getGlobalParameters(state), ...getSessionParameters(state) },
});

const mapDispatchToProps = (dispatch) => ({
  onTitleUpdate: (id: any, title: any) => {
    dispatch(updateReportTitleThunk(id, title));
  },
  onQueryUpdate: (id: any, query: any) => {
    dispatch(updateReportQueryThunk(id, query));
  },
  onTypeUpdate: (id: any, type: any) => {
    dispatch(updateReportTypeThunk(id, type));
  },
  onReportSettingUpdate: (id: any, setting: any, value: any) => {
    dispatch(updateReportSettingThunk(id, setting, value));
  },
  onFieldsUpdate: (id: any, fields: any) => {
    dispatch(updateFieldsThunk(id, fields));
  },
  onGlobalParameterUpdate: (key: any, value: any) => {
    dispatch(updateGlobalParameterThunk(key, value));
  },
  onSelectionUpdate: (id: any, selectable: any, field: any) => {
    dispatch(updateSelectionThunk(id, selectable, field));
  },
  onToggleCardSettings: (id: any, open: any) => {
    dispatch(toggleCardSettingsThunk(id, open));
  },
  onReportHelpButtonPressed: () => {
    dispatch(setReportHelpModalOpen(true));
  },
  onToggleReportSettings: (id: any) => {
    dispatch(toggleReportSettings(id));
  },
  onDatabaseChanged: (id: any, database: any) => {
    dispatch(updateReportDatabaseThunk(id, database));
  },
  createNotification: (title: any, message: any) => {
    dispatch(createNotificationThunk(title, message));
  },
  loadDatabaseListFromNeo4j: (driver, callback) => dispatch(loadDatabaseListFromNeo4jThunk(driver, callback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoCard);
