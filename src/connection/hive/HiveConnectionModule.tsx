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
import { QueryStatus } from '../interfaces';
import { LineCanvas } from '@nivo/line';
import { getEndpointUrl, getApiKey } from '../../extensions/graphql/state/GraphQLSelector';

const notImplementedError = (functionName: string): never => {
  throw new Error(`Not Implemented: ${functionName}`);
};

export class HiveConnectionModule extends ConnectionModule {
  cachedConfig = null;

  initialize = async (configJson: any): void => {
    this.cachedConfig = configJson;
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
    // console.log('driver: ', driver);
    let { language, query, formatExpand } = this.preprocessQuery(queryParams.query);
    if (language === 'graphql') {
      /*
    let graphql = query.match(/graphql:(.+)/);
    if (graphql) {
      graphql = graphql[1];
        let query = `
        query {
          recommendations(
            engineID: "movies-cold-start-4x"
            params: { startMovieTitle: "" }
            first: 20
            skip: 0
          ) {
            item
            score
          }
        }    
      `
      */
      let variables = {};
      let graphqlResponse = await this.runGraphQLQuery(endpointUrl, apiKey, query, variables);
      console.log('graphqlResponse: ', graphqlResponse);
      let { setRecords, setStatus } = callbacks;
      let recommendations = graphqlResponse?.data?.recommendations;
      let records = this.convertGraphQLResponseToRecords(recommendations, formatExpand);
      /*
      let records = [new Neo4jRecord(['count(n)'], [200])];
      */
      setRecords(records);
      setStatus(QueryStatus.COMPLETE);
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
        acc[tokens[0]?.trim()] = tokens[1]?.trim();
        return acc;
      }, {});

    let newQuery = lines.filter((line) => !line.startsWith('//')).join('\n');

    return {
      language: directives.language ? directives.language : 'cypher',
      formatExpand: this.processFormat(directives.formatExpand),
      query: newQuery,
    };
  };

  processFormat = (formatValue) => {
    if (formatValue) {
      return formatValue.split(',').map((x) => x.trim());
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

  convertGraphQLResponseToRecords = (recommendations, formatExpand) => {
    // formatExpand is expected to be an array of variables that return nodes
    //   e.g. formatExpand = ['item']
    //   any variable in the array will have its properties appear as keys and values in the Neo4jRecord

    return recommendations.map((recommendation) => {
      // console.log('recommendation: ', recommendation);

      let allKeys = [];
      let allValues = [];

      if (formatExpand && formatExpand.length > 0) {
        // let formatExpandStrings = formatExpand.split(',')
        formatExpand.forEach((key) => {
          let value = this.getNestedValue(recommendation, key);
          allKeys = allKeys.concat(key);
          allValues = allValues.concat(value);
        });
      } else {
        Object.keys(recommendation).forEach((key) => {
          allKeys.push(key);
          allValues.push(recommendation[key]);
        });
      }

      // Object.keys(recommendation).forEach((key) => {
      //   if (formatExpand.includes(key)) {
      //     let value = recommendation[key];
      //     allKeys = allKeys.concat(Object.keys(value));
      //     allValues = allValues.concat(Object.values(value));
      //   } else {
      //     allKeys.push(key);
      //     allValues.push(recommendation[key]);
      //   }
      // }, []);
      return new Neo4jRecord(allKeys, allValues);
    });

    /*
    return recommendations.map(recommendation => {
      return new Neo4jRecord(
          Object.keys(recommendation), 
          Object.values(recommendation)
      )
    })
    */
  };

  handleErrors = (response) => {
    if (!response.ok) {
      throw Error(`${response.status}: ${response.statusText}`);
    }
    return response;
  };

  runGraphQLQuery = async (endpointUrl, apiKey, query, variables): any => {
    let graphql = this.cachedConfig?.standaloneGraphql || {};

    // TODO: throw error if standaloneGraphql not configured

    let port = graphql.port ? `:${graphql.port}` : '';
    let uri = endpointUrl; // `${graphql.protocol}://${graphql.host}${port}${graphql.uri}`;
    let httpHeaders = {
      'api-key': apiKey,
    }; // graphql.httpHeaders || {};

    const promise = new Promise((resolve, reject) => {
      fetch(uri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...httpHeaders,
        },
        body: JSON.stringify({
          query: query,
          variables,
        }),
      })
        .then(this.handleErrors)
        .then(async (res) => {
          const jsonResponse = await res.json();
          resolve(jsonResponse);
        })
        .catch((error) => {
          reject(new Error(error.message));
        });
    });
    return promise;
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
