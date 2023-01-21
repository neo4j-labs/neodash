export const getDashboardTitle = (state: any) => state.dashboard.title;

export const getDashboardSettings = (state: any) => state.dashboard.settings;

export const getDashboardExtensions = (state: any) => {
  const { extensions } = state.dashboard;
  if (!extensions) {
    return {};
  }
  return extensions;
};

export const getPages = (state: any) => state.dashboard.pages;
