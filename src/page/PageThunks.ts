import { createNotification } from '../application/ApplicationActions';
import { CARD_INITIAL_STATE } from '../card/CardReducer';
import { createReport, removeReport, updateAllCardPositionsInPage } from './PageActions';

export const createNotificationThunk = (title: any, message: any) => (dispatch: any) => {
  dispatch(createNotification(title, message));
};

export const addReportThunk =
  (x: number, y: number, width: number, height: number, data: any) => (dispatch: any, getState: any) => {
    try {
      const initialState = data !== undefined ? data : CARD_INITIAL_STATE;
      const report = { ...initialState, x: x, y: y, width: width, height: height };
      const state = getState();
      const { pagenumber } = state.dashboard.settings;
      dispatch(createReport(pagenumber, report));
    } catch (e) {
      dispatch(createNotificationThunk('Cannot create report', e));
    }
  };

export const removeReportThunk = (index: number) => (dispatch: any, getState: any) => {
  try {
    const state = getState();
    const { pagenumber } = state.dashboard.settings;
    dispatch(removeReport(pagenumber, index));
  } catch (e) {
    dispatch(createNotificationThunk('Cannot remove report', e));
  }
};

export const cloneReportThunk = (index: number, x: number, y: number) => (dispatch: any, getState: any) => {
  try {
    const state = getState();
    const { pagenumber } = state.dashboard.settings;
    const data = { ...state.dashboard.pages[pagenumber].reports[index] };
    data.settingsOpen = false;
    dispatch(addReportThunk(x, y, data.width, data.height, data));
  } catch (e) {
    dispatch(createNotificationThunk('Cannot clone report', e));
  }
};

export const updatePageLayoutThunk = (layout: any) => (dispatch: any, getState: any) => {
  try {
    const { pagenumber } = getState().dashboard.settings;
    const cardPositions = layout.slice(0, layout.length - 1);
    dispatch(updateAllCardPositionsInPage(pagenumber, cardPositions));
  } catch (e) {
    dispatch(createNotificationThunk('Cannot update page layout', e));
  }
};
