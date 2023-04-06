import NeoChoroplethMapChart from './chart/choropleth/ChoroplethMapChart';
import NeoCirclePackingChart from './chart/circlepacking/CirclePackingChart';
import NeoGaugeChart from './chart/gauge/GaugeChart';
import NeoSankeyChart from './chart/sankey/SankeyChart';
import NeoSunburstChart from './chart/sunburst/SunburstChart';
import NeoTreeMapChart from './chart/treemap/TreeMapChart';
import NeoRadarChart from './chart/radar/RadarChart';

export const EXAMPLE_ADVANCED_REPORTS = [
  {
    title: 'Sunburst Chart',
    description: 'Sunburst charts can be used to visualize hierarchical data, where each leaf has a numeric value.',
    exampleQuery:
      '// How are people distributed in the company?\n' +
      "MATCH path=(:Company{name:'NeoDash'})-[:HAS_DEPARTMENT*]->(:Department)\n" +
      'WITH nodes(path) as no\n' +
      'WITH no, last(no) as leaf\n' +
      'WITH  [n IN no[..-1] | n.name] AS result, sum(leaf.employees) as val\n' +
      'RETURN result, val',
    syntheticQuery:
      'UNWIND [\n' +
      '{path: ["NeoDash", "North"], value: 3},\n' +
      '{path: ["NeoDash", "Center"], value: 5},\n' +
      '{path: ["NeoDash", "South", "South 1"], value: 2},\n' +
      '{path: ["NeoDash", "South", "South 2", "South 2.1"], value: 1},\n' +
      '{path: ["NeoDash", "South", "South 2", "South 2.2"], value: 3}\n' +
      '] as x\n' +
      'RETURN x.path as path, x.value as value',
    settings: {},
    selection: { index: 'path', value: 'value', key: 'path' },
    fields: ['path', 'value'],
    type: 'sunburst',
    chartType: NeoSunburstChart,
  },
  {
    title: 'Circle Packing Chart',
    description:
      'Circle Packing charts can be used to visualize hierarchical data, where each leaf has a numeric value.',
    exampleQuery:
      '// How are people distributed in the company?\n' +
      "MATCH path=(:Company{name:'NeoDash'})-[:HAS_DEPARTMENT*]->(:Department)\n" +
      'WITH nodes(path) as no\n' +
      'WITH no, last(no) as leaf\n' +
      'WITH  [n IN no[..-1] | n.name] AS result, sum(leaf.employees) as val\n' +
      'RETURN result, val',
    syntheticQuery:
      'UNWIND [\n' +
      '{path: ["NeoDash", "North"], value: 3},\n' +
      '{path: ["NeoDash", "Center"], value: 5},\n' +
      '{path: ["NeoDash", "South", "South 1"], value: 2},\n' +
      '{path: ["NeoDash", "South", "South 2", "South 2.1"], value: 1},\n' +
      '{path: ["NeoDash", "South", "South 2", "South 2.2"], value: 3}\n' +
      '] as x\n' +
      'RETURN x.path as path, x.value as value',
    settings: {},
    selection: { index: 'path', value: 'value', key: 'path' },
    fields: ['path', 'value'],
    type: 'circlePacking',
    chartType: NeoCirclePackingChart,
  },
  {
    title: 'Treemap Chart',
    description: 'Treemap charts can be used to visualize hierarchical data, where each leaf has a numeric value.',
    exampleQuery:
      '// How are people distributed in the company?\n' +
      "MATCH path=(:Company{name:'NeoDash'})-[:HAS_DEPARTMENT*]->(:Department)\n" +
      'WITH nodes(path) as no\n' +
      'WITH no, last(no) as leaf\n' +
      'WITH  [n IN no[..-1] | n.name] AS result, sum(leaf.employees) as val\n' +
      'RETURN result, val',
    syntheticQuery:
      'UNWIND [\n' +
      '{path: ["NeoDash", "North"], value: 3},\n' +
      '{path: ["NeoDash", "Center"], value: 5},\n' +
      '{path: ["NeoDash", "South", "South 1"], value: 2},\n' +
      '{path: ["NeoDash", "South", "South 2", "South 2.1"], value: 1},\n' +
      '{path: ["NeoDash", "South", "South 2", "South 2.2"], value: 3}\n' +
      '] as x\n' +
      'RETURN x.path as path, x.value as value',
    settings: {},
    selection: { index: 'path', value: 'value', key: 'path' },
    fields: ['path', 'value'],
    type: 'treeMap',
    chartType: NeoTreeMapChart,
  },

  {
    title: 'Sankey',
    description:
      'A Sankey visualization will compute a diagram from nodes and links. Beware that cyclic dependencies are not supported.',
    exampleQuery: 'MATCH (p:Person)-[r:RATES]->(m:Movie)\nRETURN p, r, m',
    syntheticQuery: `
        WITH [
            {
                path: {  start: {labels: ["Person"], identity: 1, properties: {name: "Jim"}},  end:  {identity: 11},  length: 1, segments: [ { start: {labels: ["Person"], identity: 1, properties: {name: "Jim"}}, relationship: {type: "RATES", start: 1, end: 11, identity: 10001, properties: {rating: 4.5}}, end: {labels: ["Movie"], identity: 11,properties: {title: "The Matrix", released: 1999}} } ] }, person: "Jim", movie: "The Matrix", rating: 4.5
            },
            {
                path: {  start: {labels: ["Person"], identity: 2, properties: {name: "Mike"}},  end:  {identity: 11},  length: 1, segments: [ { start: {labels: ["Person"], identity: 2, properties: {name: "Mike"}}, relationship: {type: "RATES", start: 2, end: 11, identity: 10002, properties: {rating: 3.8}}, end: {labels: ["Movie"], identity: 11,properties: {title: "The Matrix", released: 1999}} } ] }, person: "Mike", movie: "The Matrix", rating: 3.8
            },
            {
                path: {  start: {labels: ["Person"], identity: 3, properties: {name: "Sarah"}},  end:  {identity: 11},  length: 1, segments: [ { start: {labels: ["Person"], identity: 3, properties: {name: "Sarah"}}, relationship: {type: "RATES", start: 3, end: 11, identity: 10003, properties: {rating: 5.0}}, end: {labels: ["Movie"], identity: 11,properties: {title: "The Matrix", released: 1999}} } ] }, person: "Sarah", movie: "The Matrix", rating: 5.0
            },
            {
                path: {  start: {labels: ["Person"], identity: 1, properties: {name: "Jim"}},  end:  {identity: 12},  length: 1, segments: [ { start: {labels: ["Person"], identity: 1, properties: {name: "Jim"}}, relationship: {type: "RATES", start: 1, end: 12, identity: 10004, properties: {rating: 3.5}}, end: {labels: ["Movie"], identity: 12, properties: {title: "The Matrix - Reloaded", released: 2003}} } ] }, person: "Jim", movie: "The Matrix - Reloaded", rating: 3.5
            },
            {
                path: {  start: {labels: ["Person"], identity: 3, properties: {name: "Sarah"}},  end:  {identity: 12},  length: 1, segments: [ { start: {labels: ["Person"], identity: 3, properties: {name: "Sarah"}}, relationship: {type: "RATES", start: 3, end: 12, identity: 10005, properties: {rating: 2.7}}, end: {labels: ["Movie"], identity: 12,properties: {title: "The Matrix - Reloaded", released: 2003}} } ] }, person: "Sarah", movie: "The Matrix - Reloaded", rating: 2.7
            },
            {
                path: { start: {labels: ["Person"], identity: 4, properties: {name: "Anna"}},  end:  {identity: 12},  length: 1, segments: [ { start: {labels: ["Person"], identity: 4, properties: {name: "Anna"}}, relationship: {type: "RATES", start: 4, end: 12, identity: 10006, properties: {rating: 4.1}}, end: {labels: ["Movie"], identity: 12,properties: {title: "The Matrix - Reloaded", released: 2003}} } ] }, person: "Anna", movie: "The Matrix - Reloaded", rating: 4.1
            },
            {
                path: {  start: {labels: ["Person"], identity: 1, properties: {name: "Jim"}},  end:  {identity: 13},  length: 1, segments: [ { start: {labels: ["Person"], identity: 1, properties: {name: "Jim"}}, relationship: {type: "RATES", start: 1, end: 13, identity: 10007, properties: {rating: 4.9}}, end: {labels: ["Movie"], identity: 13,properties: {title: "The Matrix - Revolutions", released: 1999}} } ] }, person: "Jim", movie: "The Matrix - Revolutions", rating: 4.9
            },
            {
                path: {  start: {labels: ["Person"], identity: 2, properties: {name: "Mike"}},  end:  {identity: 13},  length: 1, segments: [ { start: {labels: ["Person"], identity: 2, properties: {name: "Mike"}}, relationship: {type: "RATES", start: 2, end: 13, identity: 10008, properties: {rating: 4.8}}, end: {labels: ["Movie"], identity: 13,properties: {title: "The Matrix - Revolutions", released: 1999}} } ] }, person: "Mike", movie: "The Matrix - Revolutions", rating: 4.8
            },
            {
                path: {  start: {labels: ["Person"], identity: 3, properties: {name: "Sarah"}},  end:  {identity: 13},  length: 1, segments: [ { start: {labels: ["Person"], identity: 3, properties: {name: "Sarah"}}, relationship: {type: "RATES", start: 3, end: 13, identity: 10009, properties: {rating: 4.0}}, end: {labels: ["Movie"], identity: 13,properties: {title: "The Matrix - Revolutions", released: 1999}} } ] }, person: "Sarah", movie: "The Matrix - Revolutions", rating: 4.0
            },
            {
                path: { start: {labels: ["Person"], identity: 4, properties: {name: "Anna"}},  end:  {identity: 13},  length: 1, segments: [ { start: {labels: ["Person"], identity: 4, properties: {name: "Anna"}}, relationship: {type: "RATES", start: 4, end: 13, identity: 10010, properties: {rating: 4.0}}, end: {labels: ["Movie"], identity: 13,properties: {title: "The Matrix - Revolutions", released: 2003}} } ] }, person: "Anna", movie: "The Matrix - Revolutions", rating: 4.0
            }
          ] as data
          UNWIND data as row
          RETURN row.path as Path
        `,
    settings: { labelPosition: 'outside', labelProperty: 'rating', layout: 'vertical' },
    fields: [],
    selection: {
      Person: 'name',
      Movie: 'title',
    },
    type: 'sankey',
    chartType: NeoSankeyChart,
  },
  {
    title: 'Choropleth Chart',
    description: 'Choropleth charts can be used to render geographical based information on geoJson polygons.',
    exampleQuery:
      '// How are people distributed in the company per country?\n' +
      "MATCH (:Company{name:'NeoDash'})-[:HAS_DEPARTMENT]->(:Department)<-[:IN_DEPARTMENT]-(e:Employee),\n" +
      '(e)-[:LIVES_IN]->(c:Country)\n' +
      'WITH c.code as code, count(e) as value\n' +
      'RETURN code, value',
    syntheticQuery:
      'UNWIND [\n' +
      '{id: "ARG", value: 23},\n' +
      '{id: "BOL", value: 2},\n' +
      '{id: "CAN", value: 100},\n' +
      '{id: "COL", value: 5},\n' +
      '{id: "FRA", value: 40},\n' +
      '{id: "USA", value: 156}\n' +
      '] as x \n' +
      'RETURN x.id as code, x.value as value',
    settings: { colors: 'nivo' },
    selection: { index: 'code', value: 'value', key: 'code' },
    fields: ['code', 'value'],
    type: 'choropleth',
    chartType: NeoChoroplethMapChart,
  },
  {
    title: 'Radar Chart',
    description:
      'Radar charts can be used to render multivariate data from an array of nodes into the form of a two dimensional chart of three or more quantitative variables.',
    exampleQuery:
      '// What are FIFA22 players stats?\n' +
      'MATCH (s:Skill),\n' +
      "(:Player{name:'Messi'})-[h1]->(s),\n" +
      "(:Player{name:'Mbappe'})-[h2]->(s),\n" +
      "(:Player{name:'Benzema'})-[h3]->(s),\n" +
      "(:Player{name:'Ronaldo'})-[h4]->(s),\n" +
      "(:Player{name:'Lewandowski'})-[h5]->(s)\n" +
      'RETURN s.name as Skill, \n h1.value as Messi,\nh2.value as Mbappe,\n h3.value as Benzema,\n' +
      'h4.value as `Ronaldo`,\n h5.value as Lewandowski',
    syntheticQuery:
      'UNWIND [' +
      '{Skill: "PACE", Lewandowski: 78, Messi: 83, Ronaldo: 85, Benzema: 80, Mbappé: 97},' +
      '   {Skill: "SHOOTING", Lewandowski: 92, Messi: 90, Ronaldo: 93, Benzema: 88, Mbappé: 88},' +
      '   {Skill: "PASSING", Lewandowski: 79, Messi: 91, Ronaldo: 80, Benzema: 83, Mbappé: 80},' +
      '   {Skill: "DRIBBLING", Lewandowski: 86, Messi: 95, Ronaldo: 86, Benzema: 87, Mbappé: 92},' +
      '   {Skill: "DEFENDING", Lewandowski: 44, Messi: 34, Ronaldo: 34, Benzema: 39, Mbappé: 36},' +
      '   {Skill: "PHYSICAL", Lewandowski: 82, Messi: 64, Ronaldo: 75, Benzema: 78, Mbappé: 77}' +
      '   ] as data ' +
      '   RETURN data.Skill as Skill, data.Lewandowski as Lewandowski, data.Messi as Messi, data.Ronaldo as Ronaldo, data.Benzema as Benzema ,data.Mbappé as Mbappé',
    settings: { colors: 'set3' },
    selection: {
      index: 'Skill',
      values: ['Lewandowski', 'Benzema', 'Mbappé', 'Messi', 'Ronaldo'],
    },
    fields: ['Skill', 'Lewandowski', 'Messi', 'Ronaldo', 'Benzema', 'Mbappé'],
    type: 'radar',
    chartType: NeoRadarChart,
  },
  {
    title: 'Gauge Chart',
    description: 'Gauge charts can be used to visualize a single numeric value (0-100) as a reading on a dial',
    exampleQuery:
      '// How many story points has been closed during this sprint (based on the total)?\n' +
      "MATCH (:Sprint{name:'Sprint 2'})-[:HAS_STORY]->(s:Story)\n" +
      'WITH collect(s) as Stories\n' +
      'WITH  reduce(t = 0, n IN Stories | t + n.points) as Total, reduce(t = 0, n IN [story in Stories where story.closed = true ] | t + n.points) as TotalClosed\n' +
      'RETURN toFloat(TotalClosed*100)/Total',
    syntheticQuery: 'RETURN rand()*100',
    settings: {},
    selection: {},
    fields: [],
    type: 'gauge',
    chartType: NeoGaugeChart,
  },
];
