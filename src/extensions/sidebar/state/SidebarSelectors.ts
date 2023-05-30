// TODO - perhaps we can guarantee creation or something... lets think some more to avoid this check.

import { getGlobalParameters, getSessionParameters } from '../../../settings/SettingsSelectors';

export const NODE_SIDEBAR_PARAM_PREFIX = 'neodash_node_sidebar_';
export const getSidebarOpened = (state: any) => {
  let res = state.dashboard.extensions && state.dashboard.extensions['node-sidebar'];
  return res != undefined && res.opened ? res.opened : false;
};

export const getSidebarQuery = (state: any) => {
  let res = state.dashboard.extensions && state.dashboard.extensions['node-sidebar'];
  return res != undefined && res.query ? res.query : '\n\n\n\n';
};

export const getSidebarDatabase = (state: any) => {
  let res = state.dashboard.extensions && state.dashboard.extensions['node-sidebar'];
  return res != undefined && res.database ? res.database : '';
};

export const getSidebarTitle = (state: any) => {
  let res = state.dashboard.extensions && state.dashboard.extensions['node-sidebar'];
  return res != undefined && res.title ? res.title : '';
};

export const getSidebarGlobalParameters = (state: any) => {
  let globalParameters = Object.keys({ ...getGlobalParameters(state), ...getSessionParameters(state) });
  return globalParameters.filter((elem) => elem.startsWith(NODE_SIDEBAR_PARAM_PREFIX));
};
