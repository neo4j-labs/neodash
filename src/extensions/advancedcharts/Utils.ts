import { valueIsArray } from '../../chart/ChartUtils';
import { useSelector } from 'react-redux';
import { getPageNumbersAndNames } from '../../dashboard/DashboardSelectors';

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
  // if the field is unspecified, always return true
  if (ruleValue == '') {
    return true;
  }
  if (valueIsArray(value)) {
    return value.includes(ruleValue);
  }
  return value.trim() == ruleValue.trim();
};

/**
 * Returns a list of pairs, where each pair represents a page number and a name.
 */
export const getPageNumbersAndNamesList = () => {
  return useSelector(getPageNumbersAndNames);
};

/**
 * Get the relevant page for a specific action rule.
 */
export const getPageFromPageNames = (pageNames, ruleValue) => {
  // TODO - handle renames and reorders automatically by updating the action logic.
  let page = pageNames.filter((pageNew) => pageNew.split('/')[1] == ruleValue.split('/')[1]);
  if (page.length == 1) {
    return page[0];
  }
  page = pageNames.filter((pageNew) => pageNew == ruleValue);
  if (page.length == 1) {
    return page[0];
  }
  return null;
};

/**
 *
 * @param rule  - an action rule as specified by the user {"condition", "field", "value",  "customization", "customizationValue"}
 * @param e - element to execute the rule on.
 * @param props - ReportProps object to get callback from to update the state.
 * @param type - type of rule, currently unused.
 */
export const executeActionRule = (rule, e, props, _type = 'default') => {
  if (rule !== null) {
    if (rule.customization == 'set variable' && props && props.setGlobalParameter) {
      // call thunk for $neodash_customizationValue
      let rValue = rule.value == 'id' ? 'id ' : rule.value;
      if (rValue != '' && e.row && e.row[rValue]) {
        props.setGlobalParameter(`neodash_${rule.customizationValue}`, e.row[rule.value]);
      } else if (rule.value != '' && e.properties && e.properties[rule.value]) {
        props.setGlobalParameter(`neodash_${rule.customizationValue}`, e.properties[rule.value]);
      } else {
        props.setGlobalParameter(`neodash_${rule.customizationValue}`, e.value);
      }
    } else if (rule.customization == 'set page' && props.setPageNumber && props.pageNames) {
      let page = getPageFromPageNames(props.pageNames, rule.value);
      if (page) {
        props.setPageNumber(page.split('/')[0]);
      } else {
        props.setPageNumber(undefined);
      }
    }
  }
};

/**
 * Evaluates and runs actions based on an element based on the rule set defined in the settings.
 * @param e - the element --> should be a dictionary with two entries {field, value}, the category and the attached value.
 * @param actionsRules - the list of rules.
 * @param props - ChartProps object with callbacks to execute rule.
 * @param action - the type of action to perform.
 * @param type - the rule type.
 */
export const performActionOnElement = (e: { field; value }, actionsRules, props, action, type = 'default') => {
  let rules = getRule(e, actionsRules, action);
  if (rules !== null) {
    rules.forEach((rule) => executeActionRule(rule, e, props, type));
  }
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
