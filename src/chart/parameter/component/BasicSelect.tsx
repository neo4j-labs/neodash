import React, { useCallback } from 'react';
import { ParameterSelectProps } from './ParameterSelect';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { CircularProgress, debounce } from '@mui/material';
import { SelectionConfirmationButton } from './SelectionConfirmationButton';

const BasicSelect = (props: ParameterSelectProps) => {
  const { manualParameterSave, predefinedOptions } = props;
  const setParameterTimeout =
    props.settings && props.settings.setParameterTimeout ? props.settings.setParameterTimeout : 1000;
  const defaultValue =
    props.settings && props.settings.defaultValue && props.settings.defaultValue.length > 0
      ? props.settings.defaultValue
      : '';
  const defaultOptions = (predefinedOptions && predefinedOptions.split(',')) || [];
  const [inputText, setInputText] = React.useState(props.parameterValue);
  const label = props.settings && props.settings.entityType ? props.settings.entityType : '';
  const property = props.settings && props.settings.propertyType ? props.settings.propertyType : '';
  const helperText = props.settings && props.settings.helperText ? props.settings.helperText : '';
  const clearParameterOnFieldClear =
    props.settings && props.settings.clearParameterOnFieldClear ? props.settings.clearParameterOnFieldClear : false;
  const [running, setRunning] = React.useState(false);
  const [paramValueLocal, setParamValueLocal] = React.useState(null);

  const setParameterValue = (value) => {
    setRunning(false);
    props.setParameterValue(value);
  };
  const debouncedSetParameterValue = useCallback(debounce(setParameterValue, setParameterTimeout), []);

  const manualHandleParametersUpdate = () => {
    handleParametersUpdate(paramValueLocal, false);
  };

  const handleParametersUpdate = (value, manual = false) => {
    setParamValueLocal(value);

    if (manual) {
      return;
    }

    if (value == null && clearParameterOnFieldClear) {
      debouncedSetParameterValue(defaultValue);
    } else {
      debouncedSetParameterValue(value);
    }
  };

  // If the user hasn't typed, and the parameter value mismatches the input value --> it was changed externally --> refresh the input value.
  if (running == false && inputText !== props.parameterValue) {
    setInputText(props.parameterValue);
  }

  return (
    <div className={'n-flex n-flex-row n-flex-wrap n-items-center'}>
      <FormControl
        fullWidth
        style={{
          maxWidth: 'calc(100% - 40px)',
          minWidth: `calc(100% - ${manualParameterSave ? '60' : '30'}px)`,
          marginLeft: '15px',
          marginTop: '5px',
        }}
      >
        <InputLabel shrink id='dropdown'>
          {helperText ? helperText : `${label} ${property}`}
        </InputLabel>
        <Select
          labelId={'dropdown'}
          id='dropdown-id'
          label={helperText ? helperText : `${label} ${property}`}
          value={inputText}
          onChange={(event) => {
            setRunning(true);
            setInputText(event.target.value);

            handleParametersUpdate(event.target.value, manualParameterSave);
          }}
        >
          {defaultOptions.map((option) => (
            <MenuItem value={option}>{option}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {manualParameterSave ? <SelectionConfirmationButton onClick={() => manualHandleParametersUpdate()} /> : <></>}
      {running ? <CircularProgress size={26} style={{ marginTop: '20px', marginLeft: '5px' }} /> : <></>}
    </div>
  );
};

export default BasicSelect;
