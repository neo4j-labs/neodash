import { SELECTION_TYPES } from './CardConfig';

export const customMinimizableConfig = {
  minimizable: {
    label: 'Minimize Button',
    type: SELECTION_TYPES.LIST,
    values: [true, false],
    default: false,
  },
};

export const customExecuteButtonConfig = {
  executeButtonName: {
    label: 'Execute Button Name',
    type: SELECTION_TYPES.TEXT,
    default: 'Execute',
  },
};

export const customOverrideDefaultMessage = {
  overrideDefaultMessage: {
    label: 'Override default message',
    type: SELECTION_TYPES.TEXT,
    default: 'Query returned no data.',
  },
};

export const customTableConfig = {
  ...customMinimizableConfig,
  hideQueryEditorInAutoRunOnMode: {
    label: 'Hide query editor on auto run on mode',
    type: SELECTION_TYPES.LIST,
    values: [true, false],
    default: false,
  },
  compactCanvas: {
    label: 'Compact canvas',
    type: SELECTION_TYPES.LIST,
    values: [true, false],
    default: true,
  },
  sendRequestButtonName: {
    label: 'Send Request Button Name',
    type: SELECTION_TYPES.TEXT,
    default: 'Send Request',
  },
  viewResponseButtonName: {
    label: 'View Response Button Name',
    type: SELECTION_TYPES.TEXT,
    default: 'View Response',
  },
};

export const customGraphConfig = {
  ...customMinimizableConfig,
  ...customExecuteButtonConfig,
  ...customOverrideDefaultMessage,
  hideQueryEditorInAutoRunOnMode: {
    label: 'Hide query editor on auto run on mode',
    type: SELECTION_TYPES.LIST,
    values: [true, false],
    default: false,
  },
  customTablePropertiesOfModal: {
    label: 'Customized Ordering and Hide Features Of Attributes In Detailed Modal',
    type: SELECTION_TYPES.DICTIONARY,
  },
  pageIdAndParameterName: {
    label: '<PageId>:<ParameterName>:<NodeType>',
    type: SELECTION_TYPES.TEXT,
  },
};

export const customCommonChartConfig = {
  ...customMinimizableConfig,
  ...customExecuteButtonConfig,
  hideQueryEditorInAutoRunOnMode: {
    label: 'Hide query editor on auto run on mode',
    type: SELECTION_TYPES.LIST,
    values: [true, false],
    default: false,
  },
};

export const customSelectCardConfig = {
  ...customMinimizableConfig,
  clearParameterValueOnTabChange: {
    label: 'Clear parameter value on tab change',
    type: SELECTION_TYPES.LIST,
    values: [true, false],
    default: false,
  },
  predefinedOptions: {
    label: 'Predefined Options, If type is Basic Select',
    type: SELECTION_TYPES.TEXT,
    default: null,
  },
};
