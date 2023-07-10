import { AggregationFunction } from '@neode/querybuilder';
import { ApocDirection, Condition } from '../constants';

const prefix = 'DASHBOARD/EXTENSIONS/QUERY_BUILDER/';

export const QUERY_BUILDER_ACTION_PREFIX = prefix;
export const queriesPrefix = `${prefix}QUERIES/`;
export const currentQueryPrefix = `${prefix}CURRENT_QUERY/`;

export type QueriesState = Query[];

export interface Query {
  loaded: boolean;
  updated: boolean;
  id?: string;
  name?: string;
  savedAt?: Date;

  selected?: string;
  nodes: TreeNode[];
  relationships: TreeRelationship[];
  predicates: TreePredicate[];
  output: TreeReturn[];
}

export interface TreeNode {
  id: string;
  label: string;
}

export interface TreeRelationship {
  id: string;
  from: string;
  to: string;
  type: string;
  direction: ApocDirection;
}

export interface TreePredicatePayload {
  alias: string;
  name: string;
  type: any;
  condition: Condition;
  negative?: boolean;
  value: any;
}

export interface TreePredicate extends TreePredicatePayload {
  id: string;
}

export interface TreeReturnPayload {
  alias: string;
  name: string;
  aggregate?: AggregationFunction;
  as?: string;
}

export interface TreeReturn extends TreeReturnPayload {
  id: string;
}

export const APP_INIT = 'APP_INIT';

export const ADD_QUERY = `${queriesPrefix}ADD_QUERY`;
export const UPDATE_QUERY = `${queriesPrefix}UPDATE_QUERY`;
export const DELETE_QUERY = `${queriesPrefix}DELETE_QUERY`;

/**
 * Init app
 */
export function init(queries: Query[]) {
  return {
    type: APP_INIT,
    payload: { queries },
  };
}

/**
 * Queries
 */
export function addQuery(name: string) {
  return {
    type: ADD_QUERY,
    payload: { name },
  };
}

export function deleteQuery(id: string) {
  return {
    type: DELETE_QUERY,
    payload: { id },
  };
}

export function updateQuery(payload: Query) {
  return {
    type: UPDATE_QUERY,
    payload,
  };
}

/**
 * Query Builder
 */

export const LOAD_QUERY_BY_ID = `${prefix}LOAD_QUERY_BY_ID`;
export const LOAD_QUERY = `${currentQueryPrefix}LOAD_QUERY`;
export const ADD_NODE = `${currentQueryPrefix}ADD_NODE`;
export const SELECT_NODE = `${currentQueryPrefix}SELECT_NODE`;
export const REMOVE_NODE = `${currentQueryPrefix}REMOVE_NODE`;
export const ADD_RELATIONSHIP = `${currentQueryPrefix}ADD_RELATIONSHIP`;
export const SELECT_RELATIONSHIP = `${currentQueryPrefix}SELECT_RELATIONSHIP`;
export const REMOVE_RELATIONSHIP = `${currentQueryPrefix}REMOVE_RELATIONSHIP`;
export const ADD_PREDICATE = `${currentQueryPrefix}ADD_PREDICATE`;
export const REMOVE_PREDICATE = `${currentQueryPrefix}REMOVE_PREDICATE`;
export const ADD_RETURN = `${currentQueryPrefix}ADD_RETURN`;
export const REMOVE_RETURN = `${currentQueryPrefix}REMOVE_RETURN`;

export const SET_NAME = `${currentQueryPrefix}SET_NAME`;

export function setName(name: string | undefined) {
  return {
    type: SET_NAME,
    payload: { name },
  };
}

export function loadQuery(payload) {
  return {
    type: LOAD_QUERY,
    payload,
  };
}

export function loadQueryById(id: string) {
  return {
    type: LOAD_QUERY_BY_ID,
    payload: { id },
  };
}

export function addNode(label: string) {
  return {
    type: ADD_NODE,
    payload: { label },
  };
}

export function selectNode(payload: string) {
  return {
    type: SELECT_NODE,
    payload,
  };
}

export function removeNode(id: string) {
  return {
    type: REMOVE_NODE,
    payload: { id },
  };
}

export function addRelationship(payload: TreeRelationship) {
  return {
    type: ADD_RELATIONSHIP,
    payload,
  };
}

export function selectRelationship(payload: string) {
  return {
    type: SELECT_RELATIONSHIP,
    payload,
  };
}

export function removeRelationship(id: string) {
  return {
    type: REMOVE_RELATIONSHIP,
    payload: { id },
  };
}

export function addPredicate(payload: TreePredicatePayload) {
  return {
    type: ADD_PREDICATE,
    payload,
  };
}

export function removePredicate(id: string) {
  return {
    type: REMOVE_PREDICATE,
    payload: { id },
  };
}

export function addReturn(payload: TreeReturnPayload) {
  return {
    type: ADD_RETURN,
    payload,
  };
}

export function removeReturn(id: string) {
  return {
    type: REMOVE_RETURN,
    payload: { id },
  };
}
