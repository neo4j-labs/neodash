import { ConnectionModuleState } from './ConnectionModule';
import { Neo4jConnectionModule } from './neo4j/Neo4jConnectionModule';
import { HiveConnectionModule } from './hive/HiveConnectionModule';

const ValidConnectionModules = ['neo4j', 'hive'];
let connectionModule = 'neo4j';

let _cachedConnectionModule = null;

export function setConnectionModule(_connectionModule: string): void {
  if (ValidConnectionModules.includes(_connectionModule)) {
    console.log(`setting connectionModule string: ${_connectionModule}`);
    connectionModule = _connectionModule;
  }
}

export function cacheConnectionModule(_connectionModule: any): void {
  _cachedConnectionModule = _connectionModule;
  console.log(`caching connection module: ${connectionModule}`);
}

export function getConnectionModule(): ConnectionModuleState {
  // console.log(`getConnectionModule: connectionModule string is: ${connectionModule}`)

  let connectionModuleObject = null;
  if (_cachedConnectionModule) {
    // console.log(`returning cached connection module`)
    connectionModuleObject = _cachedConnectionModule;
  } else if (connectionModule === 'hive') {
    console.log(`returning new HiveConnectionModule`);
    connectionModuleObject = new HiveConnectionModule('hive');
  } else {
    console.log(`returning new Neo4jConnectionModule`);
    connectionModuleObject = new Neo4jConnectionModule('neo4j');
  }
  return { connectionModule: connectionModuleObject };
}
