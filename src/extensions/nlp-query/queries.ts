export const nodePropsQuery = `CALL apoc.meta.data()
YIELD label, other, elementType, type, property
WHERE NOT type = "RELATIONSHIP" AND elementType = "node"
WITH label AS nodeLabels, collect(property) AS properties
RETURN {labels: nodeLabels, properties: properties} AS output
`;

export const relPropsQuery = `
CALL apoc.meta.data()
YIELD label, other, elementType, type, property
WHERE NOT type = "RELATIONSHIP" AND elementType = "relationship"
WITH label AS nodeLabels, collect(property) AS properties
RETURN {type: nodeLabels, properties: properties} AS output
`;

export const relQuery = `
CALL apoc.meta.data()
YIELD label, other, elementType, type, property
WHERE type = "RELATIONSHIP" AND elementType = "node"
RETURN {source: label, relationship: property, target: other} AS output
`;

export const reportTypesToDesc = {
  Table: 'Multiple variables representing property values of nodes and relationships.',
  Graph:
    'Multiple variables representing nodes objects and relationships objects inside the graph. Please return also the relationship objects.',
  'Bar Chart': 'Two variables named category(a String value) and value(numeric value).',
  'Line Chart': 'Two numeric variables named x and y.',
  Sunburst: 'Two variables named Path(list of strings) and value(a numerical value).',
  'Circle Packing': 'Two variables named Path(a list of strings) and value(a numerical value).',
  Choropleth: 'Two variables named code(a String value) and value(a numerical value).',
  'Area Map': 'Two variables named code(a String value) and value(a numerical value).',
  Treemap: 'Two variables named Path(a list of strings) and value(a numerical value).',
  'Radar Chart': 'Multiple variables representing property values of nodes and relationships.',
  'Sankey Chart':
    'Three variables, two being a node object (and not a property value) and one representing a relationship object (and not a property value).',
  Map: 'multiple variables representing nodes objects(should contain spatial propeties) and relationship objects.',
  'Single Value': 'A single value of a single variable.',
  'Gauge Chart': 'A single value of a single variable.',
  'Raw JSON': 'The Cypher query must return a JSON object that will be displayed as raw JSON data.',
  'Pie Chart': 'Two variables named category and value.',
};
