import { valueIsArray } from '../../chart/ChartUtils';

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

export const getPageFromPageNames = (pageNames, ruleValue) => {
  let page = pageNames.filter((pageNew)=> pageNew.split('/')[1] == ruleValue.split('/')[1]);
  if (page.length == 1)
    return page[0];

  page = pageNames.filter((pageNew)=> pageNew == ruleValue);

  if (page.length == 1)
    return page[0];

  return null;
};

export const actionRule = (rule, e, props, type = 'default') => {
  if (rule !== null ) {
    if(rule.customization == 'set variable' && props && props.setGlobalParameter){
      // call thunk for $neodash_customizationValue
      let rValue = rule.value == 'id' ? 'id ' : rule.value;
      if (rValue != '' && e.row && e.row[rValue]) {
        props.setGlobalParameter(`neodash_${rule.customizationValue}`, e.row[rule.value]);
      } else if (rule.value != '' && e.properties && e.properties[rule.value]) {
        props.setGlobalParameter(`neodash_${rule.customizationValue}`, e.properties[rule.value]);
      } else {
        props.setGlobalParameter(`neodash_${rule.customizationValue}`, e.value);
      }
    } else if(rule.customization == 'set page' && props.setPage && props.pageNames){
      let page = getPageFromPageNames(props.pageNames, rule.value);
      if(page)
        props.setPage(page.split('/')[0]);
    }
  }
}

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

// Function to manually compute curvatures for dense node pairs.
export function getCurvature(index, total) {
  if (total <= 6) {
    // Precomputed edge curvatures for nodes with multiple edges in between.
    const curvatures = {
      0: 0,
      1: 0,
      2: [-0.5, 0.5], // 2 = Math.floor(1/2) + 1
      3: [-0.5, 0, 0.5], // 2 = Math.floor(3/2) + 1
      4: [-0.66666, -0.33333, 0.33333, 0.66666], // 3 = Math.floor(4/2) + 1
      5: [-0.66666, -0.33333, 0, 0.33333, 0.66666], // 3 = Math.floor(5/2) + 1
      6: [-0.75, -0.5, -0.25, 0.25, 0.5, 0.75], // 4 = Math.floor(6/2) + 1
      7: [-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75], // 4 = Math.floor(7/2) + 1
    };
    return curvatures[total][index];
  }
  const arr1 = [...Array(Math.floor(total / 2)).keys()].map((i) => {
    return (i + 1) / (Math.floor(total / 2) + 1);
  });
  const arr2 = total % 2 == 1 ? [0] : [];
  const arr3 = [...Array(Math.floor(total / 2)).keys()].map((i) => {
    return (i + 1) / -(Math.floor(total / 2) + 1);
  });
  return arr1.concat(arr2).concat(arr3)[index];
}

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
