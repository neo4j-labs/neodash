import React from 'react';
import { DatePicker } from '@neo4j-ndl/react';

const NeoDatePicker = ({ label, value, onChange }) => {
  return (
    <DatePicker
      reactDatePickerProps={{
        onChange: (event) => {
          onChange(event);
        },
        open: undefined,
        dateFormat: 'yyyy-MM-dd',
        maxDate: new Date('9999-12-31'),
        popperProps: {
          strategy: 'fixed',
        },
        selected: new Date(value),
      }}
      textInputProps={{
        label: label,
      }}
    />
  );
};

export default NeoDatePicker;
