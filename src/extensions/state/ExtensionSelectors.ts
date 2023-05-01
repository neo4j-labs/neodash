export const getExtensionActiveReducers = (state: any) => {
  return state.dashboard.extensionsConfig.activeReducers;
};

export const getExtensionSettings = (state: any, name: string) => {
  let res = state.dashboard.extensionsConfig[name];
  return res != undefined && res.settings ? res.settings : {};
};
