// TODO - perhaps we can guarantee creation or something... lets think some more to avoid this check.

import { getGlobalParameters, getSessionParameters } from '../../../settings/SettingsSelectors';

const name = 'query-builder';
const prefix = 'neodash_query_builder_';
export const QUERY_BUILDER_PARAM_PREFIX = prefix;
export const getQueryBuilderOpened = (state: any) => {
  let res = state.dashboard.extensions && state.dashboard.extensions[name];
  return res != undefined && res.opened ? res.opened : false;
};

export const getQueryBuilderQueries = (state: any) => {
  let res = state.dashboard.extensions && state.dashboard.extensions[name];
  return res != undefined && res.queries ? res.queries : [];
};

export const getQueryBuilderQuery = (state: any, id: string) => {
  let res = state.dashboard.extensions && state.dashboard.extensions[name];
  return res != undefined && res.queries ? res.queries.find((query) => query.id === id) : null;
};

export const getCurrentQuery = (state: any) => {
  let res = state.dashboard.extensions && state.dashboard.extensions[name];
  return res != undefined && res.query ? res.query : {};
};

export const getQueryBuilderGlobalParameters = (state: any) => {
  let globalParameters = Object.keys({ ...getGlobalParameters(state), ...getSessionParameters(state) });
  return globalParameters.filter((elem) => elem.startsWith(prefix));
};
