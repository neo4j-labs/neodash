import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';

const consoleLogAsync = async (message: string, other?: any) => {
  await new Promise((resolve) => setTimeout(resolve, 0)).then(() => console.info(message, other));
};

export class OpenAiClient {
  messages: Array<ChatCompletionRequestMessage>;

  apiKey: string;

  openai: OpenAIApi;

  setMessages;

  constructor(apiKey, messages = [], setMessages) {
    this.messages = messages;
    this.setMessages = setMessages;
    this.apiKey = apiKey;
    if (apiKey) {
      this.updateApiKey(apiKey);
    }
  }

  updateApiKey(apiKey) {
    const configuration = new Configuration({
      apiKey: apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  addUserMessage(content) {
    this.messages.push({ role: 'user', content: content });
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
    try {
      if (this.apiKey) {
        this.addUserMessage(content);

        const completion = await this.openai.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: this.messages,
        });
        if (
          completion.status == 200 &&
          completion.data &&
          completion.data.choices &&
          completion.data.choices[0].message
        ) {
          let {message} = completion.data.choices[0];
          this.updateMessageHistory(message);
          setResponse(message.content);
          await consoleLogAsync('query', message.content);
          await consoleLogAsync('newHistory', this.messages);
        } else {
          throw Error(`Request returned with error: ${completion.status}`);
        }
      } else {
        throw Error('api key not present');
      }
    } catch (error) {
      setResponse(!this.apiKey ? 'key not present' : `${error}`);
      await consoleLogAsync('error during query', error);
    }
  }
}
