export const getExtensionSettings = (state: any, name: string) => {
  let res = state.dashboard.extensionsConfig[name];
  return res != undefined ? res : {};
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
