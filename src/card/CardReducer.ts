import {
  CLEAR_SELECTION,
  HARD_RESET_CARD_SETTINGS,
  TOGGLE_REPORT_SETTINGS,
  UPDATE_ALL_SELECTIONS,
  UPDATE_CYPHER_PARAMETERS,
  UPDATE_FIELDS,
  UPDATE_REPORT_QUERY,
  UPDATE_REPORT_REFRESH_RATE,
  UPDATE_REPORT_SETTING,
  UPDATE_REPORT_SIZE,
  UPDATE_REPORT_TITLE,
  UPDATE_REPORT_TYPE,
  UPDATE_SELECTION,
  UPDATE_REPORT_DATABASE,
} from './CardActions';
import { TOGGLE_CARD_SETTINGS } from './CardActions';

const update = (state, mutations) => Object.assign({}, state, mutations);

/**
 * State reducers for a single card instance as part of a report.
 */

export const CARD_INITIAL_STATE = {
  title: '',
  query: '\n\n\n',
  settingsOpen: false,
  advancedSettingsOpen: false,
  width: 3,
  height: 3,
  x: 0,
  y: 0,
  type: 'table',
  fields: [],
  selection: {},
  settings: {},
  collapseTimeout: 'auto',
};

export const cardReducer = (state = CARD_INITIAL_STATE, action: { type: any; payload: any }) => {
  const { type, payload } = action;

  if (!action.type.startsWith('PAGE/CARD/')) {
    return state;
  }

  switch (type) {
    case UPDATE_REPORT_TITLE: {
      const { title } = payload;
      state = update(state, { title: title });
      return state;
    }
    case UPDATE_REPORT_SIZE: {
      const { width, height } = payload;
      state = update(state, { width: width, height: height });
      return state;
    }
    case UPDATE_REPORT_QUERY: {
      const { query } = payload;
      state = update(state, { query: query });
      return state;
    }
    case UPDATE_REPORT_REFRESH_RATE: {
      const { rate } = payload;

      state = update(state, { refreshRate: rate });
      return state;
    }
    case UPDATE_CYPHER_PARAMETERS: {
      const { parameters } = payload;
      state = update(state, { parameters: parameters });
      return state;
    }
    case UPDATE_FIELDS: {
      const { fields } = payload;
      state = update(state, { fields: fields });
      return state;
    }
    case UPDATE_REPORT_TYPE: {
      const { type } = payload;
      state = update(state, { type: type });
      return state;
    }
    case CLEAR_SELECTION: {
      state = update(state, { selection: {} });
      return state;
    }
    case UPDATE_SELECTION: {
      const { selectable, field } = payload;
      const selection = state.selection ? state.selection : {};

      const entry = {};
      entry[selectable] = field;
      state = update(state, { selection: update(selection, entry) });
      return state;
    }

    case UPDATE_ALL_SELECTIONS: {
      const { selections } = payload;
      state = update(state, { selection: selections });
      return state;
    }

    case UPDATE_REPORT_SETTING: {
      const { setting, value } = payload;
      const settings = state.settings ? state.settings : {};

      // Javascript is amazing, so "" == 0. Instead we check if the string length is zero...
      if (value == undefined || value.toString().length == 0) {
        delete settings[setting];
        update(state, { settings: settings });
        return state;
      }

      const entry = {};
      entry[setting] = value;
      state = update(state, { settings: update(settings, entry) });
      return state;
    }
    case TOGGLE_CARD_SETTINGS: {
      const { open } = payload;
      state = update(state, { settingsOpen: open, collapseTimeout: 'auto' });
      return state;
    }
    case HARD_RESET_CARD_SETTINGS: {
      state = update(state, { settingsOpen: false, collapseTimeout: 0 });
      return state;
    }
    case TOGGLE_REPORT_SETTINGS: {
      state = update(state, { advancedSettingsOpen: !state.advancedSettingsOpen });
      return state;
    }
    case UPDATE_REPORT_DATABASE: {
      const { database } = payload;
      state = update(state, { database: database });
      return state;
    }
    default: {
      return state;
    }
  }
};

export default cardReducer;
