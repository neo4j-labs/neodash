import React, { useCallback, useEffect } from 'react';
import { ChartProps } from '../Chart';
import { CircularProgress, debounce, TextareaAutosize, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import NeoField from '../../component/field/Field';
import FreeTextParameterSelectComponent from './component/FreeTextParameterSelect';
import NodePropertyParameterSelectComponent from './component/NodePropertyParameterSelect';
import RelationshipPropertyParameterSelectComponent from './component/RelationshipPropertyParameterSelect';

/**
 * A special chart type to define global dashboard parameters that are injected as query parameters into each report.
 */
const NeoParameterSelectionChart = (props: ChartProps) => {
  const { records } = props;
  const query = records[0].input ? records[0].input : undefined;
  const parameter = props.settings && props.settings.parameterName ? props.settings.parameterName : undefined;
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
  const [extraRecords, setExtraRecords] = React.useState([]);
  const [inputText, setInputText] = React.useState(currentValue);
  const queryCallback = props.queryCallback ? props.queryCallback : () => {};
  const setGlobalParameter = props.setGlobalParameter ? props.setGlobalParameter : () => {};
  const [value, setValue] = React.useState(currentValue);

  const debouncedQueryCallback = useCallback(debounce(queryCallback, suggestionsUpdateTimeout), []);
  const debouncedSetGlobalParameter = useCallback(debounce(setGlobalParameter, setParameterTimeout), []);

  const queryTimeOut = setTimeout(() => {
    debouncedQueryCallback && debouncedQueryCallback(query, { input: inputText, ...props.parameters }, setExtraRecords);
  }, 150);

  useEffect(() => {
    return () => clearTimeout(queryTimeOut);
  }, [inputText, query, props.parameters]);

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
  if (query && value != currentValue && currentValue != inputText) {
    setValue(currentValue);
    setInputText(value == defaultValue ? '' : currentValue);
    setExtraRecords([]);
  }

  const label = props.settings && props.settings.entityType ? props.settings.entityType : '';
  const property = props.settings && props.settings.propertyType ? props.settings.propertyType : '';
  const settings = props.settings ? props.settings : {};
  const { helperText, clearParameterOnFieldClear } = settings;

  if (!query || query.trim().length == 0) {
    return (
      <p style={{ margin: '15px' }}>
        No selection specified. Open up the report settings and choose a node label and property.
      </p>
    );
  }

  if (type == 'Free Text') {
    return (
      <FreeTextParameterSelectComponent
        helperText={helperText}
        label={label}
        property={property}
        defaultValue={defaultValue}
        value={value}
        clearParameterOnFieldClear={clearParameterOnFieldClear}
        setValue={setValue}
        currentValue={currentValue}
      />
    );
  } else if (type == 'Node Property') {
    return (
      <NodePropertyParameterSelectComponent
        query={query}
        extraRecords={extraRecords}
        inputText={setInputText}
        setInputText={setInputText}
        debouncedQueryCallback={debouncedQueryCallback}
        setExtraRecords={setExtraRecords}
        helperText={helperText}
        label={label}
        property={property}
        value={value}
        currentValue={currentValue}
        setValue={setValue}
        clearParameterOnFieldClear={clearParameterOnFieldClear}
        setGlobalParameter={setGlobalParameter}
        parameter={parameter}
        defaultValue={defaultValue}
      />
    );
  } else if (type == 'Relationship Property') {
    return <RelationshipPropertyParameterSelectComponent></RelationshipPropertyParameterSelectComponent>;
  }

  return <div>Invalid Type.</div>;
};

export default NeoParameterSelectionChart;
