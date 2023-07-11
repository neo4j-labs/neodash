import { ChatMessage, AzureKeyCredential, OpenAIClient } from '@azure/openai';

import { ChatCompletionRequestMessageRoleEnum } from 'openai';
import { reportTypesToDesc, reportExampleQueries } from '../const';
import { ModelClient } from '../ModelClient';
import { Status } from '../../component/ClientSettings';

const consoleLogAsync = async (message: string, other?: any) => {
  await new Promise((resolve) => setTimeout(resolve, 0)).then(() => console.info(message, other));
};

export class AzureOpenAiClient extends ModelClient {
  modelType: string | undefined;

  createSystemMessage: any;

  modelClient!: OpenAIClient;

  driver: any;

  constructor(settings) {
    super(settings);
  }

  async validateQuery(message, database) {
    let query = message.content;
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
    if (typeof this.endpoint === 'string') {
      this.modelClient = new OpenAIClient(this.endpoint, new AzureKeyCredential(this.apiKey));
    }
  }

  async authenticate(
    setIsAuthenticated = (boolean) => {
      let x = boolean;
    }
  ) {
    try {
      let tmp = await this.getListModels();
      // Can be used in async mode without awaiting
      // by passing down a function to set the authentication result
      setIsAuthenticated(tmp.length > 0 ? Status.AUTHENTICATED : Status.ERROR);
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

      const response = await fetch(`${this.endpoint  }openai/deployments?api-version=2023-03-15-preview`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Api-Key': this.apiKey,
        },
      });
      const req = await response.json();
      return req.data.map((x) => x.id).filter((x) => x.includes('gpt-'));
    } catch (e) {
      consoleLogAsync('Error while loading the model list: ', e);
      res = [];
    }
    return res;
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

  /**
   * Function used to create a message sent from the user to the model.
   * @param content Content of the message (the message wrote from the UI)
   * @param reportType Type of report needed
   * @param plain If True, return content itself, otherwise the message with all the prompting needed.
   * @returns
   */
  addUserMessage(content, reportType, plain = false) {
    let queryExample = reportExampleQueries[reportType];
    let finalMessage = `${content}. Please use the following query structure as an example for ${reportTypesToDesc[reportType]}:
  ${queryExample} 
  Remember to respect the schema and remove any unnecessary comments or explanations from your result.`;
    return { role: ChatCompletionRequestMessageRoleEnum.User, content: plain ? content : finalMessage };
  }

  addSystemMessage(content) {
    return { role: ChatCompletionRequestMessageRoleEnum.System, content: content };
  }

  addAssistantMessage(content) {
    return { role: ChatCompletionRequestMessageRoleEnum.Assistant, content: content };
  }

  addErrorMessage(error) {
    // let finalMessage = `Please fix the query accordingly to this error: ${error}. Plain cypher code, no comments and no explanations and no unrequired symbols. Remember to respect the schema. Please remove any comment or explanation  from your result`;
    let finalMessage = `Error: ${error}. Please correct the query based on the provided error message. Ensure the query follows the expected format, adheres to the schema, and does not contain any comments, explanations, or unnecessary symbols. Please remove any comments or explanations from the query result.`;
    return { role: ChatCompletionRequestMessageRoleEnum.User, content: finalMessage };
  }

  getMessageContent(message: ChatMessage) {
    return message.content;
  }

  async chatCompletion(history) {
    let completion;
    if (typeof this.modelType === 'string') {
      completion = await this.modelClient.getChatCompletions(this.modelType, history);
    }
    // If the status is correct
    if (completion && completion.choices && completion.choices[0].message) {
      let { message } = completion.choices[0];
      return message;
    }
    throw Error(`Request returned with status: ${completion.id}`);
  }
}
