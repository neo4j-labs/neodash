import { NODE_SIDEBAR_ACTION_PREFIX, NODE_SIDEBAR_EXTENSION_NAME } from './alert/stateManagement/AlertActions';
import { alertReducer } from './alert/stateManagement/AlertReducer';
import { WORKFLOWS_ACTION_PREFIX, WORKFLOWS_EXTENSION_NAME } from './workflows/stateManagement/WorkflowActions';
import { workflowReducer } from './workflows/stateManagement/WorkflowReducer';

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
};
// TODO: Rename "alerts" to "node sidebar" (generic name).
EXTENSIONS[NODE_SIDEBAR_EXTENSION_NAME] = {
  name: NODE_SIDEBAR_EXTENSION_NAME,
  label: 'Node Sidebar',
  author: 'Neo4j Professional Services',
  // TODO: Fix placeholder image.
  image: 'https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder.png',
  enabled: true,
  reducerPrefix: NODE_SIDEBAR_ACTION_PREFIX,
  reducerObject: alertReducer,
  description:
    'The node sidebar allows you to create a customer drawer on the side of the page. This drawer will contain nodes from the graph, which can be inspected, and drilled down into by setting dashboard parameters.',
  link: 'https://neo4j.com/professional-services/',
};

EXTENSIONS[WORKFLOWS_EXTENSION_NAME] = {
  name: WORKFLOWS_EXTENSION_NAME,
  label: 'Cypher Workflows',
  author: 'Neo4j Professional Services',
  // TODO: Fix placeholder image.
  image: 'https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder.png',
  enabled: true,
  reducerPrefix: WORKFLOWS_ACTION_PREFIX,
  reducerObject: workflowReducer,
  description:
    'cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese cheese.',
  link: 'https://neo4j.com/professional-services/',
};

/**
 * At the startup of the application, we want to collect programmatically the mapping between reducer
 * @returns
 */
function getExtensionReducers() {
  console.log('etting extension reducers');
  let res = {};
  Object.values(EXTENSIONS).forEach((conf) => {
    if (conf.reducerPrefix && conf.reducerObject) {
      let tmp = { name: conf.name, reducer: conf.reducerObject };
      res[conf.reducerPrefix] = tmp;
    }
  });
  return res;
}

export const EXTENSIONS_REDUCERS = getExtensionReducers();
