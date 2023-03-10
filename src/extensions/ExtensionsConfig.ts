import { SELECTION_TYPES } from '../config/CardConfig';

// TODO: define settings for extensions (just alert for now, keep it futureproof)
// TODO: understand if we want pagination (strange styling)
const EXTENSIONS_CONFIG = {
  alerts: {
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
    },
  },
};

/**
 * Function to get the extension config
 * @param extensionName Name of the desired extension
 * @returns Predefined fields of configuration for an extension
 */
export function getExtensionDefaultConfig(extensionName) {
  return EXTENSIONS_CONFIG[extensionName] && EXTENSIONS_CONFIG[extensionName].settings
    ? EXTENSIONS_CONFIG[extensionName].settings
    : {};
}
