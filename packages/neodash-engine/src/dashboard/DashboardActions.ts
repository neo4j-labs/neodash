export const RESET_DASHBOARD_STATE = 'DASHBOARD/RESET_DASHBOARD_STATE';
export const resetDashboardState = () => ({
  type: RESET_DASHBOARD_STATE,
  payload: {},
});

export const SET_DASHBOARD = 'DASHBOARD/SET_DASHBOARD';
export const setDashboard = (dashboard: any) => ({
  type: SET_DASHBOARD,
  payload: { dashboard },
});

export const SET_DASHBOARD_TITLE = 'DASHBOARD/SET_DASHBOARD_TITLE';
export const setDashboardTitle = (title: any) => ({
  type: SET_DASHBOARD_TITLE,
  payload: { title },
});

export const CREATE_PAGE = 'DASHBOARD/CREATE_PAGE';
export const addPage = () => ({
  type: CREATE_PAGE,
  payload: {},
});

export const REMOVE_PAGE = 'DASHBOARD/REMOVE_PAGE';
export const removePage = (number: any) => ({
  type: REMOVE_PAGE,
  payload: { number },
});

export const MOVE_PAGE = 'DASHBOARD/MOVE_PAGE';
export const movePage = (oldIndex: any, newIndex: any) => ({
  type: MOVE_PAGE,
  payload: { oldIndex, newIndex },
});

export const SET_EXTENSION_ENABLED = 'DASHBOARD/SET_EXTENSION_ENABLED';
export const setExtensionEnabled = (name: string, enabled: boolean) => ({
  type: SET_EXTENSION_ENABLED,
  payload: { name, enabled },
});
