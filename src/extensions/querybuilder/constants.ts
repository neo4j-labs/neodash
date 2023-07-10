import { Direction, Operator, AggregationFunction } from '@neode/querybuilder';

export type ApocDirection = 'in' | 'out' | 'both';
export type Condition =
  | 'equals'
  | 'contains'
  | 'starts with'
  | 'ends with'
  | 'greater than'
  | 'less than'
  | 'greater than or equal'
  | 'less than or equal';

export const operators = {
  equals: Operator.EQUALS,
  contains: Operator.CONTAINS,
  'starts with': Operator.STARTS_WITH,
  'ends with': Operator.ENDS_WITH,
  'greater than': Operator.GREATER_THAN,
  'greater than or equal': Operator.GREATER_THAN_OR_EQUAL,
  'less than': Operator.LESS_THAN,
  'less than or equal': Operator.LESS_THAN_OR_EQUAL,
};

export const conditions: Condition[] = Object.keys(operators) as Condition[];

export const directions = {
  in: Direction.INCOMING,
  out: Direction.OUTGOING,
  both: Direction.BOTH,
};

export const reportSources = [
  { key: 'cypher', value: 'cypher', text: 'Raw Cypher Query' },
  { key: 'query', value: 'query', text: 'Query from Query Builder' },
];

const barExampleQuery = `MATCH (m:Movie)-[:IN_GENRE]->(g)\nWHERE\n    m.release_date.year > 2010\nRETURN m.release_date.year AS index,\n    g.name AS key,\n    count(*) AS value\nORDER BY index DESC LIMIT 20`;
const barPreviewQuery = `UNWIND [[2012, "(no genres listed)", 1], [2012, "Action", 51], [2012, "Adventure", 24], [2012, "Animation", 20], [2012, "Children", 7], [2012, "Comedy", 77], [2012, "Crime", 27], [2012, "Documentary", 27], [2012, "Drama", 86], [2012, "Fantasy", 17], [2012, "Film-Noir", 1], [2012, "Horror", 21], [2012, "IMAX", 22], [2012, "Musical", 10], [2012, "Mystery", 5], [2012, "Romance", 25], [2012, "Sci-Fi", 25], [2012, "Thriller", 48], [2012, "War", 2], [2012, "Western", 1], [2013, "(no genres listed)", 1], [2013, "Action", 49], [2013, "Adventure", 32], [2013, "Animation", 13], [2013, "Children", 7], [2013, "Comedy", 70], [2013, "Crime", 30], [2013, "Documentary", 21], [2013, "Drama", 99], [2013, "Fantasy", 22], [2013, "Film-Noir", 1], [2013, "Horror", 12], [2013, "IMAX", 26], [2013, "Musical", 2], [2013, "Mystery", 10], [2013, "Romance", 23], [2013, "Sci-Fi", 18], [2013, "Thriller", 37], [2013, "War", 2], [2013, "Western", 1], [2014, "Action", 52], [2014, "Adventure", 27], [2014, "Animation", 14], [2014, "Children", 10], [2014, "Comedy", 89], [2014, "Crime", 28], [2014, "Documentary", 18], [2014, "Drama", 109], [2014, "Fantasy", 14], [2014, "Horror", 18], [2014, "IMAX", 15], [2014, "Musical", 2], [2014, "Mystery", 11], [2014, "Romance", 33], [2014, "Sci-Fi", 25], [2014, "Thriller", 42], [2014, "War", 8], [2014, "Western", 1], [2015, "(no genres listed)", 6], [2015, "Action", 45], [2015, "Adventure", 31], [2015, "Animation", 7], [2015, "Children", 11], [2015, "Comedy", 71], [2015, "Crime", 23], [2015, "Documentary", 17], [2015, "Drama", 83], [2015, "Fantasy", 12], [2015, "Horror", 22], [2015, "IMAX", 1], [2015, "Mystery", 11], [2015, "Romance", 15], [2015, "Sci-Fi", 25], [2015, "Thriller", 51], [2015, "War", 3], [2015, "Western", 3], [2016, "(no genres listed)", 3], [2016, "Action", 22], [2016, "Adventure", 18], [2016, "Animation", 7], [2016, "Children", 2], [2016, "Comedy", 20], [2016, "Crime", 3], [2016, "Documentary", 5], [2016, "Drama", 17], [2016, "Fantasy", 8], [2016, "Horror", 10], [2016, "Musical", 1], [2016, "Mystery", 3], [2016, "Romance", 7], [2016, "Sci-Fi", 13], [2016, "Thriller", 14], [2016, "Western", 1]] AS row RETURN row[0] as index, row[1] as key, row[2] as value`;

interface AggregationFunctionOption {
  key: string;
  text: string;
  value: AggregationFunction;
}

export const aggregateFunctions: AggregationFunctionOption[] = [
  { key: 'avg', value: 'avg', text: 'avg' },
  { key: 'collect', value: 'collect', text: 'collect' },
  { key: 'count', value: 'count', text: 'count' },
  { key: 'max', value: 'max', text: 'max' },
  { key: 'min', value: 'min', text: 'min' },
  { key: 'percentileCont', value: 'percentileCont', text: 'percentileCont' },
  { key: 'percentileDisc', value: 'percentileDisc', text: 'percentileDisc' },
  { key: 'stDev', value: 'stDev', text: 'stDev' },
  { key: 'stDevP', value: 'stDevP', text: 'stDevP' },
  { key: 'sum', value: 'sum', text: 'sum' },
];
