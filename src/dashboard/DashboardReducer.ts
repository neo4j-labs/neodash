/**
 * Reducers define changes to the application state when a given action
 */

import { DEFAULT_DASHBOARD_TITLE } from '../config/ApplicationConfig';
import { extensionsReducer, INITIAL_EXTENSIONS_STATE } from '../extensions/state/ExtensionReducer';
import { PAGE_EXAMPLE_STATE, pageReducer, PAGE_EMPTY_STATE } from '../page/PageReducer';
import { settingsReducer, SETTINGS_INITIAL_STATE } from '../settings/SettingsReducer';

import {
  CREATE_PAGE,
  REMOVE_PAGE,
  SET_DASHBOARD_TITLE,
  RESET_DASHBOARD_STATE,
  SET_DASHBOARD,
  MOVE_PAGE,
  SET_EXTENSION_ENABLED,
  SET_DASHBOARD_UUID,
} from './DashboardActions';

export const NEODASH_VERSION = '2.4';
export const VERSION_TO_MIGRATE = {
  '1.1': '2.0',
  '2.0': '2.1',
  '2.1': '2.2',
  '2.2': '2.3',
  '2.3': '2.4',
};

export const initialState = {
  title: DEFAULT_DASHBOARD_TITLE,
  version: NEODASH_VERSION,
  settings: SETTINGS_INITIAL_STATE,
  pages: [PAGE_EXAMPLE_STATE],
  parameters: {},
  extensions: INITIAL_EXTENSIONS_STATE,
};

export const emptyDashboardState = {
  title: DEFAULT_DASHBOARD_TITLE,
  version: NEODASH_VERSION,
  settings: SETTINGS_INITIAL_STATE,
  pages: [PAGE_EMPTY_STATE],
  parameters: {},
  extensions: INITIAL_EXTENSIONS_STATE,
};

const update = (state, mutations) => Object.assign({}, state, mutations);

export const dashboardReducer = (state = initialState, action: { type: any; payload: any }) => {
  const { type, payload } = action;

  // Page-specific updates are deferred to the page reducer.
  if (action.type.startsWith('PAGE/')) {
    const { pagenumber = state.settings.pagenumber } = payload;
    return {
      ...state,
      pages: [
        ...state.pages.slice(0, pagenumber),
        pageReducer(state.pages[pagenumber], action),
        ...state.pages.slice(pagenumber + 1),
      ],
    };
  }

  // Settings-specific updates are deferred to the settings reducer.
  if (action.type.startsWith('SETTINGS/')) {
    const enrichedPayload = update(payload, { dashboard: state });
    const enrichedAction = { type, payload: enrichedPayload };
    return {
      ...state,
      settings: settingsReducer(state, enrichedAction),
    };
  }

  // Extensions-specific updates are deferred to the extensions reducer.
  if (action.type.startsWith('DASHBOARD/EXTENSIONS')) {
    return {
      ...state,
      extensions: extensionsReducer(state.extensions, action),
    };
  }

  // Global dashboard updates are handled here.
  switch (type) {
    case RESET_DASHBOARD_STATE: {
      return { ...emptyDashboardState };
    }
    case SET_DASHBOARD: {
      const { dashboard } = payload;
      return { ...dashboard };
    }
    case SET_DASHBOARD_UUID: {
      const { uuid } = payload;
      return { uuid: uuid, ...state };
    }
    case SET_DASHBOARD_TITLE: {
      const { title } = payload;
      return { ...state, title: title };
    }
    case SET_EXTENSION_ENABLED: {
      const { name, enabled } = payload;
      const extensions = state.extensions ? { ...state.extensions } : {};
      // If the extension was enabled before, remember the old settings and toggle the 'active' switch.
      extensions[name] = extensions[name] == undefined ? { active: enabled } : { ...extensions[name], active: enabled };
      return { ...state, extensions: extensions };
    }
    case CREATE_PAGE: {
      return { ...state, pages: [...state.pages, PAGE_EMPTY_STATE] };
    }
    case REMOVE_PAGE: {
      // Removes the card at a given index on a selected page number.
      const { number } = payload;
      const pagesInFront = state.pages.slice(0, number);
      const pagesBehind = state.pages.slice(number + 1);

      return {
        ...state,
        pages: pagesInFront.concat(pagesBehind),
      };
    }
    case MOVE_PAGE: {
      // Moves a page from a given index to a new index.
      const { oldIndex, newIndex } = payload;

      const element = state.pages.splice(oldIndex, 1)[0];
      state.pages.splice(newIndex, 0, element);

      return {
        ...state,
        pages: state.pages,
      };
    }
    default: {
      return state;
    }
  }
};
