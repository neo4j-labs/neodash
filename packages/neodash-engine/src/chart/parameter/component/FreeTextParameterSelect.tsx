import { debounce, CircularProgress } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { ParameterSelectProps } from './ParameterSelect';
import NeoField from '../../../component/field/Field';
import { SelectionConfirmationButton } from './SelectionConfirmationButton';

const FreeTextParameterSelectComponent = (props: ParameterSelectProps) => {
  const { manualParameterSave } = props;
  const setParameterTimeout =
    props.settings && props.settings.setParameterTimeout ? props.settings.setParameterTimeout : 1000;
  const defaultValue =
    props.settings && props.settings.defaultValue && props.settings.defaultValue.length > 0
      ? props.settings.defaultValue
      : '';
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
    <div className={'n-flex n-flex-row n-flex-wrap n-items-center'} style={{ width: '100%', marginTop: '5px' }}>
      <NeoField
        key={'freetext'}
        label={helperText ? helperText : `${label} ${property}`}
        defaultValue={defaultValue}
        value={inputText}
        variant='outlined'
        placeholder={'Enter text here...'}
        style={{
          marginBottom: '20px',
          marginRight: '10px',
          marginLeft: '15px',
          minWidth: `calc(100% - ${manualParameterSave ? '80' : '30'}px)`,
          maxWidth: 'calc(100% - 30px)',
        }}
        onChange={(newValue) => {
          setRunning(true);
          setInputText(newValue);

          handleParametersUpdate(newValue, manualParameterSave);
        }}
      />
      {manualParameterSave ? <SelectionConfirmationButton onClick={() => manualHandleParametersUpdate()} /> : <></>}
      {running ? <CircularProgress size={26} style={{ marginTop: '20px', marginLeft: '5px' }} /> : <></>}
    </div>
  );
};

export default FreeTextParameterSelectComponent;
