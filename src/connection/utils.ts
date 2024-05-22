import { ConnectionModuleState } from './ConnectionModule';
import { Neo4jConnectionModule } from './neo4j/Neo4jConnectionModule';
import { HiveConnectionModule } from './hive/HiveConnectionModule';

const ValidConnectionModules = ['neo4j', 'hive'];
let connectionModule = 'neo4j';

export function setConnectionModule(_connectionModule: string): void {
  if (ValidConnectionModules.includes(_connectionModule)) {
    connectionModule = _connectionModule;
  }
}

export function getConnectionModule(): ConnectionModuleState {
  if (connectionModule === 'hive') {
    return { connectionModule: new HiveConnectionModule('hive') };
  }
  return { connectionModule: new Neo4jConnectionModule('neo4j') };
}
