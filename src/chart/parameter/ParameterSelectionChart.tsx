import React from 'react';
import { ChartProps } from '../Chart';
import FreeTextParameterSelectComponent from './component/FreeTextParameterSelect';
import NodePropertyParameterSelectComponent from './component/NodePropertyParameterSelect';
import RelationshipPropertyParameterSelectComponent from './component/RelationshipPropertyParameterSelect';

/**
 * A special chart type to define global dashboard parameters that are injected as query parameters into each report.
 */
export const NeoParameterSelectionChart = (props: ChartProps) => {
  const query = props.records[0].input ? props.records[0].input : undefined;
  const parameterName = props.settings && props.settings.parameterName ? props.settings.parameterName : undefined;
  const type = props.settings && props.settings.type ? props.settings.type : undefined;
  const queryCallback = props.queryCallback ? props.queryCallback : () => {};
  const setGlobalParameter = props.setGlobalParameter ? props.setGlobalParameter : () => {};
  const parameterValue =
    props.getGlobalParameter && props.getGlobalParameter(parameterName) ? props.getGlobalParameter(parameterName) : '';
  const setParameterValue = (value) => setGlobalParameter(parameterName, value);
  const allParameters = props.parameters;

  if (!query || query.trim().length == 0) {
    return <p style={{ margin: '15px' }}>No selection specified.</p>;
  }

  if (type == 'Free Text') {
    return (
      <FreeTextParameterSelectComponent
        parameterName={parameterName}
        parameterValue={parameterValue}
        setParameterValue={setParameterValue}
        query={query}
        queryCallback={queryCallback}
        settings={props.settings}
        allParameters={allParameters}
      />
    );
  } else if (type == 'Node Property') {
    return (
      <NodePropertyParameterSelectComponent
        parameterName={parameterName}
        parameterValue={parameterValue}
        setParameterValue={setParameterValue}
        query={query}
        queryCallback={queryCallback}
        settings={props.settings}
        allParameters={allParameters}
      />
    );
  } else if (type == 'Relationship Property') {
    return (
      <RelationshipPropertyParameterSelectComponent
        parameterName={parameterName}
        parameterValue={parameterValue}
        setParameterValue={setParameterValue}
        query={query}
        queryCallback={queryCallback}
        settings={props.settings}
        allParameters={allParameters}
      />
    );
  }

  return <div>Invalid Parameter Selector Type.</div>;
};

export default NeoParameterSelectionChart;
