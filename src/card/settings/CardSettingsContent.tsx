import React, { useEffect } from 'react';
import CardContent from '@mui/material/CardContent';
import debounce from 'lodash/debounce';
import { useCallback } from 'react';
import NeoCodeEditorComponent, {
  DEFAULT_CARD_SETTINGS_HELPER_TEXT_STYLE,
} from '../../component/editor/CodeEditorComponent';
import { getReportTypes } from '../../extensions/ExtensionUtils';
import {
  EXTENSIONS_CARD_SETTINGS_COMPONENT,
  getExtensionCardSettingsComponents,
} from '../../extensions/ExtensionConfig';
import NeoField from '../../component/field/Field';

const NeoCardSettingsContent = ({
  pagenumber,
  reportId,
  query,
  database, // Current report database
  databaseList, // List of databases the user can choose from ('system' is filtered out)
  reportSettings,
  type,
  extensions,
  onQueryUpdate,
  onReportSettingUpdate,
  onTypeUpdate,
  onDatabaseChanged, // When the database related to a report is changed it must be stored in the report state
}) => {
  // Ensure that we only trigger a text update event after the user has stopped typing.
  const [queryText, setQueryText] = React.useState(query);
  const debouncedQueryUpdate = useCallback(debounce(onQueryUpdate, 250), []);

  // State to manage the current database entry inside the form
  const [databaseText, setDatabaseText] = React.useState(database);
  const debouncedDatabaseUpdate = useCallback(debounce(onDatabaseChanged, 250), []);

  useEffect(() => {
    // Reset text to the dashboard state when the page gets reorganized.
    if (query !== queryText) {
      setQueryText(query);
    }
  }, [query]);

  const reportTypes = getReportTypes(extensions);
  const SettingsComponent = reportTypes[type] && reportTypes[type].settingsComponent;

  function hasExtensionComponents() {
    return (
      Object.keys(EXTENSIONS_CARD_SETTINGS_COMPONENT).filter(
        (name) => extensions[name] && EXTENSIONS_CARD_SETTINGS_COMPONENT[name]
      ).length > 0
    );
  }

  function updateCypherQuery(value) {
    debouncedQueryUpdate(value);
    setQueryText(value);
  }

  function renderExtensionsComponents() {
    const res = (
      <>
        {Object.keys(EXTENSIONS_CARD_SETTINGS_COMPONENT).map((name) => {
          const Component = extensions[name] ? EXTENSIONS_CARD_SETTINGS_COMPONENT[name] : '';
          return Component ? (
            <Component
              pagenumber={pagenumber}
              reportId={reportId}
              reportType={type}
              extensions={extensions}
              cypherQuery={queryText}
              updateCypherQuery={updateCypherQuery}
            />
          ) : (
            <></>
          );
        })}
      </>
    );
    return res;
  }

  const defaultQueryBoxComponent = (
    <>
      <NeoCodeEditorComponent
        value={queryText}
        editable={true}
        language={reportTypes[type] && reportTypes[type].inputMode ? reportTypes[type].inputMode : 'cypher'}
        onChange={(value) => {
          updateCypherQuery(value);
        }}
        placeholder={`Enter Cypher here...`}
      />
      <div style={DEFAULT_CARD_SETTINGS_HELPER_TEXT_STYLE}>{reportTypes[type] && reportTypes[type].helperText}</div>
    </>
  );

  return (
    <CardContent className='n-py-2'>
      <NeoField
        select
        id='type'
        label='Type'
        valueLabel={reportTypes[type].label}
        value={reportTypes[type].label}
        choices={Object.keys(reportTypes).map((option) => ({
          label: reportTypes[option].label,
          value: reportTypes[option].label,
        }))}
        onChange={(newValue) =>
          newValue && onTypeUpdate(Object.keys(reportTypes).find((key) => reportTypes[key].label === newValue.value))
        }
        menuPortalTarget={document.querySelector('body')}
        className='n-mr-2 n-w-5/12 n-max-w-xs n-inline-block n-w'
      />

      {reportTypes[type] && reportTypes[type].disableDatabaseSelector == undefined ? (
        <NeoField
          select
          id='databaseSelector'
          label='Database'
          placeholder='neo4j'
          valueLabel={databaseText}
          value={databaseText}
          choices={databaseList.map((database) => ({
            label: database,
            value: database,
          }))}
          onChange={(newValue) => {
            newValue && setDatabaseText(newValue.value);
            newValue && debouncedDatabaseUpdate(newValue.value);
          }}
          menuPortalTarget={document.querySelector('body')}
          className='n-mr-2 n-w-5/12 n-max-w-xs n-inline-block n-w'
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
        <div>{hasExtensionComponents() ? renderExtensionsComponents() : defaultQueryBoxComponent}</div>
      )}
    </CardContent>
  );
};

export default NeoCardSettingsContent;
