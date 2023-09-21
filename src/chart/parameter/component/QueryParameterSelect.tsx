import React from 'react';
import NodePropertyParameterSelectComponent from './NodePropertyParameterSelect';
import { ParameterSelectProps } from './ParameterSelect';

const QueryParameterSelectComponent = (props: ParameterSelectProps) => {
  return (
    <NodePropertyParameterSelectComponent
      parameterName={props.parameterName}
      parameterDisplayName={props.parameterDisplayName}
      parameterValue={props.parameterValue}
      parameterDisplayValue={props.parameterDisplayValue}
      setParameterValue={props.setParameterValue}
      setParameterDisplayValue={props.setParameterDisplayValue}
      query={props.query}
      queryCallback={props.queryCallback}
      settings={props.settings}
      allParameters={props.allParameters}
      compatibilityMode={props.compatibilityMode}
      multiSelector={props.multiSelector}
    />
  );
};

export default QueryParameterSelectComponent;
