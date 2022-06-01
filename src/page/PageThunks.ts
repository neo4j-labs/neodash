import { createNotification } from "../application/ApplicationActions";
import { CARD_INITIAL_STATE } from "../card/CardReducer";
import { createReport, removeReport, cloneReport,updateAllCardPositionsInPage } from "./PageActions";


export const createNotificationThunk = (title: any, message: any) => (dispatch: any) => {
    dispatch(createNotification(title, message));
};

export const addReportThunk = (x: number, y: number, width: number, height: number) => (dispatch: any, getState: any) => {
    try {
        const report = {...CARD_INITIAL_STATE, x: x, y: y, width: width, height: height};
        const state = getState();
        const pagenumber = state.dashboard.settings.pagenumber;
        dispatch(createReport(pagenumber, report));
    } catch (e) {
        dispatch(createNotificationThunk("Cannot create report", e));
    }
}

export const removeReportThunk = (index: number) => (dispatch: any, getState: any) => {
    try {
        const state = getState();
        const pagenumber = state.dashboard.settings.pagenumber;
        dispatch(removeReport(pagenumber, index));
    } catch (e) {
        dispatch(createNotificationThunk("Cannot remove report", e));
    }
}

export const cloneReportThunk = (index: number) => (dispatch: any, getState: any) => {
    try {
        const state = getState();
        const pagenumber = state.dashboard.settings.pagenumber;
        dispatch(cloneReport(pagenumber, index));
    } catch (e) {
        dispatch(createNotificationThunk("Cannot remove report", e));
    }
}

export const updatePageLayoutThunk = (layout: any) => (dispatch: any, getState: any) => {
    try {
        const pagenumber = getState().dashboard.settings.pagenumber;
        const cardPositions = layout.slice(0, layout.length - 1);
        dispatch(updateAllCardPositionsInPage(pagenumber, cardPositions));
    } catch (e) {
        dispatch(createNotificationThunk("Cannot update page layout", e));
    }
}