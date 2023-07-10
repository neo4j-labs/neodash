import {
  ADD_NODE,
  ADD_PREDICATE,
  ADD_RELATIONSHIP,
  ADD_RETURN,
  LOAD_QUERY,
  LOAD_QUERY_BY_ID,
  Query,
  REMOVE_NODE,
  REMOVE_PREDICATE,
  REMOVE_RELATIONSHIP,
  REMOVE_RETURN,
  SELECT_NODE,
  SELECT_RELATIONSHIP,
  SET_NAME,
} from '../QueryBuilderActions';

import { currentQueryPrefix } from '../QueryBuilderActions';

const prefix = currentQueryPrefix;

const initialState: Query = {
  updated: false,
  loaded: false,
  nodes: [],
  relationships: [],
  predicates: [],
  output: [],
};

function removeRelationshipFromTree(id: string, state: Query): Query {
  const toRemove = state.relationships.find((rel) => rel.id === id);

  // Remove the end node of this relationship
  if (toRemove) {
    state = removeNodeFromTree(toRemove!.to, state);
  }

  // Remove the relationship from the state
  state.relationships = state.relationships.filter((rel) => rel.id !== id);

  // Remove predicates
  state.predicates = state.predicates.filter((p) => p.alias !== id);

  // Remove Return
  state.output = state.output.filter((p) => p.alias !== id);

  // Reset selected
  state.selected = undefined;

  return state;
}

function removeNodeFromTree(id: string, state: Query): Query {
  const atStart = state.relationships.filter((row) => row.from === id);

  // If node is at the start, remove all relationships further down the chain
  // eslint-disable-next-line
  atStart.map((rel) => {
    state = removeNodeFromTree(rel.to, state);
  });

  // Remove relationships where the node is at the end
  state.relationships = state.relationships.filter((row) => row.to !== id);

  // Remove the node from the node tree
  state.nodes = state.nodes.filter((node) => node.id !== id);

  // Remove predicates
  state.predicates = state.predicates.filter((p) => p.alias !== id);

  // Remove Return
  state.output = state.output.filter((p) => p.alias !== id);

  // Reset selected
  state.selected = undefined;

  return state;
}

export default function currentQueryReducer(state: Query = initialState, action: Record<string, any>): Query {
  state.updated = false;

  switch (action.type) {
    case LOAD_QUERY:
      return action.payload as Query;

    case SET_NAME:
      return {
        ...state,
        name: action.payload.name,
      };

    case ADD_NODE:
      return {
        ...state,
        nodes: state.nodes.slice(0).concat({ ...action.payload, id: `n${state.nodes.length + 1}` }),
      };

    case REMOVE_NODE:
      return removeNodeFromTree(action.payload.id, state);

    case ADD_RELATIONSHIP: {
      const to = `n${state.nodes.length + 1}`;

      return {
        ...state,
        nodes: state.nodes.slice(0).concat({ label: action.payload.label, id: to }),
        relationships: state.relationships
          .slice(0)
          .concat({ ...action.payload, to, id: `r${state.relationships.length + 1}` }),
      };
    }

    case REMOVE_RELATIONSHIP:
      return removeRelationshipFromTree(action.payload.id, state);

    case SELECT_NODE:
    case SELECT_RELATIONSHIP:
      return {
        ...state,
        selected: action.payload,
      };

    case ADD_PREDICATE:
      return {
        ...state,
        predicates: state.predicates.slice(0).concat({ ...action.payload, id: `p${state.predicates.length + 1}` }),
      };

    case REMOVE_PREDICATE:
      return {
        ...state,
        predicates: state.predicates.slice(0).filter((p) => p.id !== action.payload.id),
      };

    case ADD_RETURN:
      return {
        ...state,
        output: state.output.slice(0).concat({ ...action.payload, id: `o${state.output.length + 1}` }),
      };

    case REMOVE_RETURN:
      return {
        ...state,
        output: state.output.slice(0).filter((p) => p.id !== action.payload.id),
      };

    default:
      return state;
  }
}
