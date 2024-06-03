import { Neo4jScheme } from './neo4j-config.interface';

import neo4j, { Config } from '@neo4j-labs/experimental-query-api-wrapper';

export const createDriver = (
  scheme: Neo4jScheme,
  host: string,
  port: string | number,
  username: string,
  password: string,
  config?: Config
) => {
  const url = `${scheme}://${host}:${port}`;
  return neo4j.wrapper(url, neo4j.auth.basic(username, password), config);
};
