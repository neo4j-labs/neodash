import { TroubleshootOutlined } from '@mui/icons-material';
import { Configuration, OpenAIApi } from 'openai';
import { nodePropsQuery, relPropsQuery, relQuery, reportTypesToDesc } from '../const';
import { ModelClient } from '../ModelClient';

const consoleLogAsync = async (message: string, other?: any) => {
  await new Promise((resolve) => setTimeout(resolve, 0)).then(() => console.info(message, other));
};

export class OpenAiClient implements ModelClient {
  apiKey: string;

  modelType: string | undefined;

  listAvailableModels: string[];

  createSystemMessage!: any;

  validateQuery!: any;

  modelClient!: OpenAIApi;

  driver: any;

  constructor(settings) {
    this.apiKey = settings.apiKey;
    this.listAvailableModels = [];
    this.setModelClient();
  }

  setModelClient() {
    const configuration = new Configuration({
      apiKey: this.apiKey,
    });
    this.modelClient = new OpenAIApi(configuration);
  }

  async authenticate(setIsAuthenticated) {
    try {
      let tmp = await this.getListModels();
      setIsAuthenticated(tmp.length > 0);
      return tmp.length > 0;
    } catch (e) {
      consoleLogAsync('Authentication went wrong: ', e);
      return false;
    }
  }

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
        await consoleLogAsync(`Error while running ${query}`, e);
      });
    return res;
  }

  async generateSchema(database) {
    let nodeProps = await this.queryDatabase(nodePropsQuery, database);
    let relProps = await this.queryDatabase(relPropsQuery, database);
    let rels = await this.queryDatabase(relQuery, database);
    return this.createSchemaText(nodeProps, relProps, rels);
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
  addUserMessage(content, reportType) {
    let finalMessage = `${content}. The Cypher RETURN clause must contained certain variables, in this case ${reportTypesToDesc[reportType]} Plain cypher code, no explanations and no unrequired symbols. Remember to respect the schema. `;
    return { role: 'user', content: finalMessage };
  }

  addSystemMessage(content) {
    return { role: 'assistant', content: content };
  }

  // updateMessageHistory(message) {
  //   this.messages.push(message);
  //   this.setMessages(this.messages);
  // }

  async chatCompletion(
    content,
    messages,
    database,
    reportType,
    setResponse = (res) => {
      console.log(res);
    }
  ) {
    try {
      if (messages.length == 0) {
        let schema = await this.generateSchema(database);
        this.addSystemMessage(this.getSystemMessage(schema));
      }
      if (this.apiKey) {
        this.addUserMessage(content, reportType);

        const completion = await this.modelClient.createChatCompletion({
          model: this.modelType,
          messages: messages,
        });

        // If the status is correct
        if (
          completion.status == 200 &&
          completion.data &&
          completion.data.choices &&
          completion.data.choices[0].message
        ) {
          let { message } = completion.data.choices[0];
          this.updateMessageHistory(message);
          setResponse(message.content);
        } else {
          throw Error(`Request returned with status: ${completion.status}`);
        }
      } else {
        throw Error('api key not present');
      }
    } catch (error) {
      setResponse(!this.apiKey ? 'key not present' : `${error}`);
      await consoleLogAsync('error during query', error);
    } finally {
      // TODO: trigger availability of the card (we should stop clicking on the card to prevent strange misconfigurations here)
      await consoleLogAsync('done', this);
    }
  }
}
