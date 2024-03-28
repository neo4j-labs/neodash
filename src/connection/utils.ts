import { ConnectionModuleState } from './ConnectionModule';
import { Neo4jConnectionModule } from './neo4j/Neo4jConnectionModule';

export function getConnectionModule(): ConnectionModuleState {
  return { connectionModule: new Neo4jConnectionModule('neo4j') };
}
