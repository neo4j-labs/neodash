import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Callback from '../../extensions/hive/auth/callback';
import PrivateRoute from '../../extensions/hive/auth/privateRoute';
import { Record as Neo4jRecord } from 'neo4j-driver';
import { ConnectionModule } from '../ConnectionModule';
import { runCypherQuery } from '../neo4j/runCypherQuery';
import { extractQueryCallbacks, extractQueryParams } from '../neo4j/utils';
import { hiveAuthenticate, handleNeoDashLaunch, fetchDashboardFromHive } from '../../extensions/hive/launch/launch';
import { removeSavedQueryString } from '../../extensions/hive/launch/launchHelper';
import { getHivePublishUIDialog, getHivePublishUIButton } from '../../extensions/hive/components/HivePublishUI';
import { loadConfig } from '../../extensions/hive/config/dynamicConfig';

const notImplementedError = (functionName: string): never => {
  throw new Error(`Not Implemented: ${functionName}`);
};

export class HiveConnectionModule extends ConnectionModule {
  async initialize(configJson: any): void {
    await loadConfig(configJson);
  }

  async authenticate(_params: any): any {
    return await hiveAuthenticate(_params); // eslint-disable-line
  }

  getApplicationRouting(Application: any): any {
    return (
      <Router>
        <Route exact path='/callback' component={Callback} />
        <PrivateRoute exact path='/' component={Application} />
      </Router>
    );
  }

  async runQuery(driver, inputQueryParams, inputQueryCallbacks): Promise<void> {
    let queryParams = extractQueryParams(inputQueryParams);
    let callbacks = extractQueryCallbacks(inputQueryCallbacks);
    return runCypherQuery({ driver, ...queryParams, ...callbacks });
  }

  getDashboardToLoadAfterConnecting = (config: any): string => {
    let dashboardToLoad = null;
    if (window.location.search.includes(this.name)) {
      dashboardToLoad = `${this.name}:${config.standaloneDashboardURL}`;
    } else {
      dashboardToLoad = super.getDashboardToLoadAfterConnecting(config);
    }
    return dashboardToLoad;
  };

  canLoadFromUrl(): boolean {
    return true;
  }

  async loadDashboardFromUrl(_params: any): any {
    return handleNeoDashLaunch(_params);
  }

  loadDashboardFromUrlSuccess(): void {
    removeSavedQueryString();
  }

  async loadDashboard(_id: string): any {
    return await fetchDashboardFromHive({ uuid: _id }); // eslint-disable-line
  }

  async saveDashboard(_dashboard: any): boolean | never {
    return notImplementedError('saveDashboard');
  }

  async deleteDashboard(_id: string): void | never {
    return notImplementedError('deleteDashboard');
  }

  hasCustomPublishUI(): boolean {
    return true;
  }

  getPublishMenuText(): string {
    return 'Publish to Hive';
  }

  getPublishUIButton(_params: any): any {
    return getHivePublishUIButton(_params);
  }

  getPublishUIDialog(_params: any): any {
    return getHivePublishUIDialog(_params);
  }

  parseRecords(records: Neo4jRecord[]): Record<any, any>[] {
    return records;
  }
}
