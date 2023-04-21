import { SELECTION_TYPES } from '../../config/CardConfig';
import { NODE_SIDEBAR_EXTENSION_NAME } from './stateManagement/AlertActions';

// TODO: define settings for extensions (just alert for now, keep it futureproof)
// TODO: understand if we want pagination (strange styling).
// TODO: Rename "alerts" to "node sidebar" (generic name).
const EXTENSIONS_CONFIG = {};
EXTENSIONS_CONFIG[NODE_SIDEBAR_EXTENSION_NAME] = {
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
    moveToPage: {
      label: 'When clicking the drill down button, the dashboard will set this page as the current one ',
      type: SELECTION_TYPES.LIST,
      values: [],
      default: 'Current Page',
      needsStateValues: true,
    },
  },
};

/**
 * Function to get the extension config
 * @param extensionName Name of the desired extension
 * @returns Predefined fields of configuration for an extension
 */
export function getNodeSidebarDefaultConfig() {
  return EXTENSIONS_CONFIG[NODE_SIDEBAR_EXTENSION_NAME] && EXTENSIONS_CONFIG[NODE_SIDEBAR_EXTENSION_NAME].settings
    ? EXTENSIONS_CONFIG[NODE_SIDEBAR_EXTENSION_NAME].settings
    : {};
}
