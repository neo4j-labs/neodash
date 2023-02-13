import React, { useCallback, useEffect } from 'react';
import { ParameterSelectProps } from './ParameterSelect';
import NeoDatePicker from '../../../component/field/DateField';
import dayjs, { Dayjs } from 'dayjs';
import { Date as Neo4jDate } from 'neo4j-driver-core/lib/temporal-types.js';
import { isEmptyObject } from '../../ChartUtils';

function castPropsToBoltDate(dict) {
  if (isEmptyObject(dict)) {
    return undefined;
  }
  return new Neo4jDate(dict.year, dict.month, dict.day);
}

function castPropsToJsDate(dict) {
  if (isEmptyObject(dict)) {
    return dayjs();
  }
  let x = dayjs(new Date(dict.year, dict.month - 1, dict.day));
  return x;
}

const DatePickerParameterSelectComponent = (props: ParameterSelectProps) => {
  const setParameterTimeout =
    props.settings && props.settings.setParameterTimeout ? props.settings.setParameterTimeout : 1000;
  const defaultValue =
    props.settings && props.settings.defaultValue && props.settings.defaultValue.length > 0
      ? props.settings.defaultValue
      : dayjs();

  const [inputDate, setInputDate] = React.useState(castPropsToJsDate(props.parameterValue));
  const label = props.settings && props.settings.entityType ? props.settings.entityType : '';
  const property = props.settings && props.settings.propertyType ? props.settings.propertyType : '';
  const helperText = props.settings && props.settings.helperText ? props.settings.helperText : '';
  const clearParameterOnFieldClear =
    props.settings && props.settings.clearParameterOnFieldClear ? props.settings.clearParameterOnFieldClear : false;
  const setParameterValue = (value) => {
    props.setParameterValue(castPropsToBoltDate(value));
  };

  useEffect(() => {
    setParameterValue(Neo4jDate.fromStandardDate(inputDate.toDate()));
  }, []);
  // If the user hasn't typed, and the parameter value mismatches the input value --> it was changed externally --> refresh the input value.
  if (!inputDate.isSame(castPropsToJsDate(props.parameterValue))) {
    setInputDate(castPropsToJsDate(props.parameterValue));
  }

  return (
    <div style={{ width: '155px', marginBottom: '10px', marginRight: '10px', marginLeft: '10px' }}>
      <NeoDatePicker
        label={label}
        value={inputDate}
        onChange={(newValue) => {
          setInputDate(newValue);
          if (newValue == null && clearParameterOnFieldClear) {
            setParameterValue(Neo4jDate.fromStandardDate(defaultValue.toDate()));
          } else {
            setParameterValue(Neo4jDate.fromStandardDate(newValue.toDate()));
          }
        }}
      />
    </div>
  );
};

export default DatePickerParameterSelectComponent;
