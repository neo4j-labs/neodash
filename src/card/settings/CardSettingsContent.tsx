import React, { useEffect } from 'react';
import CardContent from '@mui/material/CardContent';
import debounce from 'lodash/debounce';
import { useCallback } from 'react';
import NeoCodeEditorComponent from '../../component/editor/CodeEditorComponent';
import { getReportTypes } from '../../extensions/ExtensionUtils';
import { Dropdown } from '@neo4j-ndl/react';
import { NeoLanguageToggleSwitch } from '../../extensions/query-translator/component/LanguageToggleSwitch';
import {
  EXTENSIONS_CARD_SETTINGS_COMPONENTS,
  getExtensionCardSettingsComponents,
} from '../../extensions/ExtensionConfig';

const NeoCardSettingsContent = ({
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
  // Store a generic dictionary of query text variables in a dictionary, where the key is the language.
  const [queryTexts, setQueryTexts] = React.useState({ Cypher: query });
  const debouncedQueryUpdate = useCallback(debounce(onQueryUpdate, 250), []);

  // State to manage the current database entry inside the form
  const [databaseText, setDatabaseText] = React.useState(database);
  const debouncedDatabaseUpdate = useCallback(debounce(onDatabaseChanged, 250), []);

  const [languageName, setLanguageName] = React.useState('Cypher');

  useEffect(() => {
    // Reset text to the dashboard state when the page gets reorganized.
    if (query !== queryTexts.Cypher) {
      const newQueryTexts = { ...queryTexts };
      newQueryTexts.Cypher = query;
      setQueryTexts(newQueryTexts);
    }
  }, [query]);

  useEffect(() => {
    // Reset text to the dashboard state when the page gets reorganized.
    if (reportSettings.naturalLanguageQuery !== queryTexts.English) {
      const newQueryTexts = { ...queryTexts };
      newQueryTexts.English = reportSettings.naturalLanguageQuery;
      setQueryTexts(newQueryTexts);
    }
  }, [reportSettings.naturalLanguageQuery]);

  const reportTypes = getReportTypes(extensions);
  const SettingsComponent = reportTypes[type] && reportTypes[type].settingsComponent;

  function renderExtensionsComponents() {
    const res = (
      <>
        {Object.keys(EXTENSIONS_CARD_SETTINGS_COMPONENTS).map((name) => {
          const Component = extensions[name] ? EXTENSIONS_CARD_SETTINGS_COMPONENTS[name] : '';
          return Component ? <Component setLanguageName={setLanguageName} /> : <></>;
        })}
      </>
    );
    return res;
  }

  return (
    <CardContent style={{ paddingTop: '10px', paddingBottom: '10px' }}>
      <Dropdown
        id='type'
        label='Type'
        type='select'
        selectProps={{
          onChange: (newValue) =>
            newValue && onTypeUpdate(Object.keys(reportTypes).find((key) => reportTypes[key].label === newValue.value)),
          options: Object.keys(reportTypes).map((option) => ({
            label: reportTypes[option].label,
            value: reportTypes[option].label,
          })),
          value: { label: reportTypes[type].label, value: reportTypes[type].label },
          menuPortalTarget: document.querySelector('body'),
        }}
        fluid
        style={{ marginLeft: '0px', marginRight: '10px', width: '47%', maxWidth: '200px', display: 'inline-block' }}
      />

      {reportTypes[type] && reportTypes[type].disableDatabaseSelector == undefined ? (
        <Dropdown
          id='databaseSelector'
          label='Database'
          placeholder='neo4j'
          type='select'
          selectProps={{
            onChange: (newValue) => {
              newValue && setDatabaseText(newValue.value);
              newValue && debouncedDatabaseUpdate(newValue.value);
            },
            options: databaseList.map((database) => ({
              label: database,
              value: database,
            })),
            value: { label: databaseText, value: databaseText },
            menuPortalTarget: document.querySelector('body'),
          }}
          fluid
          style={{ marginLeft: '0px', marginRight: '10px', width: '47%', maxWidth: '200px', display: 'inline-block' }}
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
          {renderExtensionsComponents()}
          <NeoCodeEditorComponent
            value={queryTexts[languageName]}
            editable={true}
            language={reportTypes[type] && reportTypes[type].inputMode ? reportTypes[type].inputMode : 'cypher'}
            onChange={(value) => {
              if (languageName == 'Cypher') {
                debouncedQueryUpdate(value);
              } else {
                onReportSettingUpdate('naturalLanguageQuery', value);
              }

              const newQueryText = { ...queryTexts };
              newQueryText[languageName] = value;
              setQueryTexts(newQueryText);
            }}
            placeholder={`Enter ${  languageName  } here...`}
          />
          <div
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
          </div>
        </div>
      )}
    </CardContent>
  );
};

export default NeoCardSettingsContent;
