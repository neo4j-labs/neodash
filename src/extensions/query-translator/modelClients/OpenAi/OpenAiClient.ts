import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from 'openai';
import { nodePropsQuery, MAX_NUM_VALIDATION, relPropsQuery, relQuery, reportTypesToDesc } from '../const';
import { ModelClient } from '../ModelClient';

const consoleLogAsync = async (message: string, other?: any) => {
  await new Promise((resolve) => setTimeout(resolve, 0)).then(() => console.info(message, other));
};

export class OpenAiClient implements ModelClient {
  apiKey: string;

  modelType: string | undefined;

  listAvailableModels: string[];

  createSystemMessage: any;

  modelClient!: OpenAIApi;

  driver: any;

  constructor(settings) {
    this.apiKey = settings.apiKey;
    this.modelType = settings.modelType;
    this.listAvailableModels = [];
    this.setModelClient();
  }

  async validateQuery(query, database) {
    let isValid = false;
    let errorMessage = '';
    try {
      let res = await this.queryDatabase(`EXPLAIN ${query}`, database);
      isValid = true;
    } catch (e) {
      isValid = false;
      errorMessage = e.message;
    }
    return [isValid, errorMessage];
  }

  /**
   * Function used to create the OpenAiApi object.
   * */
  setModelClient() {
    const configuration = new Configuration({
      apiKey: this.apiKey,
    });
    this.modelClient = new OpenAIApi(configuration);
  }

  /**
   *
   * @param setIsAuthenticated If defined, is a function used to set the authentication result (for example, set function of a state variable)
   * @returns True if we client can authenticate, False otherwise
   */
  async authenticate(
    setIsAuthenticated = (boolean) => {
      let x = boolean;
    }
  ) {
    try {
      let tmp = await this.getListModels();
      // Can be used in async mode without awaiting
      // by passing down a function to set the authentication result
      setIsAuthenticated(tmp.length > 0);
      return tmp.length > 0;
    } catch (e) {
      consoleLogAsync('Authentication went wrong: ', e);
      return false;
    }
  }

  /**
   *  Used also to check authentication
   * @returns list of models available for this client
   */
  async getListModels() {
    let res;
    try {
      if (!this.modelClient) {
        throw new Error('no client defined');
      }
      let req = await this.modelClient.listModels();
      // Extracting the names
      res = req.data.data.map((x) => x.id).filter((x) => x.includes('gpt-3.5'));
    } catch (e) {
      consoleLogAsync('Error while loading the model list: ', e);
      res = [];
    }
    return res;
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey;
    const configuration = new Configuration({
      apiKey: apiKey,
    });
    this.modelClient = new OpenAIApi(configuration);
  }

  setDriver(driver) {
    this.driver = driver;
  }

  setListAvailableModels(listModels) {
    this.listAvailableModels = listModels;
  }

  setModelType(modelType) {
    this.modelType = modelType;
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
    return `
    Task: Generate Cypher queries to query a Neo4j graph database based on the provided schema definition. These queries will be used inside NeoDash reports.
    Documentation for NeoDash is here : https://neo4j.com/labs/neodash/2.2/
    Instructions:
    Use only the provided relationship types and properties.
    Do not use any other relationship types or properties that are not provided.
    The Cypher RETURN clause must contained certain variables, based on the report type asked for.
    Report types :
    Table - Multiple variables representing property values of nodes and relationships.
    Graph - Multiple variables representing nodes objects and relationships objects inside the graph.
    Bar Chart - Two variables named category(a String value) and value(numeric value).
    Line Chart - Two numeric variables named x and y.
    Sunburst - Two variables named Path(list of strings) and value(a numerical value).
    Circle Packing - Two variables named Path(a list of strings) and value(a numerical value).
    Choropleth - Two variables named code(a String value) and value(a numerical value).
    Area Map - Two variables named code(a String value) and value(a numerical value).
    Treemap - Two variables named Path(a list of strings) and value(a numerical value).
    Radar Chart - Multiple variables representing property values of nodes and relationships.
    Sankey Chart - Three variables, two being a node object (and not a property value) and one representing a relationship object (and not a property value).
    Map - multiple variables representing nodes objects(should contain spatial propeties) and relationship objects.
    Single Value - A single value of a single variable.
    Gauge Chart - A single value of a single variable.
    Raw JSON - The Cypher query must return a JSON object that will be displayed as raw JSON data.
    Pie Chart - Two variables named category and value.
      Schema:
      ${schemaText}
    `;
  }

  // TODO: adapt to the new structure, no more persisting inside the object, passign everything down
  addUserMessage(content, reportType, plain = false) {
    let finalMessage = `${content}. The Cypher RETURN clause must contained certain variables, in this case ${reportTypesToDesc[reportType]} Plain cypher code, no explanations and no unrequired symbols. Remember to respect the schema. Please remove any comment or explanation  from your result `;
    return { role: ChatCompletionRequestMessageRoleEnum.User, content: plain ? content : finalMessage };
  }

  addSystemMessage(content) {
    return { role: ChatCompletionRequestMessageRoleEnum.Assistant, content: content };
  }

  addErrorMessage(error) {
    let finalMessage = `Please fix the query accordingly to this error: ${error}. Plain cypher code, no comments and no explanations and no unrequired symbols. Remember to respect the schema. Please remove any comment or explanation  from your result`;
    return { role: ChatCompletionRequestMessageRoleEnum.User, content: finalMessage };
  }

  async chatCompletion(history) {
    const completion = await this.modelClient.createChatCompletion({
      model: this.modelType,
      messages: history,
    });
    // If the status is correct
    if (completion.status == 200 && completion.data && completion.data.choices && completion.data.choices[0].message) {
      let { message } = completion.data.choices[0];
      return message;
    } 
      throw Error(`Request returned with status: ${completion.status}`);
    
  }

  async queryTranslation(inputMessage, history, database, reportType) {
    // Creating a copy of the history
    let newHistory: ChatCompletionRequestMessage[] = [...history];

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
        // and try to validate it
        let res = await this.validateQuery(newMessage.content, database);
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
}
