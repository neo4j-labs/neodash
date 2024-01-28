import { Record as Neo4jRecord } from 'neo4j-driver';
import { ConnectionModule } from '../ConnectionModule';
import { runCypherQuery } from './runCypherQuery';
import { extractQueryCallbacks, extractQueryParams } from './utils';

export class Neo4jConnectionModule extends ConnectionModule {
  constructor(name) {
    super(name);
  }

  authenticate(_credentials: Record<any, any>): void | never {}

  async runQuery(driver, inputQueryParams, inputQuerycallbacks): Promise<void> {
    let queryParams = extractQueryParams(inputQueryParams);
    let callbacks = extractQueryCallbacks(inputQuerycallbacks);
    return runCypherQuery({ driver, ...queryParams, ...callbacks });
  }

  loadDashboard(_id: string): any | never {}

  saveDashboard(_dashboard: any): boolean | never {
    return true;
  }

  deleteDashboard(_id: string): void | never {}

  // TODO: understand how to implement it using only JS objects
  parseRecords(records: Neo4jRecord[]): any | never {
    return records;
  }
}
