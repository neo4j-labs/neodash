// TODO - define interface
export const WORKFLOW_STEPS = {
  shortestPath: {
    name: "Yen's Shortest Path",
    key: 'shortestPath',
    type: 'Pathfinding',
    description:
      "Yen's Shortest Path algorithm computes a number of shortest paths between two nodes. The algorithm is often referred to as Yen's k-Shortest Path algorithm, where k is the number of shortest paths to compute. The algorithm supports weighted graphs with positive relationship weights.",
    query: 'RETURN false',
  },
  pageRank: {
    name: 'PageRank',
    key: 'pageRank',
    type: 'Centrality',
    description:
      'The PageRank algorithm measures the importance of each node within the graph, based on the number incoming relationships and the importance of the corresponding source nodes. The underlying assumption roughly speaking is that a page is only as important as the pages that link to it.',
    query: 'UNWIND RANGE(1,10000) as X \n WITH X as Quack \n RETURN collect(Quack)',
  },
};
