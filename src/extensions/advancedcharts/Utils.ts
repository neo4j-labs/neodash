import { valueIsArray } from '../../chart/ChartUtils';
import { useDispatch, useSelector } from 'react-redux';
import { getPageNumbersAndNames } from '../../dashboard/DashboardSelectors';
import { updateDashboardSetting } from '../../settings/SettingsActions';

export const getRule = (e, rules, type) => {
  let r = getRuleWithFieldPropertyName(e, rules, type, null);
  return r || null;
};

export const getRuleWithFieldPropertyName = (e, rules, type, fieldPropertyName) => {
  let f = fieldPropertyName == null ? 'field' : fieldPropertyName;
  let r = rules.filter((rule) => rule.condition && rule.condition == type && ruleFieldCheck(rule.field, e[f]));
  if (r.length == 0) {
    return null;
  }
  return r;
};

const ruleFieldCheck = (ruleValue, value) => {
  if (valueIsArray(value)) {
    return value.includes(ruleValue);
  }
  return value.trim() == ruleValue.trim();
};

export const unassign = (target, source) => {
  Object.keys(source).forEach((key) => {
    delete target[key];
  });
};

export const merge = (oldData, newData, operation) => {
  if (operation) {
    return Object.assign({}, newData, oldData);
  }
  unassign(oldData, newData);
  return oldData;
};

export const update = (state, mutations) => Object.assign({}, state, mutations);

function isCyclicUtil(i, visited, recStack, adj) {
  // Mark the current node as visited and
  // part of recursion stack
  if (recStack.get(i)) {
    return true;
  }

  if (visited.get(i)) {
    return false;
  }

  visited.set(i, true);
  recStack.set(i, true);

  let childrens = adj.get(i);

  for (const children in childrens) {
    if (isCyclicUtil(childrens[children], visited, recStack, adj)) {
      return true;
    }
  }

  recStack.set(i, false);

  return false;
}

export const isCyclic = (graph) => {
  let visited = new Map();
  let recStack = new Map();
  let adj = new Map();

  graph.nodes.forEach((node) => {
    visited.set(node.id, false);
    recStack.set(node.id, false);
    adj.set(node.id, []);
  });

  graph.links.forEach((link) => {
    adj.get(link.source).push(link.target);
  });

  for (const idx in graph.nodes) {
    if (isCyclicUtil(graph.nodes[idx].id, visited, recStack, adj)) {
      return true;
    }
  }

  return false;
};
