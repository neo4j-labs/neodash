// TODO - define interface
export const WORKFLOW_STEPS = {
  tsne1: {
    name: 'Project Mention Meld Graph',
    key: 'tsne1',
    type: 't-SNE',
    description: '...',
    query: `
    // Project graph
      CALL {
          MATCH (mm:MentionMeld {code: $neodash_mentionmeld_code})-[r:PREVIOUS]->(mm2:MentionMeld)
          WHERE datetime(toString($neodash_end_date)) - duration($neodash_tsne_period) < mm.start <= datetime(toString($neodash_end_date))
          AND datetime(toString($neodash_end_date)) - duration($neodash_tsne_period) < mm2.start <= datetime(toString($neodash_end_date))
          RETURN mm AS source, mm2 AS target, r
          UNION ALL
          MATCH (mm:MentionMeld {code: $neodash_mentionmeld_code})-[r:mentioned]->(x:Category)
          WHERE datetime(toString($neodash_end_date)) - duration($neodash_tsne_period) < mm.start <= datetime(toString($neodash_end_date))
          RETURN mm AS source, x AS target, r
      }
      WITH gds.alpha.graph.project($neodash_gdsname, source, target,
        {sourceNodeLabels: labels(source),
        targetNodeLabels: labels(target)},
        {relationshipType: type(r),
        properties: CASE WHEN type(r) = 'mentioned' THEN {n: r.n} ELSE {n: r.weight} END},
        {undirectedRelationshipTypes: ['mentioned']}) AS graph
      RETURN graph
    `,
  },

  tsne2: {
    name: 'Calculate Embeddings for t-SNE',
    key: 'tsne2',
    type: 't-SNE',
    description: '...',
    query: `CALL gds.fastRP.mutate($neodash_gdsname, {mutateProperty: 'embed0', embeddingDimension: 128, relationshipWeightProperty: 'n', iterationWeights: [1.0, 1.0, 1.0]})`,
  },

  tsne3: {
    name: 'Run t-SNE',
    key: 'tsne3',
    type: 't-SNE',
    description: '...',
    query: `CALL apoc.load.jsonParams('http://localhost:8001/tsne2', {method: "PUT"},
    apoc.convert.toJson({xproperty: 'start', yproperty: 'embed0',
    db: {NEO4J_DATABASE: 'poc.eios201909to202009', NEO4J_URI: "neo4j+s://dev-kg-who-ewaa.graphapp.io:7687", NEO4J_USERNAME: 'neo4j'},
    graphname: $neodash_gdsname,
    nodelabel: ['MentionMeld']}))
    YIELD value
    MERGE (a:AnalysisTSNE {code: $neodash_mentionmeld_code, period: $neodash_tsne_period, gdsname: $neodash_gdsname, end_date: $neodash_end_date, date: datetime(value.X)})
    SET a.x = value.x_tSNE, a.y = value.y_tSNE, a.nodeId = value.nodeId
    RETURN value`,
  },

  tsne4: {
    name: 'Drop Mention Meld Graph',
    key: 'tsne4',
    type: 't-SNE',
    description: '...',
    query: `CALL gds.graph.drop($neodash_gdsname) YIELD graphName`,
  },

  anomalyEmbedding1: {
    name: 'Anomaly Embedding 1',
    key: 'anomalyEmbedding1',
    type: 'Anomaly Detection',
    description: '...',
    query: `CALL gds.fastRP.mutate($neodash_gdsname, {mutateProperty: 'embed1', embeddingDimension: 128, relationshipWeightProperty: 'n', iterationWeights: [1.0, 1.0, 1.0]})`,
  },

  anomalyEmbedding2: {
    name: 'Anomaly Embedding 2',
    key: 'anomalyEmbedding2',
    type: 'Anomaly Detection',
    description: '...',
    query: `CALL gds.fastRP.mutate($neodash_gdsname, {mutateProperty: 'embed2', embeddingDimension: 128, relationshipWeightProperty: 'n', iterationWeights: [1.0, 1.0, 1.0]})`,
  },
  anomalyEmbedding3: {
    name: 'Anomaly Embedding 3',
    key: 'anomalyEmbedding3',
    type: 'Anomaly Detection',
    description: '...',
    query: `CALL gds.fastRP.mutate($neodash_gdsname, {mutateProperty: 'embed3', embeddingDimension: 128, relationshipWeightProperty: 'n', iterationWeights: [1.0, 1.0, 1.0]})`,
  },
  anomalyEmbedding4: {
    name: 'Anomaly Embedding 4',
    key: 'anomalyEmbedding4',
    type: 'Anomaly Detection',
    description: '...',
    query: `CALL gds.fastRP.mutate($neodash_gdsname, {mutateProperty: 'embed4', embeddingDimension: 128, relationshipWeightProperty: 'n', iterationWeights: [1.0, 1.0, 1.0]})`,
  },
  anomalyEmbedding5: {
    name: 'Anomaly Embedding 5',
    key: 'anomalyEmbedding5',
    type: 'Anomaly Detection',
    description: '...',
    query: `CALL gds.fastRP.mutate($neodash_gdsname, {mutateProperty: 'embed5', embeddingDimension: 128, relationshipWeightProperty: 'n', iterationWeights: [1.0, 1.0, 1.0]})`,
  },
  anomalyAlgorithm: {
    name: 'Anomaly Detection Algorithm',
    key: 'anomalyAlgorithm',
    type: 'Anomaly Detection',
    description: '...',
    query: `
    CALL apoc.load.jsonParams('http://localhost:8001/anomaly2', {method: "PUT"},
apoc.convert.toJson({xproperty: 'start', yproperty: ['embed1', 'embed2', 'embed3', 'embed4', 'embed5'],
db: {NEO4J_DATABASE: 'poc.eios201909to202009', NEO4J_URI: "neo4j+s://dev-kg-who-ewaa.graphapp.io:7687", NEO4J_USERNAME: 'neo4j'},
graphname: $neodash_gdsname,
nodelabel: ['MentionMeld'],
algorithm: ['ECOD', 'LOF', 'IForest', 'OCSVM', 'LODA', 'CBLOF', 'PCA', 'HBOS', 'KNN']}))
yield value 
MERGE (a:AnalysisAD {code: $neodash_mentionmeld_code, period: $neodash_period, gdsname: $neodash_gdsname, end_date: $neodash_end_date, date: datetime(value.X)})
SET a.LOF = value.LOF, a.ECOD = value.ECOD, a.LODA = value.LODA, a.KNN = value.KNN, a.CBLOF = value.CBLOF, a.IForest = value.IForest, a.OCSVM = value.OCSVM, a.PCA = value.PCA, a.HBOS = value.HBOS 
RETURN value`,
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
