import { ConnectionModuleState } from './ConnectionModule';
import { Neo4jConnectionModule } from './neo4j/Neo4jConnectionModule';
import { HiveConnectionModule } from './hive/HiveConnectionModule';

const ValidConnectionModules = ['neo4j', 'hive'];
let connectionModule = 'neo4j';

let _cachedConnectionModule = null;

export function setConnectionModule(_connectionModule: string): void {
  if (ValidConnectionModules.includes(_connectionModule)) {
    connectionModule = _connectionModule;
  }
}

export function cacheConnectionModule(_connectionModule: any): void {
  _cachedConnectionModule = _connectionModule;
}

export function getConnectionModule(): ConnectionModuleState {
  let connectionModuleObject = null;
  if (_cachedConnectionModule) {
    connectionModuleObject = _cachedConnectionModule;
  } else if (connectionModule === 'hive') {
    connectionModuleObject = new HiveConnectionModule('hive');
  } else {
    connectionModuleObject = new Neo4jConnectionModule('neo4j');
  }
  return { connectionModule: connectionModuleObject };
}
