import React, { useEffect } from 'react';
import { ChartProps } from '../Chart';
import DatePickerParameterSelectComponent from './component/DateParameterSelect';
import NodePropertyParameterSelectComponent from './component/NodePropertyParameterSelect';
import RelationshipPropertyParameterSelectComponent from './component/RelationshipPropertyParameterSelect';
import FreeTextParameterSelectComponent from './component/FreeTextParameterSelect';
import QueryParameterSelectComponent from './component/QueryParameterSelect';
import BasicSelectComponent from './component/BasicSelect';
import { createTheme, ThemeProvider } from '@mui/material/styles';

/**
 * A special chart type to define global dashboard parameters that are injected as query parameters into each report.
 */
export const NeoParameterSelectionChart = (props: ChartProps) => {
  const query = props.records[0].input ? props.records[0].input : undefined;
  const parameterName = props.settings && props.settings.parameterName ? props.settings.parameterName : undefined;
  const predefinedOptions = (props.settings && props.settings.predefinedOptions) || 'No Data';
  const parameterDisplayName = `${parameterName}_display`;
  const clearParameterValueOnTabChange = props.settings && props.settings.clearParameterValueOnTabChange;
  const type = props.settings && props.settings.type ? props.settings.type : undefined;
  const queryCallback = props.queryCallback ? props.queryCallback : () => {};
  const setGlobalParameter = props.setGlobalParameter ? props.setGlobalParameter : () => {};
  const parameterValue =
    props.getGlobalParameter && props.getGlobalParameter(parameterName) ? props.getGlobalParameter(parameterName) : '';
  const parameterDisplayValue =
    props.getGlobalParameter &&
    props.getGlobalParameter(parameterDisplayName) &&
    props.settings.overridePropertyDisplayName
      ? props.getGlobalParameter(parameterDisplayName)
      : parameterValue;
  const setParameterValue = (value) => setGlobalParameter(parameterName, value);
  const setParameterDisplayValue = (value) => setGlobalParameter(parameterDisplayName, value);
  const allParameters = props.parameters;
  const multiSelector = props?.settings?.multiSelector;
  const manualParameterSave = props?.settings?.manualParameterSave;
  // in NeoDash 2.2.1 or earlier, there was no means to have a different display value in the selector. This condition handles that.
  const compatibilityMode = !query?.toLowerCase().includes('as display') || false;

  // When Component unmounts based on clearParameterValueOnTabChange parameter value is set to empty.
  // clearParameterValueOnTabChange can be configured in settings
  useEffect(() => {
    return () => {
      if (clearParameterValueOnTabChange) {
        setGlobalParameter(parameterName, '');
      }
    };
  }, []);

  if (!query || query.trim().length == 0) {
    return <p style={{ margin: '15px' }}>No selection specified.</p>;
  }

  const theme = createTheme({
    typography: {
      fontFamily: "'Nunito Sans', sans-serif !important",
      allVariants: { color: 'rgb(var(--palette-neutral-text))' },
    },
    palette: {
      text: {
        primary: 'rgb(var(--palette-neutral-text))',
      },
      background: {
        paper: 'rgb(var(--palette-neutral-bg-weak))',
      },
    },
  });

  const content = () => {
    if (type == 'Free Text') {
      return (
        <FreeTextParameterSelectComponent
          parameterName={parameterName}
          parameterDisplayName={parameterName}
          parameterValue={parameterValue}
          parameterDisplayValue={parameterDisplayValue}
          setParameterValue={setParameterValue}
          setParameterDisplayValue={setParameterDisplayValue}
          query={query}
          queryCallback={queryCallback}
          settings={props.settings}
          allParameters={allParameters}
          compatibilityMode={compatibilityMode}
          manualParameterSave={manualParameterSave}
        />
      );
    } else if (type == 'Node Property') {
      return (
        <NodePropertyParameterSelectComponent
          parameterName={parameterName}
          parameterDisplayName={parameterName}
          parameterValue={parameterValue}
          parameterDisplayValue={parameterDisplayValue}
          setParameterValue={setParameterValue}
          setParameterDisplayValue={setParameterDisplayValue}
          query={query}
          queryCallback={queryCallback}
          settings={props.settings}
          allParameters={allParameters}
          compatibilityMode={compatibilityMode}
          multiSelector={multiSelector}
          manualParameterSave={manualParameterSave}
        />
      );
    } else if (type == 'Relationship Property') {
      return (
        <RelationshipPropertyParameterSelectComponent
          parameterName={parameterName}
          parameterDisplayName={parameterName}
          parameterValue={parameterValue}
          parameterDisplayValue={parameterDisplayValue}
          setParameterValue={setParameterValue}
          setParameterDisplayValue={setParameterDisplayValue}
          query={query}
          queryCallback={queryCallback}
          settings={props.settings}
          allParameters={allParameters}
          compatibilityMode={compatibilityMode}
          multiSelector={multiSelector}
          manualParameterSave={manualParameterSave}
        />
      );
    } else if (type == 'Date Picker') {
      return (
        <DatePickerParameterSelectComponent
          parameterName={parameterName}
          parameterDisplayName={parameterName}
          parameterValue={parameterValue}
          parameterDisplayValue={parameterDisplayValue}
          setParameterValue={setParameterValue}
          setParameterDisplayValue={setParameterDisplayValue}
          query={query}
          queryCallback={queryCallback}
          settings={props.settings}
          allParameters={allParameters}
          compatibilityMode={compatibilityMode}
          manualParameterSave={manualParameterSave}
        />
      );
    } else if (type == 'Custom Query') {
      return (
        <QueryParameterSelectComponent
          parameterName={parameterName}
          parameterDisplayName={parameterName}
          parameterValue={parameterValue}
          parameterDisplayValue={parameterDisplayValue}
          setParameterValue={setParameterValue}
          setParameterDisplayValue={setParameterDisplayValue}
          query={query}
          queryCallback={queryCallback}
          settings={props.settings}
          allParameters={allParameters}
          compatibilityMode={compatibilityMode}
          multiSelector={multiSelector}
          manualParameterSave={manualParameterSave}
        />
      );
    } else if (type === 'Basic Select') {
      return (
        <BasicSelectComponent
          parameterName={parameterName}
          parameterDisplayName={parameterName}
          parameterValue={parameterValue}
          parameterDisplayValue={parameterDisplayValue}
          setParameterValue={setParameterValue}
          setParameterDisplayValue={setParameterDisplayValue}
          query={query}
          queryCallback={queryCallback}
          settings={props.settings}
          predefinedOptions={predefinedOptions}
          allParameters={allParameters}
          compatibilityMode={compatibilityMode}
          multiSelector={multiSelector}
          manualParameterSave={manualParameterSave}
        />
      );
    }
    return <div>Invalid Parameter Selector Type.</div>;
  };
  return <ThemeProvider theme={theme}>{content()}</ThemeProvider>;
};

export default NeoParameterSelectionChart;
