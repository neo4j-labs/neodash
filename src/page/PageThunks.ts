import { createNotification } from "../application/ApplicationActions";
import { toggleReportSettings } from "../card/CardActions";
import { CARD_INITIAL_STATE } from "../card/CardReducer";
import { updateReportSizeThunk } from "../card/CardThunks";
import {
    createReport, removeReport, shiftReportLeft, shiftReportRight
} from "./PageActions";


export const createNotificationThunk = (title:any, message: any) => (dispatch: any) => {
    dispatch(createNotification(title, message));
};

export const addReportRequest = (text: any) => (dispatch: any, getState: any) => {
    try {
        const report = CARD_INITIAL_STATE;
        const state = getState();
        const pagenumber = state.dashboard.settings.pagenumber;
        dispatch(createReport(pagenumber, report));
    } catch (e) {
        dispatch(createNotificationThunk("Cannot create report", e));
    }
}

export const removeReportRequest = (index: number) => (dispatch: any, getState: any) => {
    try {
        const state = getState();
        const pagenumber = state.dashboard.settings.pagenumber;
        dispatch(removeReport(pagenumber, index));
    } catch (e) {
        dispatch(createNotificationThunk("Cannot remove report", e));
    }
}
