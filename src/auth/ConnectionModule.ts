const notImplementedError = (functionName: string): never => {
  throw new Error(`Not Implemented: ${functionName}`);
};

export abstract class ConnectionModule {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  authenticate(_credentials: Record<any, any>): void | never {
    return notImplementedError('authenticate');
  }

  loadDashboard(_id: string): any | never {
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

  /**
   * Parse Records received from the driver to `Neo4jRecord` (t.b.d. refactor to JS dictionaries)
   * @param records
   * @returns
   */
  parseRecords(_records: any[]): Record<any, any>[] {
    return notImplementedError('parseRecords');
  }
}
