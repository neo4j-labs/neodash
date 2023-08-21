import React from 'react';
import { SELECTION_TYPES } from '../../config/CardConfig';
import DatePickerParameterSelectComponent from './date/DateParameterSelect';
import { objectMap, update } from './Utils';

let SELECTORS_REPORT_TYPES = {
  datePicker: {
    label: 'Date picker',
    component: DatePickerParameterSelectComponent,
    helperText: <div>Pickkkkk.</div>,
    maxRecords: 1,
    selection: {
      value: {
        label: 'Value',
        type: SELECTION_TYPES.NUMBER,
        key: true,
      },
    },
    withoutFooter: true,
    settings: {},
  },
};

export const COMMON_SELECTOR_SETTINGS = {
  backgroundColor: {
    label: 'Background Color',
    type: SELECTION_TYPES.COLOR,
    default: '#fafafa',
  },
  manualParameterSave: {
    label: 'Manual Parameter Save',
    type: SELECTION_TYPES.LIST,
    values: [true, false],
    default: false,
  },
  defaultValue: {
    label: 'Default Value (Override)',
    type: SELECTION_TYPES.TEXT,
    default: '',
  },
  clearParameterOnFieldClear: {
    label: 'Clear Parameter on Field Reset',
    type: SELECTION_TYPES.LIST,
    values: [true, false],
    default: false,
  },
  helperText: {
    label: 'Helper Text (Override)',
    type: SELECTION_TYPES.TEXT,
    default: 'Enter a custom helper text here...',
  },
  description: {
    label: 'Selector Description',
    type: SELECTION_TYPES.MULTILINE_TEXT,
    default: 'Enter markdown here...',
  },
};

export const SELECTORS_TYPES = objectMap(SELECTORS_REPORT_TYPES, (value) => {
  return update(value, { settings: COMMON_SELECTOR_SETTINGS });
});
