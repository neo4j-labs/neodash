import { createDriver } from 'use-neo4j';

const notImplementedError = (functionName: string): never => {
  throw new Error(`Not Implemented: ${functionName}`);
};

export abstract class ConnectionModule {
  name: string;

  driver: any;

  constructor(name: string) {
    this.name = name;
  }

  async initialize(_configJson: any): Promise<any> {
    return notImplementedError('initialize');
  }

  // implementation of an authentication mechanism to use NeoDash
  async authenticate(_params: any): Promise<any> {
    return notImplementedError('authenticate');
  }

  // return true if the config contains enough information to connect to the backend Neo4j/Aura database
  canConnectToStandaloneDatabase(config: any): boolean {
    return config.standaloneUsername && config.standalonePassword;
  }

  createDriver(_params: any): any {
    const { protocol, url, port, username, password, driverConfig } = _params;
    return createDriver(protocol, url, port, username, password, driverConfig);
  }

  setDriver = (driver: any): any => {
    // console.log('ConnectionModule setDriver: ', driver);
    this.driver = driver;
  };

  getDriver = (): any => {
    return this.driver;
  };

  connect(_params: any): void {
    return notImplementedError('connect');
  }

  // custom routing logic if needed by the authentication implementation
  getApplicationRouting(_application: any): any {
    return notImplementedError('getApplicationRouting');
  }

  getDashboardToLoadAfterConnecting = (config: any): string => {
    let dashboardToLoad = null;
    if (config.standaloneDashboardURL !== undefined && config.standaloneDashboardURL.length > 0) {
      dashboardToLoad = config.standaloneDashboardURL;
    } else {
      dashboardToLoad = `name:${config.standaloneDashboardName}`;
    }
    return dashboardToLoad;
  };

  // indicates whether the loadDashboardFromUrl method can be called
  canLoadFromUrl(): boolean {
    return false;
  }

  // load a dashboard from info in the url
  //  _params is expected to be { querystring: <value-of-url-query-string> }
  async loadDashboardFromUrl(_params: any): any {
    return notImplementedError('loadDashboardFromUrl');
  }

  // place to clean up after success if needed
  loadDashboardFromUrlSuccess(): void {
    return notImplementedError('loadDashboardFromUrlSuccess');
  }

  // load dashboard from backend
  async loadDashboard(_id: string): any {
    return notImplementedError('loadDashboard');
  }

  // save dashboard to backend
  async saveDashboard(_dashboard: any): boolean | never {
    return notImplementedError('saveDashboard');
  }

  // delete dashboard from backend
  async deleteDashboard(_id: string): void | never {
    return notImplementedError('deleteDashboard');
  }

  // true if the module contains a custom publish UI
  hasCustomPublishUI(): boolean {
    return false;
  }

  getPublishMenuText(): string {
    return notImplementedError('getPublishUIButton');
  }

  // a button to appear along side the Save button in SaveModal
  getPublishUIButton(): any {
    return notImplementedError('getPublishUIButton');
  }

  // a dialog to appear when the publish button is pushed
  getPublishUIDialog(): any {
    return notImplementedError('getPublishUIComponent');
  }

  async runQuery(_driver, _queryParams: Record<string, any>, _queryCallbacks: Record<string, any>): Promise<void> {
    return notImplementedError('runQuery');
  }

  async runQueryNew(_queryParams: Record<string, any>, _queryCallbacks: Record<string, any>): Promise<void> {
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

export interface ConnectionModuleState {
  connectionModule: ConnectionModule;
}
