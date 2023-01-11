export const defaultCypherQuery = 'MATCH (n) RETURN n LIMIT 25';
export const tableCypherQuery =
  'MATCH (n:Movie) RETURN n.title AS title, n.released AS released, id(n) AS __id LIMIT 8';
export const barChartCypherQuery = 'MATCH (n:Movie) RETURN n.released AS released, count(n.title) AS count LIMIT 5';
export const mapChartCypherQuery =
  "UNWIND [{id: 'Tilburg', label: 'Cinema', point: point({latitude:51.59444886664065 , longitude:5.088862976119185})}, {id: 'Antwerp', label: 'Cinema', point: point({latitude:51.22065200961528  , longitude:4.414094044161085})}, \n" +
  "{id: 'Brussels', label: 'Cinema', point: point({latitude:50.854284724408664, longitude:4.344177490986771})},{id: 'Cologne', label: 'Cinema', point: point({latitude:50.94247712506476  , longitude:6.9699327434361855 })}, \n" +
  "{id: 'Nijmegen', label: 'Cinema', point: point({latitude:51.81283449474347 , longitude:5.866804797140869})},{start: 'Tilburg', end: 'Antwerp', type: 'ROUTE_TO', distance: '125km', id: 100}, {start: 'Antwerp', end: 'Brussels', type: 'ROUTE_TO', distance: '70km', id: 101}, \n" +
  "{start: 'Brussels', end: 'Cologne', type: 'ROUTE_TO', distance: '259km', id: 102},{start: 'Cologne', end: 'Nijmegen', type: 'ROUTE_TO', distance: '180km', id: 103},{start: 'Nijmegen', end: 'Tilburg', type: 'ROUTE_TO', distance: '92km', id: 104}] as value RETURN value//";
export const sunburstChartCypherQuery =
  "UNWIND [{path: ['a', 'b'], value: 3}, {path: ['a', 'c'], value: 5},{path: ['a', 'd', 'e'], value: 2},{path: ['a', 'd', 'f'], value: 3}] as x RETURN x.path, x.value";
export const sankeyChartCypherQuery =
  "WITH [ { path: {  start: {labels: ['Person'], identity: 1, properties: {name: 'Jim'}},  end:  {identity: 11},  length: 1, segments: [ { start: {labels: ['Person'], identity: 1, properties: {name: 'Jim'}}, relationship: {type: 'RATES', start: 1, end: 11, identity: 10001, properties: {value: 4.5}}, end: {labels: ['Movie'], identity: 11,properties: {title: 'The Matrix', released: 1999}} } ] }, person: 'Jim', movie: 'The Matrix', value: 4.5 }, { path: {  start: {labels: ['Person'], identity: 2, properties: {name: 'Mike'}},  end:  {identity: 11},  length: 1, segments: [ { start: {labels: ['Person'], identity: 2, properties: {name: 'Mike'}}, relationship: {type: 'RATES', start: 2, end: 11, identity: 10002, properties: {value: 3.8}}, end: {labels: ['Movie'], identity: 11,properties: {title: 'The Matrix', released: 1999}} } ] }, person: 'Mike', movie: 'The Matrix', value: 3.8 } ] as data UNWIND data as row RETURN row.path as Path";
export const gaugeChartCypherQuery = 'RETURN 69';
export const iFrameText = 'https://www.wikipedia.org/';
export const markdownText = '# Hello';
export const loadDashboardURL =
  'https://gist.githubusercontent.com/nielsdejong/ee33245256b471f92901ca4073b16ec1/raw/cfaae47e0fcdf430a5de6d0d8e3ac13cfd97742e/dashboard-cypress.json';
