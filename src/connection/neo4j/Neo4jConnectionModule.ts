import { Record as Neo4jRecord } from 'neo4j-driver';
import { ConnectionModule } from '../ConnectionModule';
import { runCypherQuery } from './runCypherQuery';
import { extractQueryCallbacks, extractQueryParams } from './utils';
import neo4j, { Config } from 'neo4j-driver';
import { config } from 'webpack';
import { NeodashRecordParser } from '../NeodashRecordParser';
import { Neo4jRecordParser } from './Neo4jRecordParser';

const notImplementedError = (functionName: string): never => {
  throw new Error(`Not Implemented: ${functionName}`);
};

type Neo4jScheme = 'neo4j' | 'neo4j+s' | 'neo4j+scc' | 'bolt' | 'bolt+s' | 'bolt+scc';

interface Neo4jConfig {
  scheme: Neo4jScheme;
  host: string;
  port: number | string;
  username: string | undefined;
  password: string | undefined;
  database?: string | undefined;
  config?: Config;
}

export class Neo4jConnectionModule extends ConnectionModule {
  createDriver(driverConfig: Neo4jConfig) {
    const { scheme, host, port, username, password, config } = driverConfig;
    if (!username || !password) {
      return neo4j.driver(`${scheme}://${host}:${port}`);
    }
    return neo4j.driver(`${scheme}://${host}:${port}`, neo4j.auth.basic(username, password), config);
  }

  authenticate(_credentials: Record<any, any>): void | never {
    return notImplementedError('authenticate');
  }

  async runQuery(driver, inputQueryParams, inputQueryCallbacks): Promise<void> {
    let queryParams = extractQueryParams(inputQueryParams);
    let callbacks = extractQueryCallbacks(inputQueryCallbacks);
    return runCypherQuery({ driver, ...queryParams, ...callbacks });
  }

  loadDashboard(_id: string): any {
    return notImplementedError('loadDashboard');
  }

  saveDashboard(_dashboard: any): boolean | never {
    return notImplementedError('saveDashboard');
  }

  deleteDashboard(_id: string): void | never {
    return notImplementedError('deleteDashboard');
  }

  getParser(): NeodashRecordParser {
    return new Neo4jRecordParser();
  }
}
