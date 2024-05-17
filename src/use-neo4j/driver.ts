import { Neo4jScheme } from './neo4j-config.interface';

import neo4j, { Config } from '../neo4j-driver-lite/neo4j-lite-web.esm';

export const createDriver = (
  scheme: Neo4jScheme,
  host: string,
  port: string | number,
  username?: string,
  password?: string,
  config?: Config
) => {
  if (!username || !password) {
    return neo4j.driver(`${scheme}://${host}:${port}`);
  }

  const url = `${scheme}://${host}:${port}`;
  return neo4j.driver(url, neo4j.auth.basic(username, password), config);
};
