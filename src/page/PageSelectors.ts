import { createSelector } from 'reselect';
export const getReports = (state: any) => {
  const { pagenumber } = state.dashboard.settings;
  return state.dashboard.pages[pagenumber].reports;
};
export const getReportsLoading = (state: any) => state.dashboard.isLoading;

// TODO: Investigate to define what is the expected behavior => current filter is useless
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getCurrentReports = createSelector(getReports, (reports) => reports.filter((report) => true));
