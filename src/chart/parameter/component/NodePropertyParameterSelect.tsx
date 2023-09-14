import React, { useCallback, useEffect } from 'react';
import { debounce, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { ParameterSelectProps } from './ParameterSelect';
import { RenderSubValue } from '../../../report/ReportRecordProcessing';
import { SelectionConfirmationButton } from './SelectionConfirmationButton';

const NodePropertyParameterSelectComponent = (props: ParameterSelectProps) => {
  const suggestionsUpdateTimeout =
    props.settings && props.settings.suggestionsUpdateTimeout ? props.settings.suggestionsUpdateTimeout : 250;
  const defaultValue =
    props.settings && props.settings.defaultValue && props.settings.defaultValue.length > 0
      ? props.settings.defaultValue
      : '';

  const disabled = props.settings && props.settings.disabled ? props.settings.disabled : false;
  const getInitialValue = (value, multi) => {
    if (value && Array.isArray(value)) {
      return multi ? value : null;
    } else if (value) {
      return multi ? [value] : value;
    }
    return multi ? [] : value;
  };
  const { multiSelector, manualParameterSave } = props;
  const allParameters = props.allParameters ? props.allParameters : {};
  const [extraRecords, setExtraRecords] = React.useState([]);
  const [inputDisplayText, setInputDisplayText] = React.useState(
    props.parameterDisplayValue && multiSelector ? '' : props.parameterDisplayValue
  );
  const [inputValue, setInputValue] = React.useState(getInitialValue(props.parameterDisplayValue, multiSelector));

  const [paramValueLocal, setParamValueLocal] = React.useState(props.parameterValue);
  const [paramValueDisplayLocal, setParamValueDisplayLocal] = React.useState(props.parameterDisplayValue);

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

  const manualHandleParametersUpdate = () => {
    handleParametersUpdate(paramValueLocal, paramValueDisplayLocal, false);
  };
  const handleParametersUpdate = (value, displayValue, manual = false) => {
    setParamValueLocal(value);
    setParamValueDisplayLocal(displayValue);

    if (manual) {
      return;
    }

    props.setParameterValue(value);
    props.setParameterDisplayValue(displayValue);
  };
  const handleCrossClick = (isMulti, value) => {
    if (isMulti) {
      if (value.length == 0 && clearParameterOnFieldClear) {
        setInputValue([]);
        handleParametersUpdate(undefined, undefined, manualParameterSave);
        return true;
      }
      if (value.length == 0) {
        setInputValue([]);
        handleParametersUpdate([], [], manualParameterSave);
        return true;
      }
    } else {
      if (value && clearParameterOnFieldClear) {
        setInputValue(null);
        handleParametersUpdate(undefined, undefined, manualParameterSave);
        return true;
      }
      if (value == null) {
        setInputValue(null);
        handleParametersUpdate(defaultValue, defaultValue, manualParameterSave);
        return true;
      }
      return false;
    }
  };
  const propagateSelection = (event, newDisplay) => {
    const isMulti = Array.isArray(newDisplay);
    if (handleCrossClick(isMulti, newDisplay)) {
      return;
    }
    let newValue;
    let valReference = manualParameterSave ? paramValueLocal : props.parameterValue;
    let valDisplayReference = manualParameterSave ? paramValueDisplayLocal : props.parameterDisplayValue;
    // Multiple and new entry
    if (isMulti && inputValue.length < newDisplay.length) {
      newValue = Array.isArray(valReference) ? [...valReference] : [valReference];
      const newDisplayValue = [...newDisplay].slice(-1)[0];

      let val = extraRecords.filter((r) => r._fields[displayValueRowIndex].toString() == newDisplayValue)[0]._fields[
        realValueRowIndex
      ];

      newValue.push(RenderSubValue(val));
    } else if (!isMulti) {
      newValue = extraRecords.filter((r) => (r?._fields?.[displayValueRowIndex]?.toString() || null) == newDisplay)[0]
        ._fields[realValueRowIndex];

      newValue = RenderSubValue(newValue);
    } else {
      let ele = valDisplayReference.filter((x) => !newDisplay.includes(x))[0];
      newValue = [...valReference];
      newValue.splice(valDisplayReference.indexOf(ele), 1);
    }

    setInputDisplayText(isMulti ? '' : newDisplay);
    setInputValue(newDisplay);

    handleParametersUpdate(newValue, newDisplay, manualParameterSave);
  };

  useEffect(() => {
    setInputValue(getInitialValue(props.parameterDisplayValue, multiSelector));
    handleParametersUpdate(props.parameterValue, props.parameterDisplayValue, true);
  }, [props.parameterValue]);

  return (
    <div className={'n-flex n-flex-row n-flex-wrap n-items-center'}>
      <Autocomplete
        id='autocomplete'
        multiple={multiSelector}
        options={extraRecords && extraRecords.map((r) => r?._fields?.[displayValueRowIndex] || '(no data)').sort()}
        disabled={disabled}
        style={{
          maxWidth: 'calc(100% - 40px)',
          minWidth: `calc(100% - ${manualParameterSave ? '60' : '30'}px)`,
          marginLeft: '15px',
          marginTop: '5px',
        }}
        inputValue={inputDisplayText || ''}
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
      {manualParameterSave ? <SelectionConfirmationButton onClick={() => manualHandleParametersUpdate()} /> : <></>}
    </div>
  );
};

export default NodePropertyParameterSelectComponent;
