import { Record as Neo4jRecord } from 'neo4j-driver';
import { ConnectionModule } from '../ConnectionModule';
import { runCypherQuery } from './runCypherQuery';
import { extractQueryCallbacks, extractQueryParams } from './utils';

const notImplementedError = (functionName: string): never => {
  throw new Error(`Not Implemented: ${functionName}`);
};

export class Neo4jConnectionModule extends ConnectionModule {
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

  parseRecords(records: Neo4jRecord[]): Record<any, any>[] {
    return records;
  }
}
