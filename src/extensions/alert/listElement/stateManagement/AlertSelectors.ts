// TODO - perhaps we can guarantee creation or something... lets think some more to avoid this check.

import { NODE_SIDEBAR_EXTENSION_NAME } from './AlertActions';

export const getSidebarOpened = (state: any) => {
  let res = state.dashboard.extensionsConfig[NODE_SIDEBAR_EXTENSION_NAME];
  return res != undefined && res.opened ? res.opened : false;
};

export const getSidebarQuery = (state: any) => {
  let res = state.dashboard.extensionsConfig[NODE_SIDEBAR_EXTENSION_NAME];
  return res != undefined && res.query ? res.query : '\n\n\n\n';
};

export const getSidebarDatabase = (state: any) => {
  let res = state.dashboard.extensionsConfig[NODE_SIDEBAR_EXTENSION_NAME];
  return res != undefined && res.database ? res.database : '';
};

export const getSidebarTitle = (state: any) => {
  let res = state.dashboard.extensionsConfig[NODE_SIDEBAR_EXTENSION_NAME];
  return res != undefined && res.title ? res.title : '';
};
