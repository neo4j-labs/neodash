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

export const QUERY_TRANSLATOR_TASK = `
You are an expert Neo4j Cypher translator who understands the question in english and convert to Cypher strictly based on the Neo4j Schema provided and following the instructions below:
1. Generate Cypher query compatible ONLY for Neo4j Version 5
2. Do not use EXISTS, SIZE keywords in the cypher. Use alias when using the WITH keyword
3. Please do not use same variable names for different nodes and relationships in the query.
4. Use only Nodes and relationships mentioned in the schema
5. Always do a case-insensitive and fuzzy search for any properties related search. Eg: to search for a Company name use "toLower(c.name) contains 'neo4j'"
6. Always use aliases to refer the node in the query
7. 'Answer' is NOT a Cypher keyword. Answer should never be used in a query.
8. Please generate only one Cypher query per question. 
9. Cypher is NOT SQL. So, do not mix and match the syntaxes.
10. Every Cypher query always starts with a MATCH keyword.
11. Do not response with any explanation or any other information except the Cypher query.
12. Respect the provided schema.`;

export const schemaSamplingQuery = `
WITH coalesce($sample,(count(*)/1000)+1) as sample
call apoc.meta.data({maxRels: 10, sample:toInteger(sample) })
YIELD label, other, elementType, type, property
WITH label, elementType,
apoc.text.join(collect(case when NOT type = "RELATIONSHIP" then property+": "+type else null end),", ") AS properties,
collect(case when type = "RELATIONSHIP" AND elementType = "node" then "(:" + label + ")-[:" + property + "]->(:" + toString(other[0]) + ")" else null end) as patterns
with elementType as type,
apoc.text.join(collect(":"+label+" {"+properties+"}"),"\\n") as entities,
apoc.text.join(apoc.coll.flatten(collect(coalesce(patterns,[]))),"\\n") as patterns
return collect(case type when "relationship" then entities end)[0] as relationships,
collect(case type when "node" then entities end)[0] as nodes,
collect(case type when "node" then patterns end)[0]  as patterns
`;

export const SCHEMA_SAMPLING_NUMBER = 10000;

export const reportTypesToDesc = {
  table: 'Multiple variables representing property values of nodes and relationships.',
  graph:
    'Multiple variables representing nodes objects and relationships objects inside the graph. Please return also the relationship objects.',
  'Bar Chart': 'Two variables named category(a String value) and value(numeric value).',
  'Line Chart': 'Two numeric variables named x and y.',
  sunburst: 'Two variables named Path(list of strings) and value(a numerical value).',
  'Circle Packing': 'Two variables named Path(a list of strings) and value(a numerical value).',
  choropleth: 'Two variables named code(a String value) and value(a numerical value).',
  'Area Map': 'Two variables named code(a String value) and value(a numerical value).',
  treemap: 'Two variables named Path(a list of strings) and value(a numerical value).',
  'Radar Chart': 'Multiple variables representing property values of nodes and relationships.',
  'Sankey Chart':
    'Three variables, two being a node object (and not a property value) and one representing a relationship object (and not a property value).',
  map: 'multiple variables representing nodes objects(should contain spatial propeties) and relationship objects.',
  'Single Value': 'A single value of a single variable.',
  'Gauge Chart': 'A single value of a single variable.',
  'Raw JSON': 'The Cypher query must return a JSON object that will be displayed as raw JSON data.',
  'Pie Chart': 'Two variables named category and value.',
};

export const reportExampleQueries = {
  table: 'MATCH (n:Movie)<-[:ACTED_IN]-(p:Person) RETURN n.title, n.released, count(p) as actors',
  graph: `MATCH (p:Person)-[a:ACTED_IN]->(m:Movie) WHERE m.title = 'The Matrix' RETURN p, a, m`,
  'Bar Chart': 'MATCH (p:Person)-[e]->(m:Movie) RETURN m.title as Title, COUNT(p) as People',
  'Line Chart': 'MATCH (p:Person) RETURN (p.born/10)*10 as Decade, COUNT(p) as People ORDER BY Decade ASC',
  sunburst: `MATCH path=(:Company{name:'NeoDash'})-[:HAS_DEPARTMENT*]->(:Department) WITH nodes(path) as no WITH no, last(no) as leaf WITH  [n IN no[..-1] | n.name] AS result, sum(leaf.employees) as val RETURN result, val`,
  'Circle Packing': `MATCH path=(:Company{name:'NeoDash'})-[:HAS_DEPARTMENT*]->(:Department) WITH nodes(path) as no WITH no, last(no) as leaf WITH  [n IN no[..-1] | n.name] AS result, sum(leaf.employees) as val RETURN result, val`,
  choropleth: `MATCH (:Company{name:'NeoDash'})-[:HAS_DEPARTMENT]->(:Department)<-[:IN_DEPARTMENT]-(e:Employee),(e)-[:LIVES_IN]->(c:Country) WITH c.code as code, count(e) as value RETURN code, value`,
  'Area Map': `MATCH (:Company{name:'NeoDash'})-[:HAS_DEPARTMENT]->(:Department)<-[:IN_DEPARTMENT]-(e:Employee),
  (e)-[:LIVES]->(city:City)-[:IN_COUNTRY]->(country:Country)
  WITH city, country
  CALL {
      WITH country
      RETURN country.countryCode as code, count(*) as value
      UNION
      WITH city
      RETURN city.countryCode as code, count(*) as value
  }
  WITH code, sum(value) as totalCount
  RETURN code,totalCount`,
  treemap: `MATCH path=(:Company{name:'NeoDash'})-[:HAS_DEPARTMENT*]->(:Department) WITH nodes(path) as no WITH no, last(no) as leaf WITH  [n IN no[..-1] | n.name] AS result, sum(leaf.employees) as val RETURN result, val`,
  'Radar Chart': `MATCH (s:Skill) 
  MATCH (:Player{name:"Messi"})-[h1:HAS_SKILL]->(s) 
  MATCH (:Player{name:"Mbappe"})-[h2:HAS_SKILL]->(s) 
  MATCH (:Player{name:"Benzema"})-[h3:HAS_SKILL]->(s) 
  MATCH (:Player{name:"C Ronaldo"})-[h4:HAS_SKILL]->(s) 
  MATCH (:Player{name:"Lewandowski"})-[h5:HAS_SKILL]->(s) 
  RETURN s.name as Skill, h1.value as Messi, h2.value as Mbappe, h3.value as Benzema,  h4.value as Ronaldo, h5.value as Lewandowski`,
  'Sankey Chart': 'MATCH (p:Person)-[r:RATES]->(m:Movie) RETURN p, r, m',
  map: 'MATCH (b:Brewery) RETURN b',
  'Single Value': 'MATCH (n) RETURN COUNT(n)',
  'Gauge Chart': 'MATCH (c:CPU) WHERE c.id = 1 RETURN c.load_percentage * 100',
  'Raw JSON': 'MATCH (n) RETURN COUNT(n)',
  'Pie Chart': 'Match (p:Person)-[e]->(m:Movie) RETURN m.title as Title, COUNT(p) as People LIMIT 10',
};

export const MAX_NUM_VALIDATION = 1;
