import { ConnectionModuleState } from './ConnectionModule';
import { Neo4jConnectionModule } from './neo4j/Neo4jConnectionModule';
import { HiveConnectionModule } from './hive/HiveConnectionModule';

// TODO: get this from the Neodash configuration
const connectionModule = 'hive';

export function getConnectionModule(): ConnectionModuleState {
  if (connectionModule === 'hive') {
    return { connectionModule: new HiveConnectionModule('hive') };
  }
  return { connectionModule: new Neo4jConnectionModule('neo4j') };
}
