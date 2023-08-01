/**
 * A list of actions to perform on cards.
 */

export const TOGGLE_CARD_SETTINGS = 'PAGE/CARD/TOGGLE_CARD_SETTINGS';
export const toggleCardSettings = (pagenumber: any, id: any, open: any) => ({
  type: TOGGLE_CARD_SETTINGS,
  payload: { pagenumber, id, open },
});

export const HARD_RESET_CARD_SETTINGS = 'PAGE/CARD/HARD_RESET_CARD_SETTINGS';
export const hardResetCardSettings = (pagenumber: any, id: any) => ({
  type: HARD_RESET_CARD_SETTINGS,
  payload: { pagenumber, id },
});

export const UPDATE_REPORT_TITLE = 'PAGE/CARD/UPDATE_REPORT_TITLE';
export const updateReportTitle = (pagenumber: number, id: number, title: any) => ({
  type: UPDATE_REPORT_TITLE,
  payload: { pagenumber, id, title },
});

export const UPDATE_REPORT_SIZE = 'PAGE/CARD/UPDATE_REPORT_SIZE';
export const updateReportSize = (pagenumber: number, id: number, width: any, height: any) => ({
  type: UPDATE_REPORT_SIZE,
  payload: { pagenumber, id, width, height },
});

export const UPDATE_REPORT_QUERY = 'PAGE/CARD/UPDATE_REPORT_QUERY';
export const updateReportQuery = (pagenumber: number, id: number, query: any) => ({
  type: UPDATE_REPORT_QUERY,
  payload: { pagenumber, id, query },
});

export const UPDATE_CYPHER_PARAMETERS = 'PAGE/CARD/UPDATE_CYPHER_PARAMETERS';
export const updateCypherParameters = (pagenumber: number, id: number, parameters: any) => ({
  type: UPDATE_CYPHER_PARAMETERS,
  payload: { pagenumber, id, parameters },
});

export const UPDATE_REPORT_TYPE = 'PAGE/CARD/UPDATE_REPORT_TYPE';
export const updateReportType = (pagenumber: number, id: number, type: any) => ({
  type: UPDATE_REPORT_TYPE,
  payload: { pagenumber, id, type },
});

export const UPDATE_FIELDS = 'PAGE/CARD/UPDATE_FIELDS';
export const updateFields = (pagenumber: number, id: number, fields: any) => ({
  type: UPDATE_FIELDS,
  payload: { pagenumber, id, fields },
});

export const UPDATE_SCHEMA = 'PAGE/CARD/UPDATE_SCHEMA';
export const updateSchema = (pagenumber: number, id: number, schema: any) => ({
  type: UPDATE_SCHEMA,
  payload: { pagenumber, id, schema },
});

export const UPDATE_SELECTION = 'PAGE/CARD/UPDATE_SELECTION';
export const updateSelection = (pagenumber: number, id: number, selectable: any, field: any) => ({
  type: UPDATE_SELECTION,
  payload: { pagenumber, id, selectable, field },
});

export const UPDATE_ALL_SELECTIONS = 'PAGE/CARD/UPDATE_ALL_SELECTIONS';
export const updateAllSelections = (pagenumber: number, id: number, selections: any) => ({
  type: UPDATE_ALL_SELECTIONS,
  payload: { pagenumber, id, selections },
});

export const CLEAR_SELECTION = 'PAGE/CARD/CLEAR_SELECTION';
export const clearSelection = (pagenumber: number, id: number) => ({
  type: CLEAR_SELECTION,
  payload: { pagenumber, id },
});

export const UPDATE_REPORT_SETTING = 'PAGE/CARD/UPDATE_REPORT_SETTING';
export const updateReportSetting = (pagenumber: number, id: number, setting: any, value: any) => ({
  type: UPDATE_REPORT_SETTING,
  payload: { pagenumber, id, setting, value },
});

export const TOGGLE_REPORT_SETTINGS = 'PAGE/CARD/TOGGLE_REPORT_SETTINGS';
export const toggleReportSettings = (id: any) => ({
  type: TOGGLE_REPORT_SETTINGS,
  payload: { id },
});

export const UPDATE_REPORT_DATABASE = 'PAGE/CARD/UPDATE_REPORT_DATABASE';
export const updateReportDatabase = (pagenumber: number, id: number, database: any) => ({
  type: UPDATE_REPORT_DATABASE,
  payload: { pagenumber, id, database },
});
