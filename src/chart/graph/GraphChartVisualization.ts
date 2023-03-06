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
  properties: any;
  id: string;
}

export interface Node extends GraphEntity {
  labels: string[];
  mainLabel: string;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
}

export interface Link extends GraphEntity {
  type: string;
  width?: number;
  source?: Node;
  target?: Node;
}

/**
 * The set of properties a graph visualization component (and its peripheral components) expects.
 */
export interface GraphChartVisualizationProps {
  data: {
    nodes: Node[];
    nodeLabels: Record<string, any>;
    links: Link[];
    linkTypes: Record<string, any>;
    parameters: Record<string, any>;
    appendNode: (node) => void;
    editNode: (node) => void;
    deleteNode: (node) => void;
    editLink: (link) => void;
    deleteLink: (link) => void;
    setGraph: (nodes, links) => void;
    setNodes: (nodes) => void;
    setLinks: (links) => void;
    setNodeLabels: (labels) => void;
    setLinkTypes: (types) => void;
  };
  style: {
    width: number;
    height: number;
    backgroundColor: any;
    linkDirectionalParticles?: number;
    linkDirectionalParticleSpeed: number;
    nodeLabelFontSize: number;
    nodeLabelColor: string;
    relLabelFontSize: number;
    relLabelColor: string;
    defaultNodeSize: number;
    nodeIcons: Record<string, any>;
    colorScheme: Record<string, any>;
    nodeColorProp: string;
    defaultNodeColor: string;
    nodeSizeProp: string;
    relWidthProp: string;
    defaultRelWidth: number;
    relColorProp: string;
    defaultRelColor: string;
  };
  engine: {
    layout: Layout;
    queryCallback: (query: string, parameters: Record<string, any>, setRecords: any) => void;
    cooldownTicks: number;
    setCooldownTicks: (ticks: number) => void;
    selection: Record<string, any>;
    setSelection: (selection: Record<string, any>) => void;
    fields: string[][];
    setFields: (fields: string[][]) => void;
    recenterAfterEngineStop: boolean;
    setRecenterAfterEngineStop: (value: boolean) => void;
  };
  interactivity: {
    layoutFrozen: boolean;
    setLayoutFrozen: React.Dispatch<React.SetStateAction<boolean>>;
    nodePositions: Record<string, any>;
    setNodePositions: (positions: any[]) => void;
    showPropertiesOnHover: boolean;
    showPropertiesOnClick: boolean;
    showPropertyInspector: boolean;
    setPropertyInspectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
    createNotification: (title: string, message: string) => void;
    fixNodeAfterDrag: boolean;
    onNodeClick: (node) => void;
    onNodeRightClick: (node, event) => void;
    onRelationshipClick: (rel) => void;
    onRelationshipRightClick: (rel, event) => void;
    setGlobalParameter: (name: string, value: string) => void;
    handleExpand: (id, type, dir, properties) => void;
    zoomToFit: () => void;
    drilldownLink: string;
    selectedEntity?: GraphEntity;
    setSelectedEntity: (entity) => void;
    contextMenuOpen: boolean;
    setContextMenuOpen: (boolean) => void;
    clickPosition: Record<string, any>;
    setClickPosition: (pos) => void;
  };
  extensions: {
    styleRules: any[];
    actionsRules: any[];
  };
}
