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

export const getPageNumbersAndNames = (state: any) => {
  let pageNames = state.dashboard.pages.reduce((acc, page, idx) => {
    acc.push(`${idx}/${page.title}`);
    return acc;
  }, []);
  return pageNames;
};
