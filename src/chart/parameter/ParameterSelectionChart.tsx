import React, { useCallback, useEffect } from 'react';
import { ChartProps } from '../Chart';
import { CircularProgress, debounce, TextareaAutosize, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import NeoField from '../../component/field/Field';

/**
 * A special chart type to define global dashboard parameters that are injected as query parameters into each report.
 */
const NeoParameterSelectionChart = (props: ChartProps) => {
  const { records } = props;
  const query = records[0].input ? records[0].input : undefined;
  const parameter = props.settings && props.settings.parameterName ? props.settings.parameterName : undefined;
  const parameterDisplay = `${parameter}_display`;
  const type = props.settings && props.settings.type ? props.settings.type : undefined;
  const suggestionsUpdateTimeout =
    props.settings && props.settings.suggestionsUpdateTimeout ? props.settings.suggestionsUpdateTimeout : 250;
  const setParameterTimeout =
    props.settings && props.settings.setParameterTimeout ? props.settings.setParameterTimeout : 1000;
  const defaultValue =
    props.settings && props.settings.defaultValue && props.settings.defaultValue.length > 0
      ? props.settings.defaultValue
      : '';
  const currentValue =
    props.getGlobalParameter && props.getGlobalParameter(parameter) ? props.getGlobalParameter(parameter) : '';

  const currentDisplayValue =
    props.getGlobalParameter && props.getGlobalParameter(parameterDisplay)
      ? props.getGlobalParameter(parameterDisplay)
      : '';

  const [extraRecords, setExtraRecords] = React.useState([]);
  const [inputText, setInputText] = React.useState(currentDisplayValue);
  const queryCallback = props.queryCallback ? props.queryCallback : () => {};
  const setGlobalParameter = props.setGlobalParameter ? props.setGlobalParameter : () => {};
  const [value, setValue] = React.useState(currentValue);

  const debouncedQueryCallback = useCallback(debounce(queryCallback, suggestionsUpdateTimeout), []);
  const debouncedSetGlobalParameter = useCallback(debounce(setGlobalParameter, setParameterTimeout), []);
  const compatibilityMode = !query.includes('as display');
  const indexCompatibility = compatibilityMode ? 0 : 1;
  const queryTimeOut = setTimeout(() => {
    debouncedQueryCallback && debouncedQueryCallback(query, { input: inputText, ...props.parameters }, setExtraRecords);
  }, 150);

  useEffect(() => {
    return () => clearTimeout(queryTimeOut);
  }, [inputText, query, props.parameters]);

  // In case the components gets (re)loaded with a different/non-existing selected parameter, set the text to the current global parameter value.
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (value == '' && clearParameterOnFieldClear) {
        debouncedSetGlobalParameter(parameter, undefined);
      } else {
        debouncedSetGlobalParameter(parameter, value);
      }
    }, 250);
    return () => clearTimeout(timeOutId);
  }, [value]);

  // In case the components gets (re)loaded with a different/non-existing selected parameter, set the text to the current global parameter value.
  if (query && value != currentValue && currentDisplayValue != inputText) {
    setValue(currentValue);
    setInputText(value == defaultValue ? '' : currentDisplayValue);
    setExtraRecords([]);
  }

  const label = props.settings && props.settings.entityType ? props.settings.entityType : '';
  const property = props.settings && props.settings.propertyType ? props.settings.propertyType : '';
  const propertyDisplay = props?.settings?.propertyDisplay || property;
  const settings = props.settings ? props.settings : {};
  const { helperText } = settings;
  const { clearParameterOnFieldClear } = settings;

  if (!query || query.trim().length == 0) {
    return (
      <p style={{ margin: '15px' }}>
        No selection specified. Open up the report settings and choose a node label and property.
      </p>
    );
  }

  return (
    <div>
      {type == 'Free Text' ? (
        <div style={{ width: '100%' }}>
          <NeoField
            key={'freetext'}
            label={helperText || `${label} ${propertyDisplay}`}
            defaultValue={defaultValue}
            value={value}
            variant='outlined'
            placeholder={'Enter text here...'}
            style={{ maxWidth: 'calc(100% - 30px)', marginLeft: '15px', marginTop: '5px', width: 'calc(100% - 80px)' }}
            onChange={(newValue) => {
              // TODO: i want this to be a proper wait instead of triggering on the first character.
              if (newValue == null && clearParameterOnFieldClear) {
                setValue(defaultValue);
              } else {
                setValue(newValue);
              }
            }}
          />
          {value !== currentValue ? (
            <CircularProgress size={26} style={{ marginTop: '20px', marginLeft: '5px' }} />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <Autocomplete
          id='autocomplete'
          options={extraRecords.map((r) => (r._fields ? r._fields[indexCompatibility] : '(no data)')).sort()}
          getOptionLabel={(option) => (option ? option.toString() : '')}
          style={{ maxWidth: 'calc(100% - 30px)', marginLeft: '15px', marginTop: '5px' }}
          inputValue={inputText !== null ? inputText.toString() : ''}
          onInputChange={(event, val) => {
            setInputText(`${val}`);
            debouncedQueryCallback(query, { input: `${val}` }, setExtraRecords);
          }}
          getOptionSelected={(option, val) => (option && option.toString()) === (val && val.toString())}
          value={inputText !== null ? inputText.toString() : `${currentValue}`}
          onChange={(event, newVal: string) => {
            let newValue = extraRecords.filter((r) => r._fields[indexCompatibility].toString() == newVal)[0]._fields[0];
            if (newValue && newValue.low) {
              newValue = newValue.low;
            }
            setValue(newValue);
            setInputText(`${newVal}`);
            if (newValue && newValue.low) {
              newValue = newValue.low;
            }
            if (newValue == null && clearParameterOnFieldClear) {
              props.setGlobalParameter(parameter, undefined);
              props.setGlobalParameter(parameterDisplay, undefined);
            } else if (newValue == null) {
              props.setGlobalParameter(parameter, defaultValue);
              props.setGlobalParameter(parameterDisplay, defaultValue);
            } else {
              props.setGlobalParameter(parameter, newValue);
              props.setGlobalParameter(parameterDisplay, newVal);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              InputLabelProps={{ shrink: true }}
              placeholder='Start typing...'
              label={helperText ? helperText : `${label} ${propertyDisplay}`}
              variant='outlined'
            />
          )}
        />
      )}
    </div>
  );
};

export default NeoParameterSelectionChart;
