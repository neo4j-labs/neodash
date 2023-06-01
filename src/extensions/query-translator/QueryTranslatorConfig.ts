import { SELECTION_TYPES } from '../../config/CardConfig';
import { ModelClient } from './modelClients/ModelClient';
import { OpenAiClient } from './modelClients/OpenAi/OpenAiClient';
import { VertexAiClient } from './modelClients/VertexAi/VertexAiClient';

interface ClientSettings {
  apiKey: any;
  modelType: any;
  region?: any;
}

interface ClientConfig {
  clientName: string;
  clientClass: ModelClient;
  clientSettingsModal: JSX.Element;
  settings: ClientSettings;
}

interface AvailableClients {
  openAi: ClientConfig;
  vertexAi: ClientConfig;
}

interface QueryTranslatorConfig {
  availableClients: AvailableClients;
}

export const QUERY_TRANSLATOR_CONFIG: QueryTranslatorConfig = {
  availableClients: {
    openAi: {
      clientName: 'openAi',
      clientClass: OpenAiClient,
      settings: {
        apiKey: {
          label: 'Api Key to authenticate the client',
          type: SELECTION_TYPES.TEXT,
          default: '',
          required: true,
        },
        modelType: {
          label: 'Select from the possible model types',
          type: SELECTION_TYPES.LIST,
          methodFromClient: 'getListModels',
          default: '',
        },
      },
    },
    // vertexAi: {
    //   clientName: "vertexAi",
    //   clientClass: VertexAiClient,
    //   settings: {
    //     apiKey: {
    //       label: 'Api Key to authenticate the client',
    //       type: SELECTION_TYPES.TEXT,
    //       default: '',
    //     },
    //     modelType: {
    //       label: 'Select from the possible model types',
    //       type: SELECTION_TYPES.LIST,
    //       needsStateValues: true,
    //       default: "Insert your Api Key first",
    //     },
    //     region: {
    //       label: 'GCP Region',
    //       type: SELECTION_TYPES.LIST,
    //       needsStateValues: true,
    //       default: [],
    //     }
    //   }
    // },
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
  let modelProviderClass = QUERY_TRANSLATOR_CONFIG.availableClients[modelProvider].clientClass;
  return new modelProviderClass(settings);
}
