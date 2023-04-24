import { SELECTION_TYPES } from './CardConfig';

export const DASHBOARD_SETTINGS = {
  editable: {
    label: 'Editable',
    type: SELECTION_TYPES.LIST,
    values: [true, false],
    default: true,
    helperText:
      'This controls whether users can edit your dashboard. Disable this to turn the dashboard into presentation mode.',
  },
  queryTimeLimit: {
    label: 'Maximum Query Time (seconds)',
    type: SELECTION_TYPES.NUMBER,
    default: 20,
    helperText: 'The maximum time a report is allowed to run before automatically aborted.',
  },
  downloadImageEnabled: {
    label: 'Enable Image Download',
    type: SELECTION_TYPES.LIST,
    values: [true, false],
    default: false,
    helperText: 'Shows a button in the dashboard header that lets users capture their dashboard as an image.',
  },
  disableRowLimiting: {
    label: 'Disable Row Limiting ⚠️',
    type: SELECTION_TYPES.LIST,
    values: [true, false],
    default: false,
    helperText:
      'This disables the automatic row limiting feature. When disabled, always ensure your queries are not returning too many rows.',
  },
  resizing: {
    label: 'Resize Mode',
    type: SELECTION_TYPES.LIST,
    values: ['bottom-right', 'all'],
    default: 'bottom-right',
    helperText: 'These are the resize handle options shared across all reports. ',
  },
  darkLuma: {
    label: 'Luma Threshold',
    type: SELECTION_TYPES.NUMBER,
    default: 25,
    helperText: 'Background colors under this threshold will be considered as dark',
  },
  pagenumber: {
    label: 'Page Number',
    type: SELECTION_TYPES.NUMBER,
    disabled: true,
    helperText: 'This is the number of the currently selected page.',
  },
  parameters: {
    label: 'Global Parameters',
    type: SELECTION_TYPES.DICTIONARY,
    disabled: true,
    helperText:
      "These are the query parameters shared across all reports. You can set these using a 'property select' report.",
  },
  extensions: {
    label: 'Extensions',
    type: SELECTION_TYPES.LIST,
    multiple: true,
    values: ['actions'],
    default: false,
    hidden: true,
  },
};
