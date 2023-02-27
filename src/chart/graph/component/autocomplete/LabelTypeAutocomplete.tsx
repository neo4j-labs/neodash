import React from 'react';
import { Autocomplete } from '@material-ui/lab';
import { Fab, TextField, Typography } from '@material-ui/core';

export const LabelTypeAutocomplete = ({
  type,
  input,
  setInput,
  value,
  setValue,
  records,
  setRecords,
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
        if (type == 'Node Property') {
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
