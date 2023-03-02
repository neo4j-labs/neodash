import { MutableRefObject } from 'react';

/**
 * A mapping between human-readable layout names, and the ones used by the library.
 */
export const layouts = {
  'force-directed': undefined,
  tree: 'td',
  radial: 'radialout',
};

type Layout = 'td' | 'bu' | 'lr' | 'rl' | 'radialout' | 'radialin';

export const defaultNodeColor = 'lightgrey'; // Color of nodes without labels

/**
 * A node or relationship as selected in the graph.
 */
export interface GraphEntity {
  labels: string[];
  mainLabel: string; // The main label assigned to this node.
  type: string;
  properties: any;
  id: string;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
  width?: number;
  source?: GraphEntity;
  target?: GraphEntity;
}

/**
 * The set of properties a graph visualization component (and its peripheral components) expects.
 */
export interface GraphChartVisualizationProps {
  data: {
    nodes: any[];
    nodeLabels: Record<string, any>;
    links: any[];
    linkTypes: Record<string, any>;
    parameters: Record<string, any>;
    appendNode: any;
    editNode: any;
    deleteNode: any;
    editLink: any;
    deleteLink: any;
    setGraph: any;
    setNodes: any;
    setLinks: any;
    setNodeLabels: any;
    setLinkTypes: any;
  };
  style: {
    width: number;
    height: number;
    backgroundColor: any;
    linkDirectionalParticles?: number;
    linkDirectionalParticleSpeed: number;
    nodeLabelFontSize: any;
    nodeLabelColor: any;
    relLabelFontSize: any;
    relLabelColor: any;
    defaultNodeSize: any;
    nodeIcons: any;
    colorScheme: any;
    nodeColorProp: any;
    defaultNodeColor: any;
    nodeSizeProp: any;
    relWidthProp: any;
    defaultRelWidth: any;
    relColorProp: any;
    defaultRelColor: any;
  };
  engine: {
    layout: Layout;
    queryCallback: any;
    cooldownTicks: number;
    setCooldownTicks: any;
    firstRun: boolean;
    setFirstRun: any;
    selection: any;
  };
  interactivity: {
    layoutFrozen: boolean;
    setLayoutFrozen: React.Dispatch<React.SetStateAction<boolean>>;
    nodePositions: Record<string, any>;
    setNodePositions: any;
    showPropertiesOnHover: boolean;
    showPropertiesOnClick: boolean;
    showPropertyInspector: boolean;
    setPropertyInspectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
    createNotification: any;
    fixNodeAfterDrag: boolean;
    onNodeClick: any;
    onNodeRightClick: any;
    onRelationshipClick: any;
    onRelationshipRightClick: any;
    setGlobalParameter: any;
    handleExpand: any;
    zoomToFit?: any;
    drilldownLink: string;
    selectedEntity?: GraphEntity;
    setSelectedEntity: any;
    contextMenuOpen: any;
    setContextMenuOpen: any;
    clickPosition: any;
    setClickPosition: any;
  };
  extensions: {
    styleRules: any;
    actionsRules: any;
  };
}
