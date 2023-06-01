// A model client should just handle the communication
export interface ModelClient {
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
