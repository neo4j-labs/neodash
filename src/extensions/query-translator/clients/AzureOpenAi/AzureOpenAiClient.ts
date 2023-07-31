import { AzureKeyCredential, OpenAIClient } from '@azure/openai';

import { OpenAiClient } from '../OpenAi/OpenAiClient';

const consoleLogAsync = async (message: string, other?: any) => {
  await new Promise((resolve) => setTimeout(resolve, 0)).then(() => console.info(message, other));
};

export class AzureOpenAiClient extends OpenAiClient {
  modelType: string | undefined;

  createSystemMessage: any;

  modelClient!: OpenAIClient;

  driver: any;

  constructor(settings) {
    super(settings);
  }

  /**
   * Function used to create the OpenAiApi object.
   * */
  setModelClient() {
    if (typeof this.endpoint === 'string') {
      this.modelClient = new OpenAIClient(this.endpoint, new AzureKeyCredential(this.apiKey));
    }
  }

  async getListModels() {
    let res;
    try {
      if (!this.modelClient) {
        throw new Error('no client defined');
      }

      const response = await fetch(
        `${this.endpoint + (this.endpoint?.endsWith('/') ? '' : '/')}openai/deployments?api-version=2023-03-15-preview`,
        {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Api-Key': this.apiKey,
          },
        }
      );
      const req = await response.json();
      res = req.data.filter((x) => x.model.startsWith('gpt-')).map((x) => x.id);
    } catch (e) {
      consoleLogAsync('Error while loading the model list: ', e);
      res = [];
    }
    this.setListAvailableModels(res);
    return res;
  }

  async chatCompletion(history) {
    let completion;
    if (typeof this.modelType === 'string') {
      completion = await this.modelClient.getChatCompletions(this.modelType, history);
    }
    // If the status is correct
    if (completion?.choices?.[0]?.message || false) {
      let { message } = completion.choices[0];
      return message;
    }
    throw Error(`Request returned with status: ${completion.id}`);
  }
}
