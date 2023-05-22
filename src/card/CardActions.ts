/**
 * A list of actions to perform on cards.
 */

export const TOGGLE_CARD_SETTINGS = 'PAGE/CARD/TOGGLE_CARD_SETTINGS';
export const toggleCardSettings = (pagenumber: any, reportId: any, open: any) => ({
  type: TOGGLE_CARD_SETTINGS,
  payload: { pagenumber, reportId, open },
});

export const HARD_RESET_CARD_SETTINGS = 'PAGE/CARD/HARD_RESET_CARD_SETTINGS';
export const hardResetCardSettings = (pagenumber: any, reportId: any) => ({
  type: HARD_RESET_CARD_SETTINGS,
  payload: { pagenumber, reportId },
});

export const UPDATE_REPORT_TITLE = 'PAGE/CARD/UPDATE_REPORT_TITLE';
export const updateReportTitle = (pagenumber: number, reportId: number, title: any) => ({
  type: UPDATE_REPORT_TITLE,
  payload: { pagenumber, reportId, title },
});

export const UPDATE_REPORT_SIZE = 'PAGE/CARD/UPDATE_REPORT_SIZE';
export const updateReportSize = (pagenumber: number, reportId: number, width: any, height: any) => ({
  type: UPDATE_REPORT_SIZE,
  payload: { pagenumber, reportId, width, height },
});

export const UPDATE_REPORT_QUERY = 'PAGE/CARD/UPDATE_REPORT_QUERY';
export const updateReportQuery = (pagenumber: number, reportId: number, query: any) => ({
  type: UPDATE_REPORT_QUERY,
  payload: { pagenumber, reportId, query },
});

export const UPDATE_CYPHER_PARAMETERS = 'PAGE/CARD/UPDATE_CYPHER_PARAMETERS';
export const updateCypherParameters = (pagenumber: number, reportId: number, parameters: any) => ({
  type: UPDATE_CYPHER_PARAMETERS,
  payload: { pagenumber, reportId, parameters },
});

export const UPDATE_REPORT_TYPE = 'PAGE/CARD/UPDATE_REPORT_TYPE';
export const updateReportType = (pagenumber: number, reportId: number, type: any) => ({
  type: UPDATE_REPORT_TYPE,
  payload: { pagenumber, reportId, type },
});

export const UPDATE_FIELDS = 'PAGE/CARD/UPDATE_FIELDS';
export const updateFields = (pagenumber: number, reportId: number, fields: any) => ({
  type: UPDATE_FIELDS,
  payload: { pagenumber, reportId, fields },
});

export const UPDATE_SELECTION = 'PAGE/CARD/UPDATE_SELECTION';
export const updateSelection = (pagenumber: number, reportId: number, selectable: any, field: any) => ({
  type: UPDATE_SELECTION,
  payload: { pagenumber, reportId, selectable, field },
});

export const UPDATE_ALL_SELECTIONS = 'PAGE/CARD/UPDATE_ALL_SELECTIONS';
export const updateAllSelections = (pagenumber: number, reportId: number, selections: any) => ({
  type: UPDATE_ALL_SELECTIONS,
  payload: { pagenumber, reportId, selections },
});

export const CLEAR_SELECTION = 'PAGE/CARD/CLEAR_SELECTION';
export const clearSelection = (pagenumber: number, reportId: number) => ({
  type: CLEAR_SELECTION,
  payload: { pagenumber, reportId },
});

export const UPDATE_REPORT_SETTING = 'PAGE/CARD/UPDATE_REPORT_SETTING';
export const updateReportSetting = (pagenumber: number, reportId: number, setting: any, value: any) => ({
  type: UPDATE_REPORT_SETTING,
  payload: { pagenumber, reportId, setting, value },
});

export const TOGGLE_REPORT_SETTINGS = 'PAGE/CARD/TOGGLE_REPORT_SETTINGS';
export const toggleReportSettings = (reportId: any) => ({
  type: TOGGLE_REPORT_SETTINGS,
  payload: { reportId },
});

export const UPDATE_REPORT_DATABASE = 'PAGE/CARD/UPDATE_REPORT_DATABASE';
export const updateReportDatabase = (pagenumber: number, reportId: number, database: any) => ({
  type: UPDATE_REPORT_DATABASE,
  payload: { pagenumber, reportId, database },
});
