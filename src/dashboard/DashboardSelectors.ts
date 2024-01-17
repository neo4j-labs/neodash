export const getDashboardUuid = (state: any) => state.dashboard.uuid;

export const getDashboardTitle = (state: any) => state.dashboard.title;

export const getDashboardSettings = (state: any) => state.dashboard.settings;

export const getDashboardTheme = (state: any) => state?.dashboard?.settings?.theme ?? 'light';

export const getDashboardExtensions = (state: any) => {
  const { extensions } = state.dashboard;
  if (!extensions) {
    return {};
  }

  return Object.fromEntries(Object.entries(extensions).filter(([_, v]) => v.active));
};

export const getPages = (state: any) => state.dashboard.pages;

export const getPageNumbersAndNames = (state: any) => {
  let pageNames = state.dashboard.pages.reduce((acc, page, idx) => {
    acc.push(`${idx}/${page.title}`);
    return acc;
  }, []);
  return pageNames;
};
