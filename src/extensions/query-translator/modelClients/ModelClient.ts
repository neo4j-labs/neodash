import { ChatCompletionRequestMessage } from 'openai';
import { Neo4jContextState } from 'use-neo4j/dist/neo4j.context';

// A model client should just handle the communication
export interface ModelClient {
  setDriver(driver: any): unknown;
  queryTranslation(
    message: string,
    messageHistory: ChatCompletionRequestMessage[],
    database: string,
    reportType: string
  ): Promise<ChatCompletionRequestMessage[]>;
  apiKey: string;
  setApiKey: any;
  modelType: string | undefined;
  listAvailableModels: string[];
  chatCompletion: any;
  createSystemMessage: any;
  addUserMessage: any;
  validateQuery: any;
  driver;
}

// to see if i need this
export enum ModelOperationState {
  RUNNING,
  DONE,
  ERROR,
}
