import { debounce } from '@material-ui/core';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useCallback, useEffect } from 'react';
import NeoField from '../../../component/field/Field';

const FreeTextParameterSelectComponent = ({ parameterValue, setParameterValue, query, settings }) => {
  const setParameterTimeout = settings && settings.setParameterTimeout ? settings.setParameterTimeout : 1000;
  const defaultValue =
    settings && settings.defaultValue && settings.defaultValue.length > 0 ? settings.defaultValue : '';
  const [inputText, setInputText] = React.useState(parameterValue);
  const [displayValue, setDisplayValue] = React.useState(parameterValue);
  const label = settings && settings.entityType ? settings.entityType : '';
  const property = settings && settings.propertyType ? settings.propertyType : '';
  const { helperText, clearParameterOnFieldClear } = settings;

  const debouncedSetParameterValue = useCallback(debounce(setParameterValue, setParameterTimeout), []);
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (displayValue == '' && clearParameterOnFieldClear) {
        debouncedSetParameterValue(undefined);
      } else {
        debouncedSetParameterValue(displayValue);
      }
    }, 250);
    return () => clearTimeout(timeOutId);
  }, [displayValue]);

  // In case the components gets (re)loaded with a different/non-existing selected parameter, set the text to the current global parameter value.
  if (query && displayValue != parameterValue && parameterValue != inputText) {
    setDisplayValue(parameterValue);
    setInputText(displayValue == defaultValue ? '' : parameterValue);
  }

  return (
    <div style={{ width: '100%' }}>
      <NeoField
        key={'freetext'}
        label={helperText ? helperText : `${label} ${property}`}
        defaultValue={defaultValue}
        value={displayValue}
        variant='outlined'
        placeholder={'Enter text here...'}
        style={{ marginBottom: '10px', marginRight: '10px', marginLeft: '15px', width: 'calc(100% - 80px)' }}
        onChange={(newValue) => {
          // TODO: i want this to be a proper wait instead of triggering on the first character.
          if (newValue == null && clearParameterOnFieldClear) {
            setDisplayValue(defaultValue);
          } else {
            setDisplayValue(newValue);
          }
        }}
      />
      {displayValue !== parameterValue ? (
        <CircularProgress size={26} style={{ marginTop: '20px', marginLeft: '5px' }} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default FreeTextParameterSelectComponent;
