/**
 * Reducers define changes to the application state when a given action
 */

import { FIRST_PAGE_INITIAL_STATE, pageReducer, PAGE_INITIAL_STATE } from '../page/PageReducer';
import { settingsReducer, SETTINGS_INITIAL_STATE } from '../settings/SettingsReducer';
import { CREATE_PAGE, REMOVE_PAGE, SET_DASHBOARD_TITLE, RESET_DASHBOARD_STATE, SET_DASHBOARD, MOVE_PAGE, SET_EXTENSION_ENABLED } from './DashboardActions';

export const NEODASH_VERSION = "2.2";

export const initialState = {
    title: "",
    version: NEODASH_VERSION,
    settings: SETTINGS_INITIAL_STATE,
    pages: [FIRST_PAGE_INITIAL_STATE],
    parameters: {},
    extensions: {},
}


const update = (state, mutations) =>
    Object.assign({}, state, mutations)



export const dashboardReducer = (state = initialState, action: { type: any; payload: any; }) => {
    const { type, payload } = action;



    // Page-specific updates are deferred to the page reducer.
    if (action.type.startsWith('PAGE/')) {
        const { pagenumber = state.settings.pagenumber } = payload;
        return {
            ...state,
            pages: [
                ...state.pages.slice(0, pagenumber),
                pageReducer(state.pages[pagenumber], action),
                ...state.pages.slice(pagenumber + 1)
            ]
        }
    }
    case SET_DASHBOARD: {
      const { dashboard } = payload;
      return { ...dashboard };
    }
    case SET_DASHBOARD_TITLE: {
      const { title } = payload;
      return { ...state, title: title };
    }
    case CREATE_PAGE: {
      return { ...state, pages: [...state.pages, PAGE_INITIAL_STATE] };
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

    // Global dashboard updates are handled here.
    switch (type) {
        case RESET_DASHBOARD_STATE: {
            return { ...initialState }
        }
        case SET_DASHBOARD: {
            const { dashboard } = payload;
            return { ...dashboard }
        }
        case SET_DASHBOARD_TITLE: {
            const { title } = payload;
            return { ...state, title: title }
        }
        case SET_EXTENSION_ENABLED: {
            const { name, enabled } = payload;
            const extensions = state.extensions ? {...state.extensions} : {};
            extensions[name] = enabled;
            return { ...state, extensions: extensions};
        }
        case CREATE_PAGE: {
            return { ...state, pages: [...state.pages, PAGE_INITIAL_STATE] }
        }
        case REMOVE_PAGE: {
            // Removes the card at a given index on a selected page number. 
            const { number } = payload;
            const pagesInFront = state.pages.slice(0, number);
            const pagesBehind = state.pages.slice(number + 1);

            return {
                ...state,
                pages: pagesInFront.concat(pagesBehind)
            }
        }
        case MOVE_PAGE: {
            // Moves a page from a given index to a new index.
            const { oldIndex, newIndex } = payload;

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
