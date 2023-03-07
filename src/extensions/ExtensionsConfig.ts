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
        label: 'Name of the property that will be used as title of the card',
        type: SELECTION_TYPES.TEXT,
        default: 'title',
      },
      bodyProperty: {
        label: 'Name of the property that will be used as body of the card',
        type: SELECTION_TYPES.TEXT,
        default: 'description',
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
