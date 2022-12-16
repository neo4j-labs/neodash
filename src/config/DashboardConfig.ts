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
  fullscreenEnabled: {
    label: 'Enable Fullscreen Report Views',
    type: SELECTION_TYPES.LIST,
    values: [true, false],
    default: true,
    helperText: "Show a 'fullscreen view' button for each report, letting users expand a visualization.",
  },
  downloadImageEnabled: {
    label: 'Enable Image Download',
    type: SELECTION_TYPES.LIST,
    values: [true, false],
    default: false,
    helperText:
      "Enables a 'download image' button for each report, letting users download a visualization as an image.",
  },
  queryTimeLimit: {
    label: 'Maximum Query Time (seconds)',
    type: SELECTION_TYPES.NUMBER,
    default: 20,
    helperText: 'The maximum time a report is allowed to run before automatically aborted.',
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
};
