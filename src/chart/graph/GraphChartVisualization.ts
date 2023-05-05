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
  color?: string;
}

/**
 * The set of properties a graph visualization component (and its peripheral components) expects.
 * objects implementing this interface are passed around the different utility functions for the graph visualization.
 * TODO: Split the `GraphChartVisualizationProps` into sub-interfaces that can be passed down individually.
 */
export interface GraphChartVisualizationProps {
  /**
   * entries in 'data' are related to anything relevant for rendering the graph.
   * These are the nodes/relationships, but also their labels and types.
   * The data dictionary can be updated by calling any of the functions in the data entry.
   */
  data: {
    nodes: Node[];
    nodeLabels: Record<string, any>;
    links: Link[];
    linkTypes: Record<string, any>;
    parameters: Record<string, any>;
    setGraph: (nodes, links) => void;
    setNodes: (nodes) => void;
    setLinks: (links) => void;
    setNodeLabels: (labels) => void;
    setLinkTypes: (types) => void;
  };
  /**
   * The properties relevant for styling the graph.
   * Style is applied at the moment the data dictionary is generated.
   */
  style: {
    width: number;
    height: number;
    backgroundColor: any;
    linkDirectionalParticles?: number;
    linkDirectionalParticleSpeed: number;
    linkDirectionalArrowLength: number;
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
  /**
   * The keys in 'engine' are related to the graph rendering engine (force-directed layout) or the NeoDash query engine.
   */
  engine: {
    layout: Layout;
    queryCallback: (query: string, parameters: Record<string, any>, setRecords: any) => void;
    cooldownTicks: number;
    setCooldownTicks: (ticks: number) => void;
    selection: Record<string, any> | undefined;
    setSelection: (selection: Record<string, any>) => void;
    fields: any;
    setFields: ((fields: any) => void) | undefined;
    recenterAfterEngineStop: boolean;
    setRecenterAfterEngineStop: (value: boolean) => void;
  };
  /**
   * The entries in 'interactivity' handle the interactive elements of the visualization.
   * This includes handling click events, showing pop-ups, and more.
   * TODO: Split up interactivity user-settings and interactivity callbacks/functional variables.
   */
  interactivity: {
    enableExploration: boolean;
    enableEditing: boolean;
    layoutFrozen: boolean;
    setLayoutFrozen: React.Dispatch<React.SetStateAction<boolean>>;
    nodePositions: Record<string, any>;
    setNodePositions: (positions: any[]) => void;
    showPropertiesOnHover: boolean;
    showPropertiesOnClick: boolean;
    showPropertyInspector: boolean;
    setPropertyInspectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
    createNotification: ((title: string, message: string) => void) | undefined;
    fixNodeAfterDrag: boolean;
    onNodeClick: (node) => void;
    onNodeRightClick: (node, event) => void;
    onRelationshipClick: (rel) => void;
    onRelationshipRightClick: (rel, event) => void;
    setGlobalParameter?: (name: string, value: string) => void;
    handleExpand: (id, type, dir, properties) => void;
    zoomToFit: () => void;
    drilldownLink: string;
    selectedEntity?: GraphEntity;
    setSelectedEntity: (entity) => void;
    contextMenuOpen: boolean;
    setContextMenuOpen: (boolean) => void;
    clickPosition: Record<string, any>;
    setClickPosition: (pos) => void;
    setPageNumber: any;
    pageNames: [];
  };
  /**
   * entries in 'extensions' let users plug in extra functionality into the visualization based on enabled plugins.
   */
  extensions: {
    styleRules: any[];
    actionsRules: any[];
  };
}
