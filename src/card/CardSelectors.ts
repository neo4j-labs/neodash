export const getDashboardTitle = (state: any) => state.dashboard.title;

export const getReportState = (state: any, index: any) => {
  const { pagenumber } = state.dashboard.settings;
  return state.dashboard.pages[pagenumber].reports[index];
};
