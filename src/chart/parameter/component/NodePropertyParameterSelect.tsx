import React, { useCallback } from 'react';
import { debounce, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ParameterSelectProps } from './ParameterSelect';

const NodePropertyParameterSelectComponent = (props: ParameterSelectProps) => {
  const suggestionsUpdateTimeout =
    props.settings && props.settings.suggestionsUpdateTimeout ? props.settings.suggestionsUpdateTimeout : 250;
  const defaultValue =
    props.settings && props.settings.defaultValue && props.settings.defaultValue.length > 0
      ? props.settings.defaultValue
      : '';
  const [extraRecords, setExtraRecords] = React.useState([]);
  const [inputText, setInputText] = React.useState(props.parameterValue);
  const [displayValue, setDisplayValue] = React.useState(props.parameterValue);
  const debouncedQueryCallback = useCallback(debounce(props.queryCallback, suggestionsUpdateTimeout), []);
  const label = props.settings && props.settings.entityType ? props.settings.entityType : '';
  const property = props.settings && props.settings.propertyType ? props.settings.propertyType : '';
  const { helperText, clearParameterOnFieldClear } = props.settings;

  return (
    <Autocomplete
      id='autocomplete'
      options={extraRecords.map((r) => (r._fields && r._fields[0] !== null ? r._fields[0] : '(no data)')).sort()}
      getOptionLabel={(option) => (option ? option.toString() : '')}
      style={{ maxWidth: 'calc(100% - 30px)', marginLeft: '15px', marginTop: '5px' }}
      inputValue={inputText !== null ? inputText.toString() : ''}
      onInputChange={(event, value) => {
        setInputText(`${value}`);
        debouncedQueryCallback(props.query, { input: `${value}` }, setExtraRecords);
      }}
      getOptionSelected={(option, value) => {
        return (option && option.toString()) === (value && value.toString());
      }}
      value={displayValue !== null ? displayValue.toString() : `${props.parameterValue}`}
      onChange={(event, newValue) => {
        setDisplayValue(newValue);
        setInputText(`${newValue}`);
        if (newValue && newValue.low) {
          newValue = newValue.low;
        }
        if (newValue == null && clearParameterOnFieldClear) {
          props.setParameterValue(undefined);
        } else if (newValue == null) {
          props.setParameterValue(defaultValue);
        } else {
          props.setParameterValue(newValue);
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
