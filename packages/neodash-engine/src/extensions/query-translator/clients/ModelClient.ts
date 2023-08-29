import { MAX_NUM_VALIDATION, nodePropsQuery, relPropsQuery, relQuery, TASK_DEFINITION } from './const';

const notImplementedError = (functionName) => {
  throw new Error(`Not Implemented: ${functionName}`);
};
const consoleLogAsync = async (message: string, other?: any) => {
  await new Promise((resolve) => setTimeout(resolve, 0)).then(() => console.info(message, other));
};

// A model client should just handle the communication
export abstract class ModelClient {
  apiKey: string;

  modelType: string | undefined;

  listAvailableModels: string[];

  createSystemMessage: any;

  modelClient: any;

  driver: any;

  endpoint: string | undefined;

  constructor(settings) {
    this.apiKey = settings.apiKey;
    this.modelType = settings.modelType;
    this.listAvailableModels = [];
    this.endpoint = settings.endpoint;
    this.setModelClient();
  }

  setModelClient() {
    notImplementedError('setModelClient');
  }

  /**
   * Function to query the db directly from the client
   * @param query Query to run
   * @param database Selected database
   * @returns The records results if the query runs correctly, otherwise the function will throw an error
   */
  async queryDatabase(query, database) {
    if (this.driver) {
      const session = this.driver.session({ database: database });
      const transaction = session.beginTransaction({ timeout: 20 * 1000, connectionTimeout: 2000 });

      let res = await transaction
        .run(query, undefined)
        .then((res) => {
          const { records } = res;
          let elems = records.map((elem) => {
            return elem.toObject()[elem.keys[0]];
          });
          records.length > 0 ?? elems.unshift(records[0].keys);
          transaction.commit();
          return elems;
        })
        .catch(async (e) => {
          throw e;
        });
      return res;
    }
    throw new Error('Driver not present');
  }

  createSchemaText(nodeProps, relProps, rels) {
    return `
    This is the schema representation of the Neo4j database.
    Node properties are the following:
    ${JSON.stringify(nodeProps)}
    Relationship properties are the following:
    ${JSON.stringify(relProps)}
    Relationship point from source to target nodes
    ${JSON.stringify(rels)}
    Make sure to respect relationship types and directions
    `;
  }

  async generateSchema(database) {
    try {
      let nodeProps = await this.queryDatabase(nodePropsQuery, database);
      let relProps = await this.queryDatabase(relPropsQuery, database);
      let rels = await this.queryDatabase(relQuery, database);
      return this.createSchemaText(nodeProps, relProps, rels);
    } catch (e) {
      throw Error(`Couldn't generate schema due to: ${e.message}`);
    }
  }

  getSystemMessage(schemaText) {
    return `${TASK_DEFINITION}
      Schema:
      ${schemaText}
    `;
  }

  setDriver(driver: any) {
    this.driver = driver;
  }

  getMessageContent(_message: any) {
    notImplementedError('getMessageContent');
    return '';
  }

  /**
   * Method responsible to ask the model to translate the message.
   * @param inputMessage
   * @param history History of messages exchanged between a card and the model client
   * @param database Databased used from the report, it will be used to fetch the schema
   * @param reportType Type of report asking that requires the translation
   * @param setValidationStep Function to set the current validation step outside the function
   * @returns The new history to assign to the card. If there was no possibility of validating the query, the
   * method will return the same history passed in input
   */
  async queryTranslation(
    inputMessage,
    history,
    database,
    reportType,
    onRetry = (value) => {
      let x = value;
    }
  ) {
    // Creating a copy of the history
    let newHistory = [...history];
    // Creating a tmp history to prevent updating the history with erroneous messages
    let tmpHistory = [...newHistory];
    let schema = '';
    let query = '';
    try {
      // If empty, the first message will be the task definition
      if (tmpHistory.length == 0) {
        schema = await this.generateSchema(database);
        tmpHistory.push(this.addSystemMessage(this.getSystemMessage(schema)));
      }
      tmpHistory.push(this.addUserMessage(inputMessage, reportType));

      let retries = 0;
      let isValidated = false;
      let errorMessage = '';

      // While is not validated and we didn't exceed the maximum retry number
      while (!isValidated && retries < MAX_NUM_VALIDATION) {
        retries += 1;
        onRetry(retries);

        // Get the answer to the question
        let modelAnswer = await this.chatCompletion(tmpHistory);
        tmpHistory.push(modelAnswer);

        // and try to validate it
        let validationResult = await this.validateQuery(modelAnswer, database);
        isValidated = validationResult[0];
        errorMessage = validationResult[1];

        // If you can't validate the query, send the model a message to try to fix it
        if (!isValidated) {
          tmpHistory.push(this.addErrorMessage(errorMessage));
        } else {
          if (newHistory.length == 0 && schema) {
            newHistory.push(this.addSystemMessage(this.getSystemMessage(schema)));
          }
          newHistory.push(this.addUserMessage(inputMessage, reportType, true));
          newHistory.push(modelAnswer);
          query = this.getMessageContent(modelAnswer);
        }
      }
      if (!isValidated) {
        throw Error(
          `The model could not translate your question to valid Cypher: '${inputMessage}'.  Try writing a more descriptive question, explicitly calling out the node labels, relationship types, and property names.`
        );
      }
    } catch (error) {
      await consoleLogAsync('Error during query', error);
      throw error;
    }
    return [query, newHistory];
  }

  async validateQuery(_message, _database) {
    notImplementedError('validateQuery');
  }

  async chatCompletion(_history) {
    notImplementedError('chatCompletion');
  }

  addUserMessage(_content, _reportType, _plain = false) {
    notImplementedError('addUserMessage');
  }

  addSystemMessage(_content) {
    notImplementedError('addSystemMessage');
  }

  addAssistantMessage(_content) {
    notImplementedError('addAssistantMessage');
  }

  addErrorMessage(_error) {
    notImplementedError('addErrorMessage');
  }
}

// to see if i need this
export enum ModelConnectionState {
  RUNNING,
  DONE,
  ERROR,
}
