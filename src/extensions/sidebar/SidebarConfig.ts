import { SELECTION_TYPES } from '../../config/CardConfig';

// TODO: understand if we want pagination (strange styling).
const EXTENSIONS_CONFIG = {
  'node-sidebar': {
    settings: {
      colorProperty: {
        label: 'Card Color Property',
        type: SELECTION_TYPES.TEXT,
        default: 'color',
      },
      titleProperty: {
        label: 'Card title property name',
        type: SELECTION_TYPES.TEXT,
        default: 'title',
      },
      bodyProperty: {
        label: 'Card body property name',
        type: SELECTION_TYPES.TEXT,
        default: 'description',
      },
      maxRecords: {
        label: 'Maximum number of records',
        type: SELECTION_TYPES.NUMBER,
        default: 100,
      },
      refreshButtonEnabled: {
        label: 'Refreshable',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      resetParametersEnabled: {
        label: 'Enable Reset Parameters',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      drilldownEnabled: {
        label: 'Enable Drilldown',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      moveToPage: {
        label: 'Drilldown to Page',
        type: SELECTION_TYPES.LIST,
        values: [],
        default: 'Current Page',
        needsStateValues: true,
      },
    },
  },
};

/**
 * Function to get the extension config
 * @param extensionName Name of the desired extension
 * @returns Predefined fields of configuration for an extension
 */
export function getNodeSidebarDefaultConfig() {
  return EXTENSIONS_CONFIG['node-sidebar'] && EXTENSIONS_CONFIG['node-sidebar'].settings
    ? EXTENSIONS_CONFIG['node-sidebar'].settings
    : {};
}
