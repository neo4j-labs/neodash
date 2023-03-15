// TODO - perhaps we can guarantee creation or something... lets think some more to avoid this check.
export const getExtensionSettings = (state: any, name: string) => {
  let res = state.dashboard.extensionsConfig[name];
  return res != undefined && res.settings ? res.settings : {};
};

export const getExtensionOpened = (state: any, name: string) => {
  let res = state.dashboard.extensionsConfig[name];
  return res != undefined && res.opened ? res.opened : false;
};

export const getExtensionQuery = (state: any, name: string) => {
  let res = state.dashboard.extensionsConfig[name];
  return res != undefined && res.query ? res.query : '\n\n\n\n';
};

export const getExtensionDatabase = (state: any, name: string) => {
  let res = state.dashboard.extensionsConfig[name];
  return res != undefined && res.database ? res.database : '';
};

export const getExtensionTitle = (state: any, name: string) => {
  let res = state.dashboard.extensionsConfig[name];
  return res != undefined && res.title ? res.title : '';
};
