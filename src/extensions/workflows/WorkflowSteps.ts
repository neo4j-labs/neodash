// TODO - define interface
export const WORKFLOW_STEPS = {
  shortestPath: {
    name: "Yen's Shortest Path",
    key: 'shortestPath',
    type: 'Pathfinding',
    description:
      "Yen's Shortest Path algorithm computes a number of shortest paths between two nodes. The algorithm is often referred to as Yen's k-Shortest Path algorithm, where k is the number of shortest paths to compute. The algorithm supports weighted graphs with positive relationship weights.",
    query: 'UNWIND RANGE(1,10000) as X \n WITH X as Quack2 \n RETURN collect(Quack2)',
  },
  pageRank: {
    name: 'PageRank',
    key: 'pageRank',
    type: 'Centrality',
    description:
      'The PageRank algorithm measures the importance of each node within the graph, based on the number incoming relationships and the importance of the corresponding source nodes. The underlying assumption roughly speaking is that a page is only as important as the pages that link to it.',
    query: 'UNWIND RANGE(1,10000) as X \n WITH X as Quack \n RETURN collect(Quack)',
  },
  longQuery: {
    name: 'Long Query Example',
    key: 'longQuery',
    type: 'Test',
    description: 'just get some sleep and mushy peas',
    query: 'CALL apoc.util.sleep(5000) \n MATCH (n) RETURN n LIMIT 100',
  },
  errorQuery: {
    name: 'Error Example',
    key: 'errorQuery',
    type: 'Test2',
    description: 'Testing the correct behaviour with a query that fails ',
    query: 'Mathc (n) REturn n limit 5',
  },
  cleanGDS: {
    name: 'Clean GDS in Memory-graph',
    key: 'cleanGDS',
    type: 'GDS',
    description: 'Test for projection ',
    query: 'call gds.graph.drop("testGraph", False);',
  },
  projection: {
    name: 'Cypher Projection',
    key: 'projection',
    type: 'GDS',
    description: 'Test for projection ',
    query: 'call gds.graph.project("testGraph", ["Resource","Class"],["annotatedSource","subClassOf"]);',
  },
  wcc: {
    name: 'Weakly Connected Component',
    key: 'wcc',
    type: 'GDS',
    description: 'Test for wcc ',
    query: 'CALL gds.wcc.mutate("testGraph",{mutateProperty:"testWcc"})',
  },
  streamPropertiesResult: {
    name: 'Stream Created properties',
    key: 'streamPropertiesResult',
    type: 'GDS',
    description: 'Test for wcc stream ',
    query:
      'CALL gds.graph.nodeProperties.stream("testGraph","testWcc") yield nodeId, propertyValue return nodeId, propertyValue LIMIT 100',
  },
};
