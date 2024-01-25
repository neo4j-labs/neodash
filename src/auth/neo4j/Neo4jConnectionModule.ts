import { Record as Neo4jRecord } from 'neo4j-driver';
import { ConnectionModule } from '../ConnectionModule';
import { useContext } from 'react';
import { Neo4jContextState, Neo4jContext } from 'use-neo4j/dist/neo4j.context';
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

  parseRecords(_records: Neo4jRecord[]): any | never {}
}
