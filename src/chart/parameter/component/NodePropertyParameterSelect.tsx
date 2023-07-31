import React, { useCallback } from 'react';
import { debounce, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { ParameterSelectProps } from './ParameterSelect';
import { RenderSubValue } from '../../../report/ReportRecordProcessing';

const NodePropertyParameterSelectComponent = (props: ParameterSelectProps) => {
  const suggestionsUpdateTimeout =
    props.settings && props.settings.suggestionsUpdateTimeout ? props.settings.suggestionsUpdateTimeout : 250;
  const defaultValue =
    props.settings && props.settings.defaultValue && props.settings.defaultValue.length > 0
      ? props.settings.defaultValue
      : '';

  const getInitialValue = (value, multi) => {
    if (value && Array.isArray(value)) {
      return multi ? value : null;
    } else if (value) {
      return multi ? [value] : value;
    }
    return multi ? [] : value;
  };
  const { multiSelector } = props;
  const allParameters = props.allParameters ? props.allParameters : {};
  const [extraRecords, setExtraRecords] = React.useState([]);
  const [inputDisplayText, setInputDisplayText] = React.useState(
    props.parameterDisplayValue && multiSelector ? '' : props.parameterDisplayValue
  );
  const [inputValue, setInputValue] = React.useState(getInitialValue(props.parameterDisplayValue, multiSelector));

  const debouncedQueryCallback = useCallback(debounce(props.queryCallback, suggestionsUpdateTimeout), []);
  const label = props.settings && props.settings.entityType ? props.settings.entityType : '';
  const propertyType = props.settings && props.settings.propertyType ? props.settings.propertyType : '';
  const helperText = props.settings && props.settings.helperText ? props.settings.helperText : '';
  const clearParameterOnFieldClear =
    props.settings && props.settings.clearParameterOnFieldClear ? props.settings.clearParameterOnFieldClear : false;

  // index of the display value in the resulting extra records retrieved by the component when the user types. equals '1' for NeoDash 2.2.2 and later.
  const displayValueRowIndex = props.compatibilityMode
    ? 0
    : extraRecords[0]?.keys?.findIndex((e) => e.toLowerCase() == 'display') || 0;

  const realValueRowIndex = props.compatibilityMode ? 0 : 1 - displayValueRowIndex;

  const handleCrossClick = (isMulti, value) => {
    if (isMulti) {
      if (value.length == 0 && clearParameterOnFieldClear) {
        setInputValue([]);
        props.setParameterValue(undefined);
        props.setParameterDisplayValue(undefined);
        return;
      }
      if (value.length == 0) {
        setInputValue([]);
        props.setParameterValue([]);
        props.setParameterDisplayValue([]);
        
      }
    } else {
      if (value && clearParameterOnFieldClear) {
        setInputValue(null);
        props.setParameterValue(undefined);
        props.setParameterDisplayValue(undefined);
        return;
      }
      if (value == null) {
        setInputValue(null);
        props.setParameterValue(defaultValue);
        props.setParameterDisplayValue(defaultValue);
        
      }
    }
  };
  const propagateSelection = (event, newDisplay) => {
    const isMulti = Array.isArray(newDisplay);
    handleCrossClick(isMulti, newDisplay);
    let newValue;
    // Multiple and new entry
    if (isMulti && inputValue.length < newDisplay.length) {
      newValue = Array.isArray(props.parameterValue) ? [...props.parameterValue] : [props.parameterValue];
      const newDisplayValue = [...newDisplay].slice(-1)[0];

      let val = extraRecords.filter((r) => r._fields[displayValueRowIndex].toString() == newDisplayValue)[0]._fields[
        realValueRowIndex
      ];

      newValue.push(val?.low ?? val);
    } else if (!isMulti) {
      newValue = extraRecords.filter((r) => r._fields[displayValueRowIndex].toString() == newDisplay)[0]._fields[
        realValueRowIndex
      ];

      newValue = newValue?.low || newValue;
    } else {
      let ele = props.parameterDisplayValue.filter((x) => !newDisplay.includes(x))[0];
      newValue = [...props.parameterValue];
      newValue.splice(props.parameterDisplayValue.indexOf(ele), 1);
    }

    setInputDisplayText(isMulti ? '' : newDisplay);
    setInputValue(newDisplay);

    props.setParameterValue(newValue);
    props.setParameterDisplayValue(newDisplay);
  };
  return (
    <Autocomplete
      id='autocomplete'
      multiple={multiSelector}
      options={extraRecords.map((r) => r?._fields?.[displayValueRowIndex] || '(no data)').sort()}
      style={{ maxWidth: 'calc(100% - 30px)', marginLeft: '15px', marginTop: '5px' }}
      inputValue={inputDisplayText}
      onInputChange={(event, value) => {
        setInputDisplayText(value);
        debouncedQueryCallback(props.query, { input: `${value}`, ...allParameters }, setExtraRecords);
      }}
      isOptionEqualToValue={(option, value) => {
        return (option && option.toString()) === (value && value.toString());
      }}
      value={inputValue}
      onChange={propagateSelection}
      renderInput={(params) => (
        <TextField
          {...params}
          InputLabelProps={{ shrink: true }}
          placeholder='Start typing...'
          label={helperText ? helperText : `${label} ${propertyType}`}
          variant='outlined'
        />
      )}
      getOptionLabel={(option) => RenderSubValue(option)}
    />
  );
};

export default NodePropertyParameterSelectComponent;
