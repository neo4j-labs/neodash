import React from 'react';
import { QUERY_TRANSLATOR_ACTION_PREFIX } from './text2cypher/state/QueryTranslatorActions';
import { queryTranslatorReducer } from './text2cypher/state/QueryTranslatorReducer';
import NeoOverrideCardQueryEditor from './text2cypher/component/OverrideCardQueryEditor';
import { translateQuery } from './text2cypher/util/Util';
import { GPT_LOADING_ICON } from './text2cypher/component/LoadingIcon';
import QueryTranslatorButton from './text2cypher/component/QueryTranslatorButton';
import RBACManagementLabelButton from './rbac/RBACManagementLabelButton';

// TODO: continue documenting interface
interface Extension {
  name: string;
  label: string;
  author: string;
  image: string;
  enabled: boolean;
  description: string;
  link: string;
  reducerPrefix?: string;
  reducerObject?: any;
  settingsMenuButton?: JSX.Element;
  cardSettingsComponent?: JSX.Element;
  settingsModal?: JSX.Element;
  prepopulateReportFunction?: any; // function
  customLoadingIcon?: JSX.Element;
}

// TODO: define extension config interface
export const EXTENSIONS: Record<string, Extension> = {
  'advanced-charts': {
    name: 'advanced-charts',
    label: 'Advanced Visualizations',
    author: 'Neo4j Labs',
    image: 'advanced-visualizations.png',
    enabled: true,
    description:
      'Advanced visualizations let you take your dashboard to the next level. This extension adds a sankey chart to visualize flows, three charts to plot hierarchical data (Sunburst, Circle Packing, Treemap). A Gauge Chart to show percentages, a Radar chart to show radial data, and an Area map to visualize country-data.',
    link: 'https://neo4j.com/labs/neodash/2.4/user-guide',
  },
  'rule-based-styling': {
    name: 'styling',
    label: 'Rule-Based Styling',
    author: 'Neo4j Labs',
    image: 'rule-based-styling.png',
    enabled: true,
    description:
      "The rule-based styling extension allows users to dynamically color elements in a visualization based on output values. This can be applied to tables, graphs, bar charts, line charts, and more. To use the extension, click on the 'rule-based styling' icon inside the settings of a report.",
    link: 'https://neo4j.com/labs/neodash/2.4/user-guide',
  },
  'report-actions': {
    name: 'actions',
    label: 'Report Actions',
    author: 'Neo4j Professional Services',
    image: 'report-actions.png',
    enabled: true,
    description:
      'Report actions let dashboard builders add extra interactivity into dashboards. For example, setting parameter values when a cell in a table or a node in a graph is clicked.',
    link: 'https://neo4j.com/professional-services/',
  },
  'query-translator': {
    name: 'query-translator',
    label: 'Text2Cypher: Natural Language Queries',
    author: 'Neo4j Professional Services',
    image: 'translator.png',
    enabled: true,
    reducerPrefix: QUERY_TRANSLATOR_ACTION_PREFIX,
    reducerObject: queryTranslatorReducer,
    cardSettingsComponent: NeoOverrideCardQueryEditor,
    prepopulateReportFunction: translateQuery,
    customLoadingIcon: GPT_LOADING_ICON,
    settingsMenuButton: QueryTranslatorButton,
    description:
      'Use natural language to generate Cypher queries in NeoDash. Connect to an LLM through an API, and let NeoDash use your database schema + the report types to generate queries automatically. This extension requires APOC Core installed inside Neo4j.',
    link: 'https://neo4j.com/professional-services/',
  },
  forms: {
    name: 'forms',
    label: 'Forms',
    author: 'Neo4j Professional Services',
    image: 'form.png',
    enabled: true,
    description:
      'Forms let you craft Cypher queries with multiple inputs, that are fired on demand. Using parameters from the dashboard, or form specific input, you will be able to trigger custom logic with forms.',
    link: 'https://neo4j.com/professional-services/',
  },
  'access-control-management': {
    name: 'access-control-management',
    label: 'Access Control Management',
    author: 'Neo4j Professional Services',
    image: 'accesscontrol2.jpg',
    enabled: true,
    description:
      'This extension lets you manage access control, letting you assign users to roles, as well as controlling which node labels can be read by a user.',
    link: 'https://neo4j.com/professional-services/',
    settingsMenuButton: RBACManagementLabelButton,
  },
};

/**
 * At the start of the application, we want to collect programmatically the mapping an extension and its reducer.
 * @returns
 */
function getExtensionReducers() {
  let reducers = {};
  Object.values(EXTENSIONS).forEach((extension) => {
    try {
      if (extension.reducerPrefix && extension.reducerObject) {
        let reducer = { name: extension.name, reducer: extension.reducerObject };
        reducers[extension.reducerPrefix] = reducer;
      }
    } catch (e) {
      console.log(`Something wrong happened while loading the Extension Reducer: ${e}`);
    }
  });
  return reducers;
}

/**
 * At the start of the application, we want to collect programmatically the buttons that will be in the drawer.
 * @returns
 */
function getExtensionDrawerButtons() {
  let buttons = {};
  Object.values(EXTENSIONS).forEach((extension) => {
    try {
      if (extension.settingsMenuButton) {
        buttons[extension.name] = extension.settingsMenuButton;
      }
    } catch (e) {
      console.log(`Something wrong happened while loading the drawer extension : ${e}`);
    }
  });
  return buttons;
}

/**
 * Gets components to inject inside the card settings content, before the Cypher query box.
 */
export function getExtensionCardSettingsComponents() {
  let components = {};
  Object.values(EXTENSIONS).forEach((extension) => {
    try {
      if (extension.cardSettingsComponent) {
        components[extension.name] = extension.cardSettingsComponent;
      }
    } catch (e) {
      console.log(`Something wrong happened while loading the extension components. : ${e}`);
    }
  });
  return components;
}

/**
 * At the start of the application, we want to collect programmatically the extensions that need to be added inside the SettingsModal.
 * @returns
 */
function getExtensionSettingsModal() {
  let modals = {};
  Object.values(EXTENSIONS).forEach((extension) => {
    try {
      if (extension.settingsModal) {
        modals[extension.name] = extension.settingsModal;
      }
    } catch (e) {
      console.log(`Something wrong happened while loading the Extensions settings modals  : ${e}`);
    }
  });
  return modals;
}

/**
 * At the start of the application, we want to collect programmatically the extensions that need to be added inside the SettingsModal.
 * @returns
 */
function getExtensionPrepopulateReportFunction() {
  let prepopulateFunctions = {};
  Object.values(EXTENSIONS).forEach((extension) => {
    try {
      if (extension.prepopulateReportFunction) {
        prepopulateFunctions[extension.name] = extension.prepopulateReportFunction;
      }
    } catch (e) {
      console.log(`Something wrong happened while loading the Extensions Prepolulation Report functions  : ${e}`);
    }
  });
  return prepopulateFunctions;
}

export const EXTENSIONS_REDUCERS = getExtensionReducers();
export const EXTENSIONS_DRAWER_BUTTONS = getExtensionDrawerButtons();
export const EXTENSIONS_SETTINGS_MODALS = getExtensionSettingsModal();
export const EXTENSIONS_CARD_SETTINGS_COMPONENT = getExtensionCardSettingsComponents();
export const EXTENSION_PREPOPULATE_REPORT_FUNCTION = getExtensionPrepopulateReportFunction();
