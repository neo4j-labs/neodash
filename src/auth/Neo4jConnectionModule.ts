import { QueryResult, Record as Neo4jRecord } from 'neo4j-driver';
import { ConnectionModule } from './ConnectionModule';
import { runCypherQuery } from '../report/ReportQueryRunner';

/**
 *
 */
export class Neo4jConnectionModule extends ConnectionModule {
  authenticate(_credentials: Record<any, any>): void | never {
    
  }

  async runQuery(_query: string): Promise<QueryResult> {
    return runCypherQuery(_query);
  }

  loadDashboard(_id: string): any | never {
    
  }

  saveDashboard(_dashboard: any): boolean | never {
    return true;
  }

  deleteDashboard(_id: string): void | never {
    
  }

  parseRecords(_records: Neo4jRecord[]): any | never {
    
  }
}
