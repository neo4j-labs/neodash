import React from 'react';
import { Record as Neo4jRecord } from 'neo4j-driver';
import { ConnectionModule } from '../ConnectionModule';
import { runCypherQuery } from './runCypherQuery';
import { extractQueryCallbacks, extractQueryParams } from './utils';

const notImplementedError = (functionName: string): never => {
  throw new Error(`Not Implemented: ${functionName}`);
};

export class Neo4jConnectionModule extends ConnectionModule {
  async initialize(_configJson: any): void {
    // do nothing
  }

  async authenticate(_params: any): void | never {
    return notImplementedError('authenticate');
  }

  getApplicationRouting(Application: any): any {
    return <Application />;
  }

  async runQuery(driver, inputQueryParams, inputQueryCallbacks): Promise<void> {
    let queryParams = extractQueryParams(inputQueryParams);
    let callbacks = extractQueryCallbacks(inputQueryCallbacks);
    return runCypherQuery({ driver, ...queryParams, ...callbacks });
  }

  getDashboardToLoadAfterConnecting = (config: any): string => {
    return super.getDashboardToLoadAfterConnecting(config);
  };

  canLoadFromUrl(): boolean {
    return false;
  }

  async loadDashboardFromUrl(_params: any): any {
    return notImplementedError('loadDashboardFromUrl');
  }

  loadDashboardFromUrlSuccess(): void {
    return notImplementedError('loadDashboardFromUrlSuccess');
  }

  async loadDashboard(_id: string): any {
    return notImplementedError('loadDashboard');
  }

  async saveDashboard(_dashboard: any): boolean | never {
    return notImplementedError('saveDashboard');
  }

  async deleteDashboard(_id: string): void | never {
    return notImplementedError('deleteDashboard');
  }

  hasCustomPublishUI(): boolean {
    return false;
  }

  getPublishMenuText(): string {
    return '';
  }

  getPublishUIButton(): any {
    return <></>;
  }

  getPublishUIDialog(): any {
    return <></>;
  }

  parseRecords(records: Neo4jRecord[]): Record<any, any>[] {
    return records;
  }
}
