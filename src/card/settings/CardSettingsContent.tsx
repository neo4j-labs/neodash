import React, { useEffect } from 'react';
import CardContent from '@material-ui/core/CardContent';
import MenuItem from '@material-ui/core/MenuItem';
import debounce from 'lodash/debounce';
import { useCallback } from 'react';
import NeoField from '../../component/field/Field';
import NeoCodeEditorComponent from '../../component/editor/CodeEditorComponent';
import { getReportTypes } from '../../extensions/ExtensionUtils';
import { Button, FormControlLabel, FormGroup, Grid, Switch } from '@material-ui/core';
import { updateReportSetting } from '../CardActions';
import { settingsReducer } from '../../settings/SettingsReducer';

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
  useEffect(() => {
    // Reset text to the dashboard state when the page gets reorganized.
    onReportSettingUpdate('gptQuery', false);
  }, []);

  // Ensure that we only trigger a text update event after the user has stopped typing.
  const [queryText, setQueryText] = React.useState(
    query === reportSettings.openAiLastMessage ? reportSettings.openAiQuery : query
  );
  const debouncedQueryUpdate = useCallback(debounce(onQueryUpdate, 250), []);
  // State to manage the current database entry inside the form
  const [databaseText, setDatabaseText] = React.useState(database);
  const debouncedDatabaseUpdate = useCallback(debounce(onDatabaseChanged, 250), []);

  useEffect(() => {
    // Reset text to the dashboard state when the page gets reorganized.
    // !query === reportSettings.openAiLastMessage to prevent strange starting behaviour
    if (query !== queryText) {
      if (!query === reportSettings.openAiLastMessage) {
        setQueryText(query);
      } else {
        setQueryText(reportSettings.openAiQuery);
      }
    }
  }, [query]);

  const reportTypes = getReportTypes(extensions);

  const SettingsComponent = reportTypes[type] && reportTypes[type].settingsComponent;
  const gptEnabled = reportSettings.gptQuery == true;
  const switchComponent = (
    <Switch
      checked={gptEnabled}
      onChange={(_) => {
        onReportSettingUpdate('gptQuery', !gptEnabled);
        let value = '';
        if (gptEnabled) {
          value = reportSettings.openAiQuery ? reportSettings.openAiQuery : '';
        } else {
          value = reportSettings.openAiLastMessage ? reportSettings.openAiLastMessage : '';
        }
        setQueryText(value);
      }}
      color='default'
    />
  );
  const languageControl = (
    <Grid component='label' container alignItems='center' spacing={0}>
      <Grid item>Cypher</Grid>
      <Grid item>{switchComponent}</Grid>
      <Grid item>English</Grid>
    </Grid>
  );

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

      {reportTypes[type] && reportTypes[type].disableDatabaseSelector == undefined ? (
        <NeoField
          select
          placeholder='neo4j'
          label='Database'
          value={databaseText}
          style={{ width: '47%', maxWidth: '200px' }}
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
          <FormGroup>
            <FormControlLabel style={{ marginLeft: '5px', marginBottom: '10px' }} control={languageControl} />
          </FormGroup>
          <div>
            <div style={{}}>
              <NeoCodeEditorComponent
                value={queryText}
                editable={true}
                language={
                  gptEnabled
                    ? 'text'
                    : reportTypes[type] && reportTypes[type].inputMode
                    ? reportTypes[type].inputMode
                    : 'cypher'
                }
                onChange={(value) => {
                  debouncedQueryUpdate(value);
                  setQueryText(value);
                  if (gptEnabled && !reportSettings.toUpdate) {
                    onReportSettingUpdate('toUpdate', true);
                  }
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
          </div>
        </div>
      )}

      {/* {openAiEnabled ? (
            <Button variant='contained' onClick={() => setOpenAiCounter(openAiCounter + 1)}>
              ask chatgpt
            </Button>
          ) : (
            <></>
          )} */}
    </CardContent>
  );
};

export default NeoCardSettingsContent;
