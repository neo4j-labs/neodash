import NeoBarChart from "../chart/bar/BarChart";
import NeoGraphChart from "../chart/graph/GraphChart";
import NeoIFrameChart from "../chart/iframe/IFrameChart";
import NeoLineChart from "../chart/line/LineChart";
import NeoMapChart from "../chart/map/MapChart";
import NeoPieChart from "../chart/pie/PieChart";
import NeoTableChart from "../chart/table/TableChart";


export const EXAMPLE_REPORTS = [
  {
    title: 'Table',
    description:
      'A table will return any data from Neo4j, including values, nodes, relationships and paths.\nClick the table headers to sort/filter results.',
    exampleQuery:
      'MATCH path=\n (p:Person)-[r:RATES]->(m:Movie)\nRETURN path as Path,\n       p.name as Person,\n       r.rating as Rating,\n       m.title as Movie',
    syntheticQuery: `
        WITH [
            {
                path: {  start: {identity: 1},  end:  {identity: 10},  length: 1, segments: [ { start: {labels: ["Person"], identity: 1, properties: {name: "Jim"}}, relationship: {type: "RATES", start: 1, end: 10, identity: 10001, properties: {rating: 4.5}}, end: {labels: ["Movie"], identity: 11,properties: {title: "The Matrix", released: 1999}} } ] }, person: "Jim", movie: "The Matrix", rating: 4.5
            },
            {
                path: {  start: {identity: 2},  end:  {identity: 10},  length: 1, segments: [ { start: {labels: ["Person"], identity: 2, properties: {name: "Mike"}}, relationship: {type: "RATES", start: 2, end: 10, identity: 10002, properties: {rating: 3.8}}, end: {labels: ["Movie"], identity: 11,properties: {title: "The Matrix", released: 1999}} } ] }, person: "Mike", movie: "The Matrix", rating: 3.8
            },
            {
                path: {  start: {identity: 3},  end:  {identity: 10},  length: 1, segments: [ { start: {labels: ["Person"], identity: 3, properties: {name: "Sarah"}}, relationship: {type: "RATES", start: 3, end: 10, identity: 10003, properties: {rating: 5.0}}, end: {labels: ["Movie"], identity: 11,properties: {title: "The Matrix", released: 1999}} } ] }, person: "Sarah", movie: "The Matrix", rating: 5.0
            },
            {
                path: {  start: {identity: 1},  end:  {identity: 11},  length: 1, segments: [ { start: {labels: ["Person"], identity: 1, properties: {name: "Jim"}}, relationship: {type: "RATES", start: 1, end: 11, identity: 10004, properties: {rating: 3.5}}, end: {labels: ["Movie"], identity: 12,properties: {title: "The Matrix - Reloaded", released: 2003}} } ] }, person: "Jim", movie: "The Matrix - Reloaded", rating: 3.5
            },
            {
                path: {  start: {identity: 3},  end:  {identity: 11},  length: 1, segments: [ { start: {labels: ["Person"], identity: 3, properties: {name: "Sarah"}}, relationship: {type: "RATES", start: 3, end: 11, identity: 10005, properties: {rating: 2.7}}, end: {labels: ["Movie"], identity: 12,properties: {title: "The Matrix - Reloaded", released: 2003}} } ] }, person: "Sarah", movie: "The Matrix - Reloaded", rating: 2.7
            },
            {
                path: {  start: {identity: 4},  end:  {identity: 11},  length: 1, segments: [ { start: {labels: ["Person"], identity: 4, properties: {name: "Anna"}}, relationship: {type: "RATES", start: 4, end: 11, identity: 10006, properties: {rating: 4.1}}, end: {labels: ["Movie"], identity: 12,properties: {title: "The Matrix - Reloaded", released: 2003}} } ] }, person: "Anna", movie: "The Matrix - Reloaded", rating: 4.1
            },
            {
                path: {  start: {identity: 1},  end:  {identity: 12},  length: 1, segments: [ { start: {labels: ["Person"], identity: 1, properties: {name: "Jim"}}, relationship: {type: "RATES", start: 1, end: 12, identity: 10007, properties: {rating: 4.9}}, end: {labels: ["Movie"], identity: 13,properties: {title: "The Matrix - Revolutions", released: 1999}} } ] }, person: "Jim", movie: "The Matrix - Revolutions", rating: 4.9
            },
            {
                path: {  start: {identity: 2},  end:  {identity: 12},  length: 1, segments: [ { start: {labels: ["Person"], identity: 2, properties: {name: "Mike"}}, relationship: {type: "RATES", start: 2, end: 12, identity: 10008, properties: {rating: 4.8}}, end: {labels: ["Movie"], identity: 13,properties: {title: "The Matrix - Revolutions", released: 1999}} } ] }, person: "Mike", movie: "The Matrix - Revolutions", rating: 4.8
            },
            {
                path: {  start: {identity: 3},  end:  {identity: 12},  length: 1, segments: [ { start: {labels: ["Person"], identity: 3, properties: {name: "Sarah"}}, relationship: {type: "RATES", start: 3, end: 12, identity: 10009, properties: {rating: 4.0}}, end: {labels: ["Movie"], identity: 13,properties: {title: "The Matrix - Revolutions", released: 1999}} } ] }, person: "Sarah", movie: "The Matrix - Revolutions", rating: 4.0
            },
            {
                path: {  start: {identity: 4},  end:  {identity: 12},  length: 1, segments: [ { start: {labels: ["Person"], identity: 4, properties: {name: "Anna"}}, relationship: {type: "RATES", start: 4, end: 12, identity: 10010, properties: {rating: 4.0}}, end: {labels: ["Movie"], identity: 13,properties: {title: "The Matrix - Revolutions", released: 2003}} } ] }, person: "Anna", movie: "The Matrix - Revolutions", rating: 4.0
            }
          ] as data
          UNWIND data as row
          RETURN row.path as Path, row.person as Person, row.rating as Rating, row.movie as Movie
        `,
    settings: { columnWidths: '[2,1,1,1]' },
    fields: [],
    selection: {},
    type: 'table',
    chartType: NeoTableChart,
  },
  {
    title: 'Graph',
    description: 'A graph visualization will draw all returned nodes, relationships and paths.',
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
    settings: { lockable: false },
    fields: [],
    selection: {
      Person: 'name',
      Movie: 'title',
    },
    type: 'graph',
    chartType: NeoGraphChart,
  },
  {
    title: 'Bar Chart',
    description: 'A bar chart needs a category and a numeric value field.',
    exampleQuery: 'MATCH (n:Movie)' + '\n' + 'RETURN n.genre as Genre, \n       count(n) as Movies',
    syntheticQuery:
      'UNWIND [["Action", 9],["Comedy", 12],["Drama", 8],["Thriller",6],["Sci-Fi",10],["Fantasy", 7]] as X RETURN X[0] as Genre, X[1] as Movies',
    settings: {},
    selection: { index: 'Genre', value: 'Movies', key: '(none)' },
    fields: ['Genre', 'Movies'],
    type: 'bar',
    chartType: NeoBarChart,
  },
  {
    title: 'Bar Chart (Grouped/Stacked)',
    description: 'Enable grouping in the advanced report settings to create a grouped/stacked bar chart.',
    exampleQuery:
      'MATCH (n:Movie)' + '\n' + 'RETURN n.genre as Genre, \n       count(n) as Movies,\n       n.released as Year',
    syntheticQuery:
      'UNWIND [["Action", 4, 2019],["Action", 2, 2020],["Action", 3, 2021],["Comedy", 3, 2019],["Comedy", 3, 2020],["Comedy", 6, 2021],["Drama", 2, 2019],["Drama", 1, 2020],["Drama", 5, 2021],["Thriller",2,2020],["Thriller",4,2021],["Sci-Fi",7,2019],["Sci-Fi",2,2020],["Sci-Fi",1,2021],["Fantasy", 3,2019],["Fantasy", 3,2020],["Fantasy", 2,2021]] as X RETURN X[0] as Genre, X[1] as Movies, X[2] as Year',
    settings: { legend: true },
    selection: { index: 'Genre', value: 'Movies', key: 'Year' },
    fields: ['Genre', 'Movies', 'Year'],
    type: 'bar',
    chartType: NeoBarChart,
  },
  {
    title: 'Pie Charts',
    description: 'Pie charts can be used to visualize categories and numeric values.',
    exampleQuery:
      '// How much fruit is in stock?' +
      '\n' +
      'MATCH (p:Product) \nRETURN p.name as Product,\n       p.quantity as Quantity',
    syntheticQuery:
      'WITH [["Apple",10], ["Banana",20], ["Coconut",20], ["Pear",40] ] as array UNWIND array as row RETURN row[0] as Product, row[1] as Quantity',
    settings: {},
    selection: { index: 'Product', value: 'Quantity', key: 'Product' },
    fields: ['Product', 'Quantity'],
    type: 'pie',
    chartType: NeoPieChart,
  },
  {
    title: 'Line Chart',
    description: 'A line chart can plot multiple values against a horizontal axis.',
    exampleQuery:
      'MATCH (n:Year)' + '\n' + 'RETURN n.year as Year, \n       n.revenue as Revenue, \n       n.profit as Profit',
    syntheticQuery: `
        WITH [
            [2011, 5.6, 2.3],
            [2012, 6.1, 2.6],
            [2013, 6.3, 2.8],
            [2014, 6.7, 3.3],
            [2015, 7.3, 3.5],
            [2016, 7.6, 3.9],
            [2017, 8.1, 4.1],
            [2018, 8.3, 4.5],
            [2019, 8.9, 4.7],
            [2020, 9.2, 5.1]
            ] as data
            UNWIND data as row
            RETURN row[0] as Year, row[1] as Revenue, row[2] as Profit
        `,
    settings: {
      legend: true,
      legendWidth: 100,
      marginTop: 32,
    },
    selection: {
      x: 'Year',
      value: ['Revenue', 'Profit'],
    },
    fields: ['Year', 'Revenue', 'Profit'],
    type: 'line',
    chartType: NeoLineChart,
  },
  {
    title: 'Map',
    description: 'A map report visualizes nodes and relationships with spatial (geographical) properties.',
    exampleQuery:
      '// Find all routes between cinemas.\n // Each cinema node has a point property.\nMATCH (c:Cinema),\n      (c)-[r:ROUTE_TO]->(c2:Cinema)\nRETURN c, r, c2',
    syntheticQuery: `
        UNWIND [{id: "Tilburg", label: "Cinema", point: point({latitude:51.59444886664065 , longitude:5.088862976119185})},
{id: "Antwerp", label: "Cinema", point: point({latitude:51.22065200961528  , longitude:4.414094044161085})},
{id: "Brussels", label: "Cinema", point: point({latitude:50.854284724408664, longitude:4.344177490986771})},
{id: "Cologne", label: "Cinema", point: point({latitude:50.94247712506476  , longitude:6.9699327434361855 })},
{id: "Nijmegen", label: "Cinema", point: point({latitude:51.81283449474347 , longitude:5.866804797140869})},
{start: "Tilburg", end: "Antwerp", type: "ROUTE_TO", distance: "125km", id: 100},
{start: "Antwerp", end: "Brussels", type: "ROUTE_TO", distance: "70km", id: 101},
{start: "Brussels", end: "Cologne", type: "ROUTE_TO", distance: "259km", id: 102},
{start: "Cologne", end: "Nijmegen", type: "ROUTE_TO", distance: "180km", id: 103},
{start: "Nijmegen", end: "Tilburg", type: "ROUTE_TO", distance: "92km", id: 104}
] as value
RETURN value
        `,
    settings: {},
    fields: [],
    selection: {},
    type: 'map',
    chartType: NeoMapChart,
  },
  {
    title: 'Map (from properties)',
    description: 'Use dictionaries to visualize entities that are not real nodes and relationships.',
    exampleQuery: `// Plot an artificial relationship.\nMATCH (l1:Location)<--(a:Person),\n      (a:Person)-[:KNOWS]-(b:Person),\n      (b:Person)-->(l2:Location)
RETURN {id: a.name, label: "Person", point: l1.point},
       {id: b.name, label: "Person", point: l2.point},
       {start: a.name, end: b.name, type: "KNOWS", id: 1}
`,
    syntheticQuery: `
        UNWIND [{id: "Dwight", label: "Person", point: point({latitude:41.45954418871592, longitude:-75.75265878192192})},
{id: "Jim", label: "Person", point: point({latitude:41.41492119160039,longitude: -75.6470002887925})},
{start: "Dwight", end: "Jim", type: "KNOWS", id: 1}
] as value
RETURN value
        `,
        settings: {},
        fields: [],
        selection: {},
        type: "map",
        chartType: NeoMapChart
    },
    {
        title: "iFrame",
        description: "You can iFrame other webpages inside a dashboard, and dynamically pass in your dashboard parameters into the URL.",
        exampleQuery: `https://neodash.graphapp.io/embed-test.html`,
        syntheticQuery: `https://neodash.graphapp.io/embed-test.html`,
        settings: { "passGlobalParameters": true },
        fields: [],
        globalParameters: { "neodash_person_name": "Keanu", "neodash_movie_title": "The Matrix" },
        selection: {},
        type: "iframe",
        chartType: NeoIFrameChart
    }
]

export default EXAMPLE_REPORTS;
