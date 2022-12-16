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
