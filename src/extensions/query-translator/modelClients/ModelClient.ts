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

  constructor(settings) {
    this.apiKey = settings.apiKey;
    this.modelType = settings.modelType;
    this.listAvailableModels = [];
    this.setModelClient();
  }

  setModelClient() {
    notImplementedError('setModelClient');
  }

  async queryDatabase(query, database) {
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

  async validateQuery(_message, _database) {
    notImplementedError('validateQuery');
  }

  setDriver(driver: any) {
    this.driver = driver;
  }

  async queryTranslation(inputMessage, history, database, reportType) {
    // Creating a copy of the history
    let newHistory = [...history];

    try {
      if (history.length == 0) {
        let schema = await this.generateSchema(database);
        newHistory.push(this.addSystemMessage(this.getSystemMessage(schema)));
      }

      let tmpHistory = [...newHistory];
      tmpHistory.push(this.addUserMessage(inputMessage, reportType));

      let retries = 0;
      let isValidated = false;
      let errorMessage = '';
      // Creating a tmp history to prevent updating the history with erroneous messages
      // While is not validated and we didn't exceed the maximum retry number
      while (!isValidated && retries < MAX_NUM_VALIDATION) {
        retries += 1;
        // Get the answer to the question
        let newMessage = await this.chatCompletion(tmpHistory);
        tmpHistory.push(newMessage);
        await consoleLogAsync(`tmpHistory step: ${retries}`, tmpHistory);

        // and try to validate it
        let res = await this.validateQuery(newMessage, database);
        isValidated = res[0];
        errorMessage = res[1];
        if (!isValidated) {
          tmpHistory.push(this.addErrorMessage(errorMessage));
        } else {
          newHistory.push(this.addUserMessage(inputMessage, reportType, true));
          newHistory.push(newMessage);
        }
      }
      if (!isValidated) {
        throw Error(`The model couldn't translate your request: ${inputMessage}`);
      }
    } catch (error) {
      await consoleLogAsync('error during query', error);
    }
    return newHistory;
  }

  async chatCompletion(_history) {
    notImplementedError('chatCompletion');
  }

  // TODO: adapt to the new structure, no more persisting inside the object, passign everything down
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
export enum ModelOperationState {
  RUNNING,
  DONE,
  ERROR,
}
