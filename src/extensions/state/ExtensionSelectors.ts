export const getExtensionActiveReducers = (state: any) => {
  return state.dashboard.extensions && state.dashboard.extensions.activeReducers;
};

export const getExtensionSettings = (state: any, name: string) => {
  let res = state.dashboard.extensions && state.dashboard.extensions[name];
  return res != undefined && res.settings ? res.settings : {};
};
