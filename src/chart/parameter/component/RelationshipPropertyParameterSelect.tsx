import React from 'react';
import NodePropertyParameterSelectComponent from './NodePropertyParameterSelect';
import { ParameterSelectProps } from './ParameterSelect';

/**
 * At the moment relationship property selectors are identical to node property selectors.
 * Therefore, just return the node component.
 */
const RelationshipPropertyParameterSelectComponent = (props: ParameterSelectProps) => {
  return (
    <NodePropertyParameterSelectComponent
      parameterName={props.parameterName}
      parameterValue={props.parameterValue}
      setParameterValue={props.setParameterValue}
      query={props.query}
      queryCallback={props.queryCallback}
      settings={props.settings}
      allParameters={props.allParameters}
    />
  );
};

export default RelationshipPropertyParameterSelectComponent;
