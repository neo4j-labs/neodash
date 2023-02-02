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
  // const [inputText, setInputText] = React.useState(props.parameterValue);
  const [inputDisplayText, setInputDisplayText] = React.useState(props.parameterDisplayValue);
  const debouncedQueryCallback = useCallback(debounce(props.queryCallback, suggestionsUpdateTimeout), []);
  const label = props.settings && props.settings.entityType ? props.settings.entityType : '';
  const propertyType = props.settings && props.settings.propertyType ? props.settings.propertyType : '';
  const propertyDisplay =
    props.settings && props.settings.propertyTypeDisplay
      ? props.settings.propertyTypeDisplay
      : props.settings.propertyType;
  const helperText = props.settings && props.settings.helperText ? props.settings.helperText : '';
  const clearParameterOnFieldClear =
    props.settings && props.settings.clearParameterOnFieldClear ? props.settings.clearParameterOnFieldClear : false;

  // index of the display value in the resulting extra records retrieved by the component when the user types. equals '1' for NeoDash 2.2.2 and later.
  const displayValueRowIndex = props.compatibilityMode ? 0 : 1;

  return (
    <Autocomplete
      id='autocomplete'
      options={extraRecords
        .map((r) =>
          (r._fields && r._fields[displayValueRowIndex] !== null ? r._fields[displayValueRowIndex] : '(no data)')
        )
        .sort()}
      getOptionLabel={(option) => (option ? option.toString() : '')}
      style={{ maxWidth: 'calc(100% - 30px)', marginLeft: '15px', marginTop: '5px' }}
      inputValue={inputDisplayText !== null ? `${inputDisplayText}` : ''}
      onInputChange={(event, value) => {
        setInputDisplayText(value !== null ? `${value}` : '');
        debouncedQueryCallback(props.query, { input: `${value}` }, setExtraRecords);
      }}
      getOptionSelected={(option, value) => {
        return (option && option.toString()) === (value && value.toString());
      }}
      value={props.parameterDisplayValue !== null ? `${props.parameterDisplayValue}` : ''}
      onChange={(event, newDisplayValue) => {
        let newValue = extraRecords.filter((r) => r._fields[displayValueRowIndex].toString() == newDisplayValue)[0]
          ._fields[0];

        setInputDisplayText(newDisplayValue !== null ? `${newDisplayValue}` : '');
        if (newValue && newValue.low) {
          newValue = newValue.low;
        }
        if (newValue == null && clearParameterOnFieldClear) {
          props.setParameterValue(undefined);
          props.setParameterDisplayValue(undefined);
        } else if (newValue == null) {
          props.setParameterValue(defaultValue);
          props.setParameterDisplayValue(defaultValue);
        } else {
          props.setParameterValue(newValue);
          props.setParameterDisplayValue(newValue);
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          InputLabelProps={{ shrink: true }}
          placeholder='Start typing...'
          label={helperText ? helperText : `${label} ${propertyType}`}
          variant='outlined'
        />
      )}
    />
  );
};

export default NodePropertyParameterSelectComponent;
