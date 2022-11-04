import React, { useCallback, useContext, useEffect } from 'react';
import { RUN_QUERY_DELAY_MS } from '../../../config/ReportConfig';
import { QueryStatus, runCypherQuery } from '../../../report/ReportQueryRunner';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { debounce, MenuItem, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import NeoField from '../../../component/field/Field';
import { getReportTypes } from '../../../extensions/ExtensionUtils';

const NeoCardSettingsContentPropertySelect = ({ type, database, settings, extensions, onReportSettingUpdate, onQueryUpdate }) => {
    const { driver } = useContext<Neo4jContextState>(Neo4jContext);
    if (!driver) throw new Error('`driver` not defined. Have you added it into your app as <Neo4jContext.Provider value={{driver}}> ?')

    const debouncedRunCypherQuery = useCallback(
        debounce(runCypherQuery, RUN_QUERY_DELAY_MS),
        [],
    );
  }

  const debouncedRunCypherQuery = useCallback(debounce(runCypherQuery, RUN_QUERY_DELAY_MS), []);

  const { manualPropertyNameSpecification } = settings;
  const [labelInputText, setLabelInputText] = React.useState(settings.entityType);
  const [labelRecords, setLabelRecords] = React.useState([]);
  const [propertyInputText, setPropertyInputText] = React.useState(settings.propertyType);
  const [propertyRecords, setPropertyRecords] = React.useState([]);
  const { parameterName } = settings;

  // When certain settings are updated, a re-generated search query is needed.
  useEffect(() => {
    updateReportQuery(settings.entityType, settings.propertyType);
  }, [settings.suggestionLimit, settings.deduplicateSuggestions, settings.searchType, settings.caseSensitive]);

  if (settings.type == undefined) {
    onReportSettingUpdate('type', 'Node Property');
  }
  if (!parameterName && settings.entityType && settings.propertyType) {
    const id = settings.id ? settings.id : '';
    onReportSettingUpdate(
      'parameterName',
      `neodash_${`${settings.entityType}_${settings.propertyType}${id == '' || id.startsWith('_') ? id : `_${id}`}`
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll('-', '_')}`,
    );
  }
  // Define query callback to allow reports to get extra data on interactions.
  const queryCallback = useCallback((query, parameters, setRecords) => {
    debouncedRunCypherQuery(
      driver,
      database,
      query,
      parameters,
      10,
      (status) => {
        //
        status == QueryStatus.NO_DATA ? setRecords([]) : null;
      },
      (result) => setRecords(result),
      () => {},
    );
  }, []);

  function handleParameterTypeUpdate(newValue) {
    onReportSettingUpdate('entityType', undefined);
    onReportSettingUpdate('propertyType', undefined);
    onReportSettingUpdate('id', undefined);
    onReportSettingUpdate('parameterName', undefined);
    onReportSettingUpdate('type', newValue);
  }

  function handleNodeLabelSelectionUpdate(newValue) {
    setPropertyInputText('');
    onReportSettingUpdate('entityType', newValue);
    onReportSettingUpdate('propertyType', undefined);
    onReportSettingUpdate('parameterName', undefined);
  }

  function handleFreeTextNameSelectionUpdate(newValue) {
    if (newValue) {
      const new_parameter_name = `neodash_${newValue}`.toLowerCase().replaceAll(' ', '_').replaceAll('-', '_');
      handleReportQueryUpdate(new_parameter_name, newValue, undefined);
    } else {
      onReportSettingUpdate('parameterName', undefined);
    }
  }

  function handlePropertyNameSelectionUpdate(newValue) {
    onReportSettingUpdate('propertyType', newValue);
    if (newValue && settings.entityType) {
      const id = settings.id ? settings.id : '';
      const new_parameter_name = `neodash_${`${settings.entityType}_${newValue}${
        id == '' || id.startsWith('_') ? id : `_${id}`
      }`
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll('-', '_')}`;
      handleReportQueryUpdate(new_parameter_name, settings.entityType, newValue);
    } else {
      onReportSettingUpdate('parameterName', undefined);
    }
  }

  function handleIdSelectionUpdate(value) {
    const newValue = value ? value : '';
    onReportSettingUpdate('id', `${newValue}`);
    if (settings.propertyType && settings.entityType) {
      const id = value ? `_${value}` : '';
      const new_parameter_name = `neodash_${`${settings.entityType}_${settings.propertyType}${
        id == '' || id.startsWith('_') ? id : `_${id}`
      }`
        .toLowerCase()
        .replaceAll(' ', '_')
        .replaceAll('-', '_')}`;
      handleReportQueryUpdate(new_parameter_name, settings.entityType, settings.propertyType);
    }
  }

  function handleReportQueryUpdate(new_parameter_name, entityType, propertyType) {
    onReportSettingUpdate('parameterName', new_parameter_name);
    updateReportQuery(entityType, propertyType);
  }

  function updateReportQuery(entityType, propertyType) {
    const limit = settings.suggestionLimit ? settings.suggestionLimit : 5;
    const deduplicate = settings.deduplicateSuggestions !== undefined ? settings.deduplicateSuggestions : true;
    const searchType = settings.searchType ? settings.searchType : 'CONTAINS';
    const caseSensitive = settings.caseSensitive !== undefined ? settings.caseSensitive : false;
    if (settings.type == 'Node Property') {
      const newQuery =
        `MATCH (n:\`${entityType}\`) \n` +
        `WHERE ${caseSensitive ? '' : 'toLower'}(toString(n.\`${propertyType}\`)) ${searchType} ${
          caseSensitive ? '' : 'toLower'
        }($input) \n` +
        `RETURN ${deduplicate ? 'DISTINCT' : ''} n.\`${propertyType}\` as value ` +
        `ORDER BY size(toString(value)) ASC LIMIT ${limit}`;
      onQueryUpdate(newQuery);
    } else if (settings.type == 'Relationship Property') {
      const newQuery =
        `MATCH ()-[n:\`${entityType}\`]->() \n` +
        `WHERE ${caseSensitive ? '' : 'toLower'}(toString(n.\`${propertyType}\`)) ${searchType} ${
          caseSensitive ? '' : 'toLower'
        }($input) \n` +
        `RETURN ${deduplicate ? 'DISTINCT' : ''} n.\`${propertyType}\` as value ` +
        `ORDER BY size(toString(value)) ASC LIMIT ${limit}`;
      onQueryUpdate(newQuery);
    } else {
      const newQuery = 'RETURN true';
      onQueryUpdate(newQuery);
    }
  }

    const parameterSelectTypes = ["Node Property", "Relationship Property", "Free Text"]
    const reportTypes = getReportTypes(extensions);
    
    return <div>
        <p style={{ color: "grey", fontSize: 12, paddingLeft: "5px", border: "1px solid lightgrey", marginTop: "0px" }}>
            {reportTypes[type].helperText}
        </p>
        <TextField select={true} autoFocus id="type" value={settings["type"] ? settings["type"] : "Node Property"}
            onChange={(e) => {
                handleParameterTypeUpdate(e.target.value);
            }}
            value={settings.entityType ? settings.entityType : undefined}
            onChange={(event, newValue) => handleNodeLabelSelectionUpdate(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Start typing..."
                InputLabelProps={{ shrink: true }}
                label={settings.type == 'Node Property' ? 'Node Label' : 'Relationship Type'}
              />
            )}
          />
          {/* Draw the property name & id selectors only after a label/type has been selected. */}
          {settings.entityType ? (
            <>
              <Autocomplete
                id="autocomplete-property"
                options={
                  manualPropertyNameSpecification
                    ? [settings.propertyType]
                    : propertyRecords.map((r) => (r._fields ? r._fields[0] : '(no data)'))
                }
                getOptionLabel={(option) => (option ? option : '')}
                style={{ display: 'inline-block', width: 185, marginLeft: '5px', marginTop: '5px' }}
                inputValue={propertyInputText}
                onInputChange={(event, value) => {
                  setPropertyInputText(value);
                  if (manualPropertyNameSpecification) {
                    handlePropertyNameSelectionUpdate(value);
                  } else {
                    queryCallback(
                      'CALL db.propertyKeys() YIELD propertyKey as propertyName WITH propertyName WHERE toLower(propertyName) CONTAINS toLower($input) RETURN DISTINCT propertyName LIMIT 5',
                      { input: value },
                      setPropertyRecords,
                    );
                  }
                }}
                value={settings.propertyType}
                onChange={(event, newValue) => handlePropertyNameSelectionUpdate(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Start typing..."
                    InputLabelProps={{ shrink: true }}
                    label={'Property Name'}
                  />
                )}
              />
              <NeoField
                placeholder="number"
                label="Number (optional)"
                disabled={!settings.propertyType}
                value={settings.id}
                style={{ width: '135px', marginTop: '5px', marginLeft: '10px' }}
                onChange={(value) => {
                  handleIdSelectionUpdate(value);
                }}
              />
            </>
          ) : (
            <></>
          )}
        </>
      )}
      {parameterName ? (
        <p>
          Use <b>${parameterName}</b> in a query to use the parameter.
        </p>
      ) : (
        <></>
      )}
    </div>
  );
};

export default NeoCardSettingsContentPropertySelect;
