import {
  MAX_NUM_VALIDATION,
  nodePropsQuery,
  relPropsQuery,
  relQuery,
  schemaSamplingQuery,
  SCHEMA_SAMPLING_NUMBER,
  QUERY_TRANSLATOR_TASK,
} from './const';

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
   * Function used to create a schema representation to send to the model
   * @param nodeProps Labels and properties of the nodes in the database
   * @param relProps Properties of the relationships in the database
   * @param rels Patterns existing in the database
   * @returns Message representing the schema
   */
  createSchemaText(nodeProps, relProps, rels) {
    if (nodeProps.length == 0 && relProps.length == 0 && rels.length == 0) {
      throw Error(`Looks like there is no schema to fetch, are you sure this database is not empty?`);
    }
    let nodes = JSON.stringify(nodeProps);
    let relationshipsProps = JSON.stringify(relProps);
    let relationships = JSON.stringify(rels);
    return `
    This is the schema representation of the Neo4j database.
    Node properties are the following:
    ${nodes}
    Relationship properties are the following:
    ${relationshipsProps}
    Relationship point from source to target nodes
    ${relationships}
    Make sure to respect relationship types and directions
    `;
  }

  /**
   * Creates the schema message for the model in sampling mode (faster but less accurate)
   * @param database Name of the database which will provide the schema
   * @returns Message representing the schema
   */
  async generateSchemaSample(database) {
    let sample = await this.queryDatabase(schemaSamplingQuery, database, false, { sample: SCHEMA_SAMPLING_NUMBER });
    let { relationships, nodes, patterns } = sample[0];

    let nodesText = nodes ? nodes.split('\n').join(',') : '';
    let relText = relationships ? relationships.split('\n').join(',') : '';
    let patternsText = patterns ? patterns.split('\n').join(',') : '';

    let res = this.createSchemaText(nodesText, relText, patternsText);
    return res;
  }

  /**
   * Creates the schema message for the model in full reading mode (slower but 100% accurate)
   * @param database Name of the database which will provide the schema
   * @returns Message representing the schema
   */
  async generateSchema(database) {
    try {
      let nodeProps = await this.queryDatabase(nodePropsQuery, database);
      let relProps = await this.queryDatabase(relPropsQuery, database);
      let rels = await this.queryDatabase(relQuery, database);

      let schema = this.createSchemaText(nodeProps, relProps, rels);
      return schema;
    } catch (e) {
      throw Error(`Couldn't generate schema due to: ${e.message}`);
    }
  }

  getTaskDefinition(schemaText) {
    return `${QUERY_TRANSLATOR_TASK}
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

  getExamplePrompt(examples) {
    let res = `Here are some examples of questions and their answers: \n`;
    let tmp = examples.map((ex) => `Question: ${ex.question} \nAnswer: ${ex.answer} \n`);
    return res + tmp.join('');
  }

  async manageMessageHistory(database, schema, schemaSampling, inputMessage, history, reportType, examples) {
    // If empty, the first message will be the task definition
    if (history.length == 0) {
      // The schema can be fetched in full or in sample mode (the second one is faster but less accurate)
      schema = schemaSampling ? await this.generateSchemaSample(database) : await this.generateSchema(database);
      history.push(this.addSystemMessage(this.getTaskDefinition(schema)));
    }
    // The Examples are always refreshed and always in second position
    if (examples.length > 0) {
      history[1] = this.addSystemMessage(this.getExamplePrompt(examples));
    } else {
      history[1] = this.addSystemMessage('There are no examples provided.');
    }
    history.push(this.addUserMessage(inputMessage, reportType, true));
    return history;
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
    examples,
    onRetry = () => {
      // console.log(value);
    },
    schemaSampling = true // By default we create the schema message using apoc.meta.data in sampling mode
  ) {
    // Creating a copy of the history
    let newHistory = [...history];

    // Creating a tmp history to prevent updating the history with erroneous messages
    let tmpHistory = [...newHistory];
    let schema = '';
    let query = '';
    let modelAnswer = { role: '', content: '' };
    try {
      tmpHistory = await this.manageMessageHistory(
        database,
        schema,
        schemaSampling,
        inputMessage,
        tmpHistory,
        reportType,
        examples
      );

      let retries = 0;
      let isValidated = false;
      let errorMessage = '';

      // While is not validated and we didn't exceed the maximum retry number
      while (!isValidated && retries < MAX_NUM_VALIDATION) {
        retries += 1;
        onRetry(retries);

        // Get the answer to the question from the model
        modelAnswer = await this.chatCompletion(tmpHistory);
        tmpHistory.push(modelAnswer);

        // and try to validate it
        let validationResult = await this.validateQuery(modelAnswer, database);
        isValidated = validationResult[0];
        errorMessage = validationResult[1];

        // If you can't validate the query, send the model a message to try to fix it
        if (!isValidated) {
          tmpHistory.push(this.addErrorMessage(errorMessage));
        } else {
          newHistory = await this.manageMessageHistory(
            database,
            schema,
            schemaSampling,
            inputMessage,
            newHistory,
            reportType,
            examples
          );
          newHistory.push(modelAnswer);
          query = this.getMessageContent(modelAnswer);
        }
      }
      if (!isValidated) {
        throw Error(
          `The model could not translate your question to valid Cypher: '${inputMessage}'. \n
           The result from the model was: '${modelAnswer?.content ? modelAnswer.content : ''}'. \n
           Try writing a more descriptive question, explicitly calling out the node labels, relationship types, and property names. `
        );
      }
    } catch (error) {
      await consoleLogAsync('Error during query', error);
      throw error;
    }
    return [query, newHistory];
  }

  /**
   * Function to query the db directly from the client
   * @param query Query to run
   * @param database Selected database
   * @returns The records results if the query runs correctly, otherwise the function will throw an error
   */
  async queryDatabase(query, database, getFirstColumnOnly = true, parameters = {}) {
    if (this.driver) {
      const session = this.driver.session({ database: database });
      const transaction = session.beginTransaction({ timeout: 20 * 1000, connectionTimeout: 2000 });

      let res = await transaction
        .run(query, parameters)
        .then((res) => {
          const { records } = res;
          let elems = records.map((elem) => {
            return getFirstColumnOnly ? elem.toObject()[elem.keys[0]] : elem.toObject();
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
