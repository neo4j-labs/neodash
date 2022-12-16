import cardReducer from '../card/CardReducer';
import {
  CREATE_REPORT,
  REMOVE_REPORT,
  SET_PAGE_TITLE,
  FORCE_REFRESH_PAGE,
  UPDATE_ALL_CARD_POSITIONS_IN_PAGE,
} from './PageActions';

const update = (state, mutations) => Object.assign({}, state, mutations);

// TODO : Alfredo: this should source the card config defined inside the reducer and then define the first page initial state
export const FIRST_PAGE_INITIAL_STATE = {
  title: 'Main Page',
  reports: [
    {
      title: 'Hi there 👋',
      query:
        '**This is your first dashboard!** \n \nYou can click (⋮) to edit this report, or add a new report to get started. You can run any Cypher query directly from each report and render data in a variety of formats. \n \nTip: try _renaming_ this report by editing the title text. You can also edit the dashboard header at the top of the screen.\n\n\n',
      width: 3,
      height: 2,
      x: 0,
      y: 0,
      type: 'text',
      selection: {},
      settings: {},
    },
    {
      title: '',
      query: 'MATCH (n)-[e]->(m) RETURN n,e,m LIMIT 20\n\n\n',
      width: 3,
      height: 2,
      x: 3,
      y: 0,
      type: 'graph',
      selection: {},
      settings: {},
    },
  ],
};

export const PAGE_INITIAL_STATE = {
  title: '',
  reports: [],
};

/**
 * Reducers define changes to the application state when a given action.
 * This reducer handles updates to a single page of the dashboard.
 * TODO - pagenumbers can be cut from here with new reducer architecture.
 */
export const pageReducer = (state = PAGE_INITIAL_STATE, action: { type: any; payload: any }) => {
  const { type, payload } = action;

  if (!action.type.startsWith('PAGE/')) {
    return state;
  }
  // Updates a report at a given page and index.
  if (action.type.startsWith('PAGE/CARD/')) {
    const { index } = payload;
    return {
      ...state,
      reports: [
        ...state.reports.slice(0, index),
        cardReducer(state.reports[index], action),
        ...state.reports.slice(index + 1),
      ],
    };
  }

  // Else, deal with page-level operations.
  switch (type) {
    case CREATE_REPORT: {
      // Adds a new card at the end of the page with selected page number.
      const { report } = payload;
      return {
        ...state,
        reports: state.reports.concat(report),
      };
    }
    case REMOVE_REPORT: {
      // Removes the card at a given index on a selected page number.
      const { index } = payload;
      const cardsInFront = state.reports.slice(0, index);
      const cardsBehind = state.reports.slice(index + 1);

      // if there's card after the removed card, it will take it's place.
      // We make sure that the transition is disabled in this case.
      if (cardsBehind.length > 0) {
        // @ts-ignore
        cardsBehind[0].collapseTimeout = 0;
      }
      return {
        ...state,
        reports: cardsInFront.concat(cardsBehind),
      };
    }
    case UPDATE_ALL_CARD_POSITIONS_IN_PAGE: {
      // Updates the layout for the entire page (all positions of all cards in that page).
      const { positions } = payload;
      const newReports = state.reports.map((report: object, index) => {
        return {
          ...report,
          x: positions[index].x,
          y: positions[index].y,
          width: positions[index].w,
          height: positions[index].h,
        };
      });
      return {
        ...state,
        reports: newReports,
      };
    }
    case SET_PAGE_TITLE: {
      // Moves a card right (swaps it with the next card)
      const { title } = payload;
      return {
        ...state,
        title: title,
      };
    }
    case FORCE_REFRESH_PAGE: {
      // We force a page refresh by resetting the field set for each report. (workaround)
      return {
        ...state,
        reports: state.reports.map((report) => update(report, { fields: report.fields.concat(['']) })),
      };
    }
    default: {
      return state;
    }
  }
};
