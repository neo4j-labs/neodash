import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import Callback from '../../extensions/hive/auth/callback';
import PrivateRoute from '../../extensions/hive/auth/privateRoute';
import { Integer, Record as Neo4jRecord } from 'neo4j-driver';
import { ConnectionModule } from '../ConnectionModule';
import { runCypherQuery } from '../neo4j/runCypherQuery';
import { extractQueryCallbacks, extractQueryParams } from '../neo4j/utils';
import { hiveAuthenticate, handleNeoDashLaunch, fetchDashboardFromHive } from '../../extensions/hive/launch/launch';
import { removeSavedQueryString } from '../../extensions/hive/launch/launchHelper';
import { getHivePublishUIDialog, getHivePublishUIButton } from '../../extensions/hive/components/HivePublishUI';
import { loadConfig } from '../../extensions/hive/config/dynamicConfig';
import { QueryStatus } from '../interfaces';
import {
  extractNodeAndRelPropertiesFromRecords,
  extractNodePropertiesFromRecords,
} from '../../report/ReportRecordProcessing';
import { getEndpointUrl, getApiKey } from '../../extensions/keymaker/state/KeymakerSelector';

const notImplementedError = (functionName: string): never => {
  throw new Error(`Not Implemented: ${functionName}`);
};

export class HiveConnectionModule extends ConnectionModule {
  initialize = async (configJson: any): void => {
    await loadConfig(configJson);
  };

  async authenticate(_params: any): any {
    return await hiveAuthenticate(_params); // eslint-disable-line
  }

  // connect to the backend Neo4j/Aura database
  connect(params: any): void {
    const { dispatch, createConnectionThunk, config } = params;
    const connectionConfig = {
      protocol: config.standaloneProtocol,
      url: config.standaloneHost,
      port: config.standalonePort,
      database: config.standaloneDatabase,
      username: config.standaloneUsername,
      password: config.standalonePassword,
    };
    dispatch(createConnectionThunk(connectionConfig));
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

  runQueryNew = async (inputQueryParams, inputQueryCallbacks, state): Promise<void> => {
    const endpointUrl = getEndpointUrl(state);
    const apiKey = getApiKey(state);
    let queryParams = extractQueryParams(inputQueryParams);
    let callbacks = extractQueryCallbacks(inputQueryCallbacks);
    let driver = this.getDriver();
    let { language, query, returnFormat } = this.preprocessQuery(queryParams.query);
    if (language === 'graphql') {
      let { useNodePropsAsFields = false, useReturnValuesAsFields = false } = queryParams;
      let variables = queryParams.parameters || {};
      let queryTimeLimit = queryParams.queryTimeLimit;
      let { setFields, setRecords, setSchema, setStatus, setError } = callbacks;
      try {
        let graphqlResponse = await this.runGraphQLQuery(endpointUrl, apiKey, query, variables, queryTimeLimit);
        let recommendations = graphqlResponse?.data?.recommendations;
        let { keys, records } = this.convertGraphQLResponseToRecords(recommendations, returnFormat);

        if (useReturnValuesAsFields) {
          setFields(keys);
        } else if (useNodePropsAsFields) {
          // If we don't use dynamic field mapping, but we do have a selection, use the discovered node properties as fields.
          const nodePropsAsFields = extractNodePropertiesFromRecords(records);
          setFields(nodePropsAsFields);
        }
        setSchema(extractNodeAndRelPropertiesFromRecords(records));
        setRecords(records);
        if (records.length === 0) {
          setStatus(QueryStatus.NO_DATA);
        } else {
          setStatus(QueryStatus.COMPLETE);
        }
      } catch (e) {
        setError(e.message);
        setRecords([{ error: e.message }]);
        setStatus(QueryStatus.ERROR);
      }
    } else {
      return runCypherQuery({ driver, ...queryParams, ...callbacks });
    }
  };

  preprocessQuery = (query) => {
    let lines = query.split('\n').map((line) => line.trim());

    let directives = lines
      .filter((line) => line.startsWith('//'))
      .map((line) => line.substring(2).trim())
      .reduce((acc, line) => {
        let tokens = line.split(':');
        let key = tokens[0]?.trim();
        let value = tokens[1]?.trim();
        let prevValue = acc[key];
        if (prevValue === undefined) {
          acc[key] = value;
        } else if (Array.isArray(prevValue)) {
          acc[key] = prevValue.concat(value);
        } else {
          acc[key] = [prevValue].concat(value);
        }
        return acc;
      }, {});

    let newQuery = lines.filter((line) => !line.startsWith('//')).join('\n');

    return {
      language: directives.language ? directives.language : 'cypher',
      returnFormat: this.processFormat(directives.returnFormat),
      query: newQuery,
    };
  };

  processFormat = (formatValue) => {
    if (formatValue) {
      if (Array.isArray(formatValue)) {
        formatValue = formatValue.join(',');
      }
      return formatValue
        .split(',')
        .map((x) => x.trim())
        .map((x) => {
          let variableAndAlias = x.split(/\s+AS\s+/i);
          if (variableAndAlias.length === 1) {
            return { variable: variableAndAlias[0], alias: variableAndAlias[0] };
          } else if (variableAndAlias.length > 1) {
            return { variable: variableAndAlias[0], alias: variableAndAlias[1] };
          }
          return { variable: 'error_not_specified', alias: 'error_not_specified' };
        });
    }
    return [];
  };

  getNestedValue = (obj, path) => {
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
      value = value[key];
      if (value === undefined) {
        return `Property ${key} not found`;
      }
    }
    return value;
  };

  rewriteIntegers = (value, key) => {
    if (value === null) {
      return null;
    } else if (Array.isArray(value)) {
      return value.map((x) => this.rewriteIntegers(x));
    } else if (typeof value === 'object') {
      return Object.keys(value).reduce((newValue, key) => {
        newValue[key] = this.rewriteIntegers(value[key], key);
        return newValue;
      }, {});
    } else if (Number.isInteger(value) && ['start', 'end', 'identity'].includes(key)) {
      return new Integer(value, 0);
    }
    return value;
  };

  convertGraphQLResponseToRecords = (recommendations, returnFormat) => {
    // returnFormat contains an array of variables and aliases
    //   a variable can have a nested property accessor, such as item.id, or details.company.name
    /* for example:
      returnFormat = [
            {variable:'item.id',alias:'id'},
            {variable:'score',alias:'score'}
      ]
    */
    // if unspecified, the graphql response will be returned directly without transformation

    let records = recommendations.map((recommendation) => {
      recommendation = this.rewriteIntegers(recommendation);
      let allKeys = [];
      let allValues = [];

      if (returnFormat && returnFormat.length > 0) {
        returnFormat.forEach(({ variable, alias }) => {
          let value = this.getNestedValue(recommendation, variable);
          allKeys = allKeys.concat(alias);
          allValues = allValues.concat(value);
        });
      } else {
        Object.keys(recommendation).forEach((key) => {
          allKeys.push(key);
          allValues.push(recommendation[key]);
        });
      }
      return new Neo4jRecord(allKeys, allValues);
    });

    let keys = [];
    if (records.length > 0) {
      keys = records[0].keys;
    }

    return { keys, records };
  };

  handleErrors = (response) => {
    if (!response.ok) {
      throw Error(`${response.status}: ${response.statusText}`);
    }
    return response;
  };

  runGraphQLQuery = async (endpointUrl, apiKey, query, variables, queryTimeLimit): any => {
    if (!endpointUrl || !apiKey) {
      throw new Error(
        'Ensure you have the Keymaker plugin enabled, and that you have specified both a GraphQL URL and an API Key'
      );
    }

    const controller = new AbortController();
    const { signal } = controller;

    let uri = endpointUrl;
    let httpHeaders = {
      'api-key': apiKey,
    };

    // Set a timer to abort the request after queryTimeLimit ms
    const timeoutId = setTimeout(() => controller.abort(), queryTimeLimit * 1000);

    try {
      const response = await fetch(uri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...httpHeaders,
        },
        body: JSON.stringify({ query, variables }),
        signal,
      });
  
      // Clear the timeout since the request completed
      clearTimeout(timeoutId);
  
      // Check for HTTP-level errors
      this.handleErrors(response);
  
      // Parse the JSON response
      const jsonResponse = await response.json();
      return jsonResponse;
    } catch (error) {
      clearTimeout(timeoutId);
  
      // If the fetch was aborted, throw a timeout error
      if (error.name === 'AbortError') {
        throw new Error('Query timed out');
      }

      // Otherwise, rethrow the original error
      throw new Error(error.message);
    }
  };
  
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
