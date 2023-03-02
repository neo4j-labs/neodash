import React from 'react';
import { Autocomplete } from '@material-ui/lab';
import { Fab, TextField, Typography } from '@material-ui/core';

/**
 * Renders an auto-complete text field for property identifiers.
 * TODO - check that the same database is used that the component has selected.
 */
export const PropertyNameAutocomplete = ({
  disabled,
  index,
  inputs,
  setInputs,
  values,
  setValues,
  records,
  setRecords,
  queryCallback,
}) => {
  return (
    <Autocomplete
      id='autocomplete-property'
      disabled={disabled}
      options={records.map((r) => (r._fields ? r._fields[0] : '(no data)'))}
      getOptionLabel={(option) => (option ? option : '')}
      style={{ display: 'inline-block', width: 170, marginLeft: '5px', marginTop: '0px' }}
      inputValue={inputs[index]}
      onInputChange={(event, value) => {
        const newPropertyInputTexts = [...inputs];
        newPropertyInputTexts[index] = value;
        setInputs(newPropertyInputTexts);
        queryCallback(
          'CALL db.propertyKeys() YIELD propertyKey as propertyName WITH propertyName WHERE toLower(propertyName) CONTAINS toLower($input) RETURN DISTINCT propertyName LIMIT 5',
          { input: value },
          setRecords
        );
      }}
      value={values[index].name}
      onChange={(e, val) => {
        const newProperties = [...values];
        newProperties[index].name = val;
        setValues(newProperties);
      }}
      renderInput={(params) => <TextField {...params} placeholder='Name...' InputLabelProps={{ shrink: true }} />}
    />
  );
};
