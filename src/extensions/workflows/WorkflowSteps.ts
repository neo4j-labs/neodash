// TODO - define interface
export const WORKFLOW_STEPS = {
  tsne1: {
    name: 'Label Nodes for t-SNE',
    key: 'tsne1',
    type: 't-SNE',
    description: '...',
    query: `MATCH (d:MentionMeld {code: $neodash_mentionmeld_code})
    WHERE datetime(toString($neodash_end_date)) - duration($neodash_period) < d.start <= datetime(toString($neodash_end_date))
    OPTIONAL MATCH (d)-[r:mentioned]->(x:Category)
    WITH collect(DISTINCT d) AS dnodes, collect(DISTINCT x) AS xnodes
    CALL apoc.create.addLabels(apoc.coll.flatten([dnodes, xnodes]), [$neodash_labelstring]) YIELD node
    RETURN count(node)`,
  },

  tsne2: {
    name: 'Project Graph for t-SNE',
    key: 'tsne2',
    type: 't-SNE',
    description: '...',
    query: `CALL gds.graph.project($neodash_gdsname, $neodash_labelstring, {mentioned: {orientation: 'UNDIRECTED', properties: 'n'}, PREVIOUS: {orientation: 'NATURAL', properties: {n: {defaultValue: 1.0, property: 'weight'}}}});
      `,
  },

  tsne3: {
    name: 'Calculate Embeddings for t-SNE',
    key: 'tsne3',
    type: 't-SNE',
    description: '...',
    query: `CALL gds.fastRP.mutate($neodash_gdsname, {mutateProperty: 'embed0', embeddingDimension: 128, relationshipWeightProperty: 'n', iterationWeights: [1.0, 1.0, 1.0]})`,
  },

  tsne4: {
    name: 'Run t-SNE',
    key: 'tsne4',
    type: 't-SNE',
    description: '...',
    query: `CALL apoc.load.jsonParams('http://localhost:8001/tsne', {method: "PUT"},
      apoc.convert.toJson({xproperty: 'start', yproperty: 'embed0',
      db: {NEO4J_DATABASE: 'poc.eios201909to202009', NEO4J_URI: "neo4j+s://dev-kg-who-ewaa.graphapp.io:7687", NEO4J_USERNAME: 'neo4j'},
      graphname: $neodash_gdsname,
      nodelabel: ['MentionMeld', $neodash_labelstring]}))
      YIELD value
      MERGE (t:TSNE {date: value.X, x: value.x_tSNE, y: value.y_tSNE, nodeId: value.nodeId})
      WITH t
      MATCH (d:MentionMeld {code: $neodash_mentionmeld_code, start: datetime(toString($neodash_end_date))})
      MERGE (t)-[:CALCULATED]->(d)`,
  },

  tsne5: {
    name: 'Drop Graph for t-SNE',
    key: 'tsne5',
    type: 't-SNE',
    description: '...',
    query: `CALL gds.graph.drop($neodash_gdsname) YIELD graphName`,
  },

  tsne6: {
    name: 'Remove labels for t-SNE',
    key: 'tsne6',
    type: 't-SNE',
    description: '...',
    query: `MATCH (n:MentionMeld|Category) WHERE $neodash_labelstring IN labels(n)
      CALL apoc.create.removeLabels(n, [$neodash_labelstring]) YIELD node RETURN count(node)`,
  },

  shortestPath: {
    name: "Yen's Shortest Path",
    key: 'shortestPath',
    type: 'Pathfinding',
    description:
      "Yen's Shortest Path algorithm computes a number of shortest paths between two nodes. The algorithm is often referred to as Yen's k-Shortest Path algorithm, where k is the number of shortest paths to compute. The algorithm supports weighted graphs with positive relationship weights.",
    query: 'UNWIND RANGE(1,100) as X \n WITH X as test \n RETURN test',
  },
  pageRank: {
    name: 'PageRank',
    key: 'pageRank',
    type: 'Centrality',
    description:
      'The PageRank algorithm measures the importance of each node within the graph, based on the number incoming relationships and the importance of the corresponding source nodes. The underlying assumption roughly speaking is that a page is only as important as the pages that link to it.',
    query: 'UNWIND RANGE(1,10000) as X \n WITH X as test \n RETURN collect(test)',
  },
  longQuery: {
    name: 'Long Query Example',
    key: 'longQuery',
    type: 'Test',
    description: '[...]',
    query: 'CALL apoc.util.sleep(5000) \n MATCH (n) RETURN n LIMIT 100',
  },
  errorQuery: {
    name: 'Error Example',
    key: 'errorQuery',
    type: 'Test2',
    description: 'Testing the correct behaviour with a query that fails.',
    query: 'Mathc (n) REturn n limit 5',
  },
  cleanGDS: {
    name: 'Clean GDS in Memory-graph',
    key: 'cleanGDS',
    type: 'GDS',
    description: 'Test for projection.',
    query: 'call gds.graph.drop("testGraph", False);',
  },
  projection: {
    name: 'Cypher Projection',
    key: 'projection',
    type: 'GDS',
    description: 'Test for projection.',
    query: 'call gds.graph.project("testGraph", ["Resource","Class"],["annotatedSource","subClassOf"]);',
  },
  wcc: {
    name: 'Weakly Connected Component',
    key: 'wcc',
    type: 'GDS',
    description: 'Test for wcc.',
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
