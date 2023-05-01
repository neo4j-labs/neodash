import { NODE_SIDEBAR_ACTION_PREFIX } from './sidebar/state/SidebarActions';
import { sidebarReducer } from './sidebar/state/SidebarReducer';
import { WORKFLOWS_ACTION_PREFIX } from './workflows/state/WorkflowActions';
import { workflowReducer } from './workflows/state/WorkflowReducer';
import NeoWorkflowDrawerButton from './workflows/component/WorkflowDrawerButton';
import SidebarDrawerButton from './sidebar/SidebarDrawerButton';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

// TODO: continue documenting interface
interface Extension {
  name: string;
  label: string;
  author: string;
  image: string;
  enabled: string;
  description: string;
  link: string;
  reducerPrefix: string;
  reducerObject: ReactJSXElement;
  drawerButton: ReactJSXElement;
}

// TODO: define extension config interface
export const EXTENSIONS = {
  'advanced-charts': {
    name: 'advanced-charts',
    label: 'Advanced Visualizations',
    author: 'Neo4j Labs',
    image: 'advanced-visualizations.png',
    enabled: true,
    description:
      'Advanced visualizations let you take your dashboard to the next level. This extension adds a sankey chart to visualize flows, three charts to plot hierarchical data (Sunburst, Circle Packing, Treemap). A Gauge Chart to show percentages, a Radar chart to show radial data, and an Area map to visualize country-data.',
    link: 'https://neo4j.com/labs/neodash/2.2/user-guide',
  },
  'rule-based-styling': {
    name: 'styling',
    label: 'Rule-Based Styling',
    author: 'Neo4j Labs',
    image: 'rule-based-styling.png',
    enabled: true,
    description:
      "The rule-based styling extension allows users to dynamically color elements in a visualization based on output values. This can be applied to tables, graphs, bar charts, line charts, and more. To use the extension, click on the 'rule-based styling' icon inside the settings of a report.",
    link: 'https://neo4j.com/labs/neodash/2.2/user-guide',
  },
  'report-actions': {
    name: 'actions',
    label: 'Report Actions',
    author: 'Neo4j Professional Services',
    image: 'report-actions.png',
    enabled: true,
    description:
      'Report actions let dashboard builders add extra interactivity into dashboards. For example, setting parameter values when a cell in a table or a node in a graph is clicked. To learn more about this extension, reach out to Neo4j Professional Services.',
    link: 'https://neo4j.com/professional-services/',
  },
  'node-sidebar': {
    name: 'node-sidebar',
    label: 'Node Sidebar',
    author: 'Neo4j Professional Services',
    image: 'https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder.png', // TODO: Fix placeholder image.
    enabled: true,
    reducerPrefix: NODE_SIDEBAR_ACTION_PREFIX,
    reducerObject: sidebarReducer,
    drawerButton: SidebarDrawerButton,
    description:
      'The node sidebar allows you to create a customer drawer on the side of the page. This drawer will contain nodes from the graph, which can be inspected, and drilled down into by setting dashboard parameters.',
    link: 'https://neo4j.com/professional-services/',
  },
  workflows: {
    name: 'workflows',
    label: 'Cypher Workflows',
    author: 'Neo4j Professional Services',
    image: 'https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder.png', // TODO: Fix placeholder image.
    enabled: true,
    reducerPrefix: WORKFLOWS_ACTION_PREFIX,
    reducerObject: workflowReducer,
    drawerButton: NeoWorkflowDrawerButton,
    description: 'An extension to create, manage, and run workflows consisting of Cypher queries.',
    link: 'https://neo4j.com/professional-services/',
  },
};

/**
 * At the start of the application, we want to collect programmatically the mapping an extension and its reducer.
 * @returns
 */
function getExtensionReducers() {
  let recuders = {};
  Object.values(EXTENSIONS).forEach((extension) => {
    try {
      if (extension.reducerPrefix && extension.reducerObject) {
        let reducer = { name: extension.name, reducer: extension.reducerObject };
        recuders[extension.reducerPrefix] = reducer;
      }
    } catch (e) {
      console.log(`Something wrong happened while loading the Extension Reducer: ${e}`);
    }
  });
  return recuders;
}

/**
 * At the start of the application, we want to collect programmatically the buttons that will be in the drawer.
 * @returns
 */
function getExtensionDrawerButtons() {
  let buttons = {};
  Object.values(EXTENSIONS).forEach((extension) => {
    try {
      if (extension.drawerButton) {
        buttons[extension.name] = extension.drawerButton;
      }
    } catch (e) {
      console.log(`Something wrong happened while loading the drawer extension : ${e}`);
    }
  });
  return buttons;
}

export const EXTENSIONS_REDUCERS = getExtensionReducers();
export const EXTENSIONS_DRAWER_BUTTONS = getExtensionDrawerButtons();
