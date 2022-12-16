import React, { useEffect } from 'react';
import CardContent from '@material-ui/core/CardContent';
import MenuItem from '@material-ui/core/MenuItem';
import debounce from 'lodash/debounce';
import { useCallback } from 'react';
import NeoField from '../../component/field/Field';
import NeoCodeEditorComponent from '../../component/editor/CodeEditorComponent';
import { getReportTypes } from '../../extensions/ExtensionUtils';

const NeoCardSettingsContent = ({
  query,
  database, // Current report database
  databaseList, // List of databases the user can choose from ('system' is filtered out)
  reportSettings,
  refreshRate,
  type,
  extensions,
  onQueryUpdate,
  onRefreshRateUpdate,
  onReportSettingUpdate,
  onTypeUpdate,
  onDatabaseChanged, // When the database related to a report is changed it must be stored in the report state
}) => {
  // Ensure that we only trigger a text update event after the user has stopped typing.
  const [queryText, setQueryText] = React.useState(query);
  const debouncedQueryUpdate = useCallback(debounce(onQueryUpdate, 250), []);

  const [refreshRateText, setRefreshRateText] = React.useState(refreshRate);
  const debouncedRefreshRateUpdate = useCallback(debounce(onRefreshRateUpdate, 250), []);

  // State to manage the current database entry inside the form
  const [databaseText, setDatabaseText] = React.useState(database);
  const debouncedDatabaseUpdate = useCallback(debounce(onDatabaseChanged, 250), []);

  useEffect(() => {
    // Reset text to the dashboard state when the page gets reorganized.
    if (query !== queryText) {
      setQueryText(query);
    }
  }, [query]);

  useEffect(() => {
    // Reset text to the dashboard state when the page gets reorganized.
    if (refreshRate !== refreshRateText) {
      setRefreshRateText(refreshRate !== undefined ? refreshRate : '');
    }
  }, [refreshRate]);

  const reportTypes = getReportTypes(extensions);
  const SettingsComponent = reportTypes[type] && reportTypes[type].settingsComponent;

  return (
    <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
      <NeoField
        select
        label={'Type'}
        value={type}
        style={{ marginLeft: '0px', marginRight: '10px', width: '47%', maxWidth: '200px' }}
        onChange={(value) => onTypeUpdate(value)}
        choices={Object.keys(reportTypes).map((option) => (
          <MenuItem key={option} value={option}>
            {reportTypes[option].label}
          </MenuItem>
        ))}
      />

      {reportTypes[type] && reportTypes[type].disableRefreshRate == undefined ? (
        <NeoField
          select
          placeholder='neo4j'
          label='Database'
          value={databaseText}
          style={{ width: '47%', maxWidth: '200px', marginRight: '10px' }}
          choices={databaseList.map((database) => (
            <MenuItem key={database} value={database}>
              {database}
            </MenuItem>
          ))}
          onChange={(value) => {
            setDatabaseText(value);
            debouncedDatabaseUpdate(value);
          }}
        />
      ) : (
        <></>
      )}

      {reportTypes[type] && reportTypes[type].disableRefreshRate == undefined ? (
        <NeoField
          placeholder='0 (No Refresh)'
          label='Refresh Rate (sec)'
          numeric={true}
          value={refreshRateText}
          style={{ width: '47%', maxWidth: '200px' }}
          onChange={(value) => {
            setRefreshRateText(value);
            debouncedRefreshRateUpdate(value);
          }}
        />
      ) : (
        <></>
      )}

      <br />
      <br />
      {/* Allow for overriding the code box with a custom component */}
      {reportTypes[type] && reportTypes[type].settingsComponent ? (
        <SettingsComponent
          type={type}
          onReportSettingUpdate={onReportSettingUpdate}
          settings={reportSettings}
          database={database}
          query={query}
          onQueryUpdate={onQueryUpdate}
        />
      ) : (
        <div>
          <NeoCodeEditorComponent
            value={queryText}
            editable={true}
            language={reportTypes[type] && reportTypes[type].inputMode ? reportTypes[type].inputMode : 'cypher'}
            onChange={(value) => {
              debouncedQueryUpdate(value);
              setQueryText(value);
            }}
            placeholder={'Enter Cypher here...'}
          />
          <p
            style={{
              color: 'grey',
              fontSize: 12,
              paddingLeft: '5px',
              borderBottom: '1px solid lightgrey',
              borderLeft: '1px solid lightgrey',
              borderRight: '1px solid lightgrey',
              marginTop: '0px',
            }}
          >
            {reportTypes[type] && reportTypes[type].helperText}
          </p>
        </div>
      )}
    </CardContent>
  );
};

export default NeoCardSettingsContent;
