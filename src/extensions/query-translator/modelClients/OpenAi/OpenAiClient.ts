import { TroubleshootOutlined } from '@mui/icons-material';
import { Configuration, OpenAIApi } from 'openai';
import { ModelClient } from '../ModelClient';

const consoleLogAsync = async (message: string, other?: any) => {
  await new Promise((resolve) => setTimeout(resolve, 0)).then(() => console.info(message, other));
};

export class OpenAiClient implements ModelClient {
  apiKey: string;

  modelType: string | undefined;

  listAvailableModels: string[];

  chatCompletion!: any;

  createSystemMessage!: any;

  addUserMessage!: any;

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
      res = req.data.data.map((x) => x.id);
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
}
