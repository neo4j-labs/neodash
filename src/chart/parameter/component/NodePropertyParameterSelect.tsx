import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { useCallback, useEffect } from 'react';

const NodePropertyParameterSelectComponent = ({
  query,
  extraRecords,
  inputText,
  setInputText,
  debouncedQueryCallback,
  setExtraRecords,
  helperText,
  label,
  property,
  value,
  currentValue,
  setValue,
  clearParameterOnFieldClear,
  setGlobalParameter,
  parameter,
  defaultValue,
}) => {
  return (
    <Autocomplete
      id='autocomplete'
      options={extraRecords.map((r) => (r._fields && r._fields[0] !== null ? r._fields[0] : '(no data)')).sort()}
      getOptionLabel={(option) => (option ? option.toString() : '')}
      style={{ maxWidth: 'calc(100% - 30px)', marginLeft: '15px', marginTop: '5px' }}
      inputValue={inputText !== null ? inputText.toString() : ''}
      onInputChange={(event, value) => {
        setInputText(`${value}`);
        debouncedQueryCallback(query, { input: `${value}` }, setExtraRecords);
      }}
      getOptionSelected={(option, value) => {
        return (option && option.toString()) === (value && value.toString());
      }}
      value={value !== null ? value.toString() : `${currentValue}`}
      onChange={(event, newValue) => {
        setValue(newValue);
        setInputText(`${newValue}`);
        if (newValue && newValue.low) {
          newValue = newValue.low;
        }
        if (newValue == null && clearParameterOnFieldClear) {
          setGlobalParameter(parameter, undefined);
        } else if (newValue == null) {
          setGlobalParameter(parameter, defaultValue);
        } else {
          setGlobalParameter(parameter, newValue);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          InputLabelProps={{ shrink: true }}
          placeholder='Start typing...'
          label={helperText ? helperText : `${label} ${property}`}
          variant='outlined'
        />
      )}
    />
  );
};

export default NodePropertyParameterSelectComponent;
