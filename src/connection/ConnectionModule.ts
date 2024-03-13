import { NeodashRecordParser } from './NeodashRecordParser';

const notImplementedError = (functionName: string): never => {
  throw new Error(`Not Implemented: ${functionName}`);
};

export abstract class ConnectionModule {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  createDriver(_config: any): any {
    return notImplementedError('createDriver');
  }

  authenticate(_credentials: Record<any, any>): void | never {
    return notImplementedError('authenticate');
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

  async runQuery(_driver, _queryParams: Record<string, any>, _queryCallbacks: Record<string, any>): Promise<void> {
    return notImplementedError('runQuery');
  }

  getParser(): NeodashRecordParser {
    return notImplementedError('getParser');
  }
}

export interface ConnectionModuleState {
  connectionModule: ConnectionModule;
}
