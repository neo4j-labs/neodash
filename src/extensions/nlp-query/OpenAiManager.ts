import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { REPORT_TYPES } from '../../config/ReportConfig';
import { nodePropsQuery, relPropsQuery, relQuery } from './queries';

const consoleLogAsync = async (message: string, other?: any) => {
  await new Promise((resolve) => setTimeout(resolve, 0)).then(() => console.info(message, other));
};

export class OpenAiClient {
  messages: Array<ChatCompletionRequestMessage>;

  apiKey: string;

  openai: OpenAIApi;

  driver;

  setMessages;

  database;

  nodeProps;

  relProps;

  rels;

  schemaText;

  reportType: string;

  constructor(apiKey, messages = [], setMessages, driver, database, reportType) {
    this.messages = messages;
    this.setMessages = setMessages;
    this.apiKey = apiKey;
    if (apiKey) {
      this.updateApiKey(apiKey);
    }
    this.driver = driver;
    this.database = database;
    this.generateSchema();
    this.updateReportType(reportType);
  }

  updateReportType(reportType) {
    this.reportType = REPORT_TYPES[reportType].label;
  }

  resetClient() {
    this.messages = [];
    this.setMessages([]);
    this.generateSchema();
  }

  setNodeProps(props) {
    this.nodeProps = props;
  }

  setRelProps(props) {
    this.relProps = props;
  }

  setRels(props) {
    this.rels = props;
  }

  setSchemaText() {
    this.schemaText = `
    This is the schema representation of the Neo4j database.
    Node properties are the following:
    ${JSON.stringify(this.nodeProps)}
    Relationship properties are the following:
    ${JSON.stringify(this.relProps)}
    Relationship point from source to target nodes
    ${JSON.stringify(this.rels)}
    Make sure to respect relationship types and directions
    `;
  }

  async queryDatabase(query) {
    const session = this.driver.session({ database: this.database });
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

  async generateSchema() {
    this.setNodeProps(await this.queryDatabase(nodePropsQuery));
    this.setRelProps(await this.queryDatabase(relPropsQuery));
    this.setRels(await this.queryDatabase(relQuery));
    this.setSchemaText();
  }

  getSystemMessage() {
    return `
      Task: Generate Cypher queries to query a Neo4j graph database based on the provided schema definition. These queries will be used inside NeoDash reports.
      Documentation for NeoDash is here : https://neo4j.com/labs/neodash/2.2/
      Instructions:
      Use only the provided relationship types and properties.
      Do not use any other relationship types or properties that are not provided.
      The Cypher RETURN clause must contained certain variables, based on the report type asked for.
      Report types :
      Single Value - A single value of a single variable
      Pie Chart - Two variables named category and value
      Sankey - Three variables, two being a node object (and not a property value) and one representing a relationship object (and not a property value).
      Schema:
      ${this.schemaText}
    `;
  }

  updateApiKey(apiKey) {
    this.apiKey = apiKey;
    const configuration = new Configuration({
      apiKey: apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  addUserMessage(content) {
    let finalMessage = `${content  }Report type: ${this.reportType}` + `Plain cypher code, no explanations.`;
    this.messages.push({ role: 'user', content: finalMessage });
  }

  addSystemMessage(content) {
    this.messages.push({ role: 'assistant', content: content });
  }

  updateMessageHistory(message) {
    this.messages.push(message);
    this.setMessages(this.messages);
  }

  async chatCompletion(
    content,
    setResponse = (res) => {
      console.log(res);
    }
  ) {
    await consoleLogAsync('this', this);
    try {
      if (this.messages.length == 0) {
        if (this.schemaText) {
          this.addSystemMessage(this.getSystemMessage());
        } else {
          await this.generateSchema();
          this.addSystemMessage(this.getSystemMessage());
        }
      }
      if (this.apiKey) {
        this.addUserMessage(content);

        const completion = await this.openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: this.messages,
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
      await consoleLogAsync('done', 'done');
    }
  }
}
