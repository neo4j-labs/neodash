import React from 'react';
import { Autocomplete } from '@material-ui/lab';
import { Fab, TextField, Typography } from '@material-ui/core';

/**
 * Renders an auto-complete text field that uses either:
 * - The labels from the active Neo4j database.
 * - The relationship types from the active Neo4j database.
 * TODO - check that the same database is used that the component has selected.
 */
export const LabelTypeAutocomplete = ({
  type, // 'Node' or 'Relationship'
  input,
  setInput,
  value,
  setValue,
  records,
  setRecords, // TODO document
  queryCallback,
}) => {
  return (
    <Autocomplete
      id='autocomplete-label-type'
      options={records.map((r) => (r._fields ? r._fields[0] : '(no data)'))}
      getOptionLabel={(option) => option || ''}
      style={{ width: '100%', marginLeft: '5px', marginTop: '5px' }}
      inputValue={input}
      onInputChange={(event, value) => {
        setInput(value);
        if (type == 'Node') {
          queryCallback(
            'CALL db.labels() YIELD label WITH label as nodeLabel WHERE toLower(nodeLabel) CONTAINS toLower($input) RETURN DISTINCT nodeLabel LIMIT 5',
            { input: value },
            setRecords
          );
        } else {
          queryCallback(
            'CALL db.relationshipTypes() YIELD relationshipType WITH relationshipType as relType WHERE toLower(relType) CONTAINS toLower($input) RETURN DISTINCT relType LIMIT 5',
            { input: value },
            setRecords
          );
        }
      }}
      value={value}
      onChange={(event, newValue) => setValue(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder='Start typing...'
          InputLabelProps={{ shrink: true }}
          label={type == 'Relationship' ? 'Type' : 'Label'}
        />
      )}
    />
  );
};
