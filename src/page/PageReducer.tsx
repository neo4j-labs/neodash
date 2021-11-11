import { updateReportSize, UPDATE_REPORT_SIZE } from '../card/CardActions';
import cardReducer from '../card/CardReducer';
import {
    CREATE_REPORT,
    REMOVE_REPORT,
    SHIFT_REPORT_LEFT,
    SHIFT_REPORT_RIGHT,
    SET_PAGE_TITLE,
    FORCE_REFRESH_PAGE
} from './PageActions';

const update = (state, mutations) =>
    Object.assign({}, state, mutations)

export const FIRST_PAGE_INITIAL_STATE = {
    "title": "Main Page",
    "reports": []
}

export const PAGE_INITIAL_STATE = {
    "title": "",
    "reports": []
}

/**
 * Swaps two elements in the reports array.
 */
function swapTwoCardsInPage(cards, fromIndex, toIndex) {
    // If the indices are the same, just return the same array.
    if (fromIndex === toIndex) {
        return cards;
    }
    cards.splice(fromIndex, 1, cards.splice(toIndex, 1, cards[fromIndex])[0]);

    // We make sure that the transition is temporarily disabled for both cards.
    cards[fromIndex].collapseTimeout = 0
    cards[toIndex].collapseTimeout = 0

    return cards;
}

/**
 * Reducers define changes to the application state when a given action.
 * This reducer handles updates to a single page of the dashboard.
 * TODO - pagenumbers can be cut from here with new reducer architecture.
 */
export const pageReducer = (state = PAGE_INITIAL_STATE, action: { type: any; payload: any; }) => {
    const { type, payload } = action;

    if (!action.type.startsWith('PAGE/')) {
        return state;
    }
    // Updates a report at a given page and index.
    if (action.type.startsWith('PAGE/CARD/')) {
        const { pagenumber, index, report } = payload;
        return {
            ...state,
            reports: [
                ...state.reports.slice(0, index),
                cardReducer(state.reports[index], action),
                ...state.reports.slice(index + 1)
            ]
        }
    }

    // Else, deal with page-level operations.
    switch (type) {
        case CREATE_REPORT: {
            // Adds a new card at the end of the page with selected page number.
            const { pagenumber, report } = payload;
            return {
                ...state,
                reports: state.reports.concat(report)
            }
        }
        case REMOVE_REPORT: {
            // Removes the card at a given index on a selected page number. 
            const { pagenumber, index } = payload;
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
                reports: cardsInFront.concat(cardsBehind)
            }
        }
        case SHIFT_REPORT_LEFT: {
            // Moves a card left (swaps it with the previous card)
            const { pagenumber, index } = payload;

            return {
                ...state,
                reports: swapTwoCardsInPage(state.reports, index, Math.max(0, index - 1))
            }
        }
        case SHIFT_REPORT_RIGHT: {
            // Moves a card right (swaps it with the next card)
            const { pagenumber, index } = payload;
            return {
                ...state,
                reports: swapTwoCardsInPage(state.reports, index, Math.min(state.reports.length - 1, index + 1))
            }
        }
        case SET_PAGE_TITLE: {
            // Moves a card right (swaps it with the next card)
            const { pagenumber, title } = payload;
            return {
                ...state,
                title: title
            }
        }
        case FORCE_REFRESH_PAGE: {
            // We force a page refresh by resetting the field set for each report. (workaround)
            const { pagenumber } = payload;
            return {
                ...state,
                reports: state.reports.map(report => update(report, {fields: report.fields.concat([""])}))
            }
        }
        default: {
            return state;
        }
    }
}