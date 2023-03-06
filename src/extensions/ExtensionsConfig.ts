import { SELECTION_TYPES } from '../config/CardConfig';

// TODO: define settings for extensions (just alert for now, keep it futureproof)
// TODO: understand if we want pagination (strange styling)
export const EXTENSIONS_CONFIG = {
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
