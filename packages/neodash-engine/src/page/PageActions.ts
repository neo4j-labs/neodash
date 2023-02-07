export const CREATE_REPORT = 'PAGE/CREATE_REPORT';
export const createReport = (pagenumber: number, report: any) => ({
  type: CREATE_REPORT,
  payload: { pagenumber, report },
});

export const REMOVE_REPORT = 'PAGE/REMOVE_REPORT';
export const removeReport = (pagenumber: number, index: any) => ({
  type: REMOVE_REPORT,
  payload: { pagenumber, index },
});

export const UPDATE_ALL_CARD_POSITIONS_IN_PAGE = 'PAGE/UPDATE_ALL_CARD_POSITIONS_IN_PAGE';
export const updateAllCardPositionsInPage = (pagenumber: number, positions: any) => ({
  type: UPDATE_ALL_CARD_POSITIONS_IN_PAGE,
  payload: { pagenumber, positions },
});

export const SET_PAGE_TITLE = 'PAGE/SET_TITLE';
export const setPageTitle = (pagenumber: number, title: any) => ({
  type: SET_PAGE_TITLE,
  payload: { pagenumber, title },
});

export const FORCE_REFRESH_PAGE = 'PAGE/FORCE_REFRESH_PAGE';
export const forceRefreshPage = (pagenumber: number) => ({
  type: FORCE_REFRESH_PAGE,
  payload: { pagenumber },
});
