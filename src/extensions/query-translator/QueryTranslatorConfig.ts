import { SELECTION_TYPES } from '../../config/CardConfig';
import { ModelClient } from './clients/ModelClient';
import { OpenAiClient } from './clients/OpenAi/OpenAiClient';

// TODO: implement VertexAiClient
import { VertexAiClient } from './clients/VertexAiClient';
import { AzureOpenAiClient } from './clients/AzureOpenAi/AzureOpenAiClient';

interface ClientSettingEntry {
  label: string;
  type: SELECTION_TYPES;
  default: any;
  authentication?: boolean; // Required for authentication, the user should insert all the required fields before trying to authenticate
  hasAuthButton?: boolean; // Append a button at the end of the selector to trigger an auth request.
  methodFromClient?: string; // String that contains the name of the client function to call to retrieve the data needed to fill the option
}

interface ClientSettings {
  apiKey: ClientSettingEntry;
  modelType: ClientSettingEntry;
  region?: ClientSettingEntry;
}

interface ClientConfig {
  clientName: string;
  clientClass: ModelClient;
  clientSettingsModal: JSX.Element;
  settings: ClientSettings;
}

interface AvailableClients {
  OpenAI: ClientConfig;
  vertexAi: ClientConfig;
}

interface QueryTranslatorConfig {
  availableClients: AvailableClients;
}

export const QUERY_TRANSLATOR_CONFIG: QueryTranslatorConfig = {
  availableClients: {
    OpenAI: {
      clientName: 'OpenAI',
      clientClass: OpenAiClient,
      settings: {
        apiKey: {
          label: 'OpenAI API Key',
          type: SELECTION_TYPES.TEXT,
          default: '',
          hasAuthButton: true,
          authentication: true,
        },
        modelType: {
          label: 'Model',
          type: SELECTION_TYPES.LIST,
          methodFromClient: 'getListModels',
          default: '',
          authentication: false,
        },
      },
    },
    AzureOpenAI: {
      clientName: 'AzureOpenAI',
      clientClass: AzureOpenAiClient,
      settings: {
        endpoint: {
          label: 'Azure OpenAI EndPoint',
          type: SELECTION_TYPES.TEXT,
          default: '',
          hasAuthButton: false,
          authentication: true,
        },
        apiKey: {
          label: 'Subscription Key',
          type: SELECTION_TYPES.TEXT,
          default: '',
          hasAuthButton: true,
          authentication: true,
        },
        modelType: {
          label: 'Model',
          type: SELECTION_TYPES.LIST,
          methodFromClient: 'getListModels',
          default: '',
          authentication: false,
        },
      },
    },
  },
};

/**
 * Function to get the extension config
 * @param extensionName Name of the desired extension
 * @returns Predefined fields of configuration for an extension
 */
export function getQueryTranslatorDefaultConfig(providerName) {
  return QUERY_TRANSLATOR_CONFIG.availableClients &&
    QUERY_TRANSLATOR_CONFIG.availableClients[providerName] &&
    QUERY_TRANSLATOR_CONFIG.availableClients[providerName].settings
    ? QUERY_TRANSLATOR_CONFIG.availableClients[providerName].settings
    : {};
}

/**
 * Given the provider and the settings in input, return the related client object
 * @param modelProvider Name of the provider (for example: OpenAi)
 * @param settings Dictionary that will be unpacked by the client itself
 * @returns Client object related to the provider
 */
export function getModelClientObject(modelProvider, settings) {
  let providerDetails = QUERY_TRANSLATOR_CONFIG.availableClients[modelProvider];
  if (providerDetails === undefined) {
    throw Error(`Invalid provider name${modelProvider}`);
  }
  let modelProviderClass = providerDetails.clientClass;
  return new modelProviderClass(settings);
}
