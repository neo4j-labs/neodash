import { MutableRefObject } from 'react';

/**
 * A mapping between human-readable layout names, and the ones used by the library.
 */
export const layouts = {
  'force-directed': undefined,
  tree: 'td',
  radial: 'radialout',
};

type DagMode = 'td' | 'bu' | 'lr' | 'rl' | 'radialout' | 'radialin';

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
    links: any[];
    parameters: Record<string, any>;
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
  };
  engine: {
    layout: any;
    queryCallback: any;
    setExtraRecords: any;
    firstRun: boolean;
    setFirstRun: any;
    selection: any;
  };
  interactivity: {
    layoutFrozen: boolean;
    setLayoutFrozen: React.Dispatch<React.SetStateAction<boolean>>;
    nodePositions: Record<string, any>;
    showPropertiesOnHover: boolean;
    showPropertiesOnClick: boolean;
    showPropertyInspector: boolean;
    setPropertyInspectorOpen: React.Dispatch<React.SetStateAction<boolean>>;
    fixNodeAfterDrag: boolean;
    handleExpand: any;
    drilldownLink: string;
    selectedEntity?: GraphEntity;
    setSelectedEntity: any;
  };
  extensions: {
    styleRules: any;
  };
}
