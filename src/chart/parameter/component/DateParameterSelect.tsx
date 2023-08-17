import React, { useEffect } from 'react';
import { ParameterSelectProps } from './ParameterSelect';
import NeoDatePicker from '../../../component/field/DateField';
import { Date as Neo4jDate } from 'neo4j-driver-core/lib/temporal-types.js';
import { isCastableToNeo4jDate, isEmptyObject } from '../../ChartUtils';

function castPropsToBoltDate(dict) {
  if (isEmptyObject(dict)) {
    return undefined;
  }
  return new Neo4jDate(dict.year, dict.month, dict.day);
}

function castPropsToJsDate(dict) {
  if (isEmptyObject(dict)) {
    return new Date();
  }
  return new Date(dict.year, dict.month - 1, dict.day);
}

const DatePickerParameterSelectComponent = (props: ParameterSelectProps) => {
  const defaultValue =
    props.settings && props.settings.defaultValue && props.settings.defaultValue.length > 0
      ? props.settings.defaultValue
      : new Date();

  const [inputDate, setInputDate] = React.useState(castPropsToJsDate(props.parameterValue));
  const label = props.settings && props.settings.entityType ? props.settings.entityType : '';
  const helperText = props.settings && props.settings.helperText ? props.settings.helperText : '';
  const clearParameterOnFieldClear =
    props.settings && props.settings.clearParameterOnFieldClear ? props.settings.clearParameterOnFieldClear : false;
  const setParameterValue = (value) => {
    props.setParameterValue(castPropsToBoltDate(value));
  };
  //
  useEffect(() => {
    setInputDate(castPropsToJsDate(props.parameterValue));
  }, [props.parameterValue]);

  // If the user hasn't typed, and the parameter value mismatches the input value --> it was changed externally --> refresh the input value.
  if (
    inputDate &&
    isCastableToNeo4jDate(inputDate) &&
    inputDate.getTime() != castPropsToJsDate(props.parameterValue).getTime()
  ) {
    setInputDate(castPropsToJsDate(props.parameterValue));
  }

  return (
    <div style={{ width: '100%' }}>
      <NeoDatePicker
        label={helperText ? helperText : label}
        value={inputDate}
        onChange={(newValue) => {
          setInputDate(newValue);

          // Check whether the user has inputted a valid year. If not, do not update the parameter.
          if (!newValue || isNaN(newValue.getFullYear()) || isNaN(newValue.getMonth()) || isNaN(newValue.getDay())) {
            return;
          }
          if (newValue == null && clearParameterOnFieldClear) {
            setParameterValue(Neo4jDate.fromStandardDate(defaultValue.toDate()));
          } else if (newValue == null) {
            setParameterValue(undefined);
          } else if (Object.prototype.toString.call(newValue) === '[object Date]') {
            setParameterValue(Neo4jDate.fromStandardDate(newValue));
          }
        }}
      />
    </div>
  );
};

export default DatePickerParameterSelectComponent;
