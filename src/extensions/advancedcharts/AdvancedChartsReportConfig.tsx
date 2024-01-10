import React from 'react';
import { SELECTION_TYPES } from '../../config/CardConfig';
import NeoChoroplethMapChart from './chart/choropleth/ChoroplethMapChart';
import NeoCirclePackingChart from './chart/circlepacking/CirclePackingChart';
import NeoGaugeChart from './chart/gauge/GaugeChart';
import NeoSankeyChart from './chart/sankey/SankeyChart';
import NeoSunburstChart from './chart/sunburst/SunburstChart';
import NeoTreeMapChart from './chart/treemap/TreeMapChart';
import NeoRadarChart from './chart/radar/RadarChart';
import NeoAreaMapChart from './chart/areamap/AreaMapChart';
import NeoGanttChart from './chart/gantt/GanttChart';
import NeoGraphChart3D from './chart/graph3d/GraphChart3D';
import { objectMap, objMerge } from '../../utils/ObjectManipulation';
import { COMMON_REPORT_SETTINGS } from '../../config/ReportConfig';

export const _ADVANCED_REPORT_TYPES = {
  graph3d: {
    label: '3D Graph',
    helperText:
      'A 3D graph visualization will draw all returned nodes, relationships and paths... in three dimensions!',
    selection: {
      properties: {
        label: 'Node Properties',
        type: SELECTION_TYPES.NODE_PROPERTIES,
      },
    },
    useNodePropsAsFields: true,
    autoAssignSelectedProperties: true,
    component: NeoGraphChart3D,
    maxRecords: 1000,
    // The idea is to match a setting to its dependency, the operator represents the kind of relationship
    // between the different options (EX: if operator is false, then it must be the opposite of the setting it depends on)
    disabledDependency: { relationshipParticleSpeed: { dependsOn: 'relationshipParticles', operator: false } },
    settings: {
      nodeColorScheme: {
        label: 'Node Color Scheme',
        type: SELECTION_TYPES.LIST,
        values: [
          'neodash',
          'nivo',
          'category10',
          'accent',
          'dark2',
          'paired',
          'pastel1',
          'pastel2',
          'set1',
          'set2',
          'set3',
        ],
        default: 'neodash',
      },
      nodeLabelColor: {
        label: 'Node Label Color',
        type: SELECTION_TYPES.COLOR,
        default: 'black',
      },
      nodeLabelFontSize: {
        label: 'Node Label Font Size',
        type: SELECTION_TYPES.NUMBER,
        default: 3.5,
      },
      defaultNodeSize: {
        label: 'Node Size',
        type: SELECTION_TYPES.NUMBER,
        default: 2,
      },
      nodeSizeProp: {
        label: 'Node Size Property',
        type: SELECTION_TYPES.TEXT,
        default: 'size',
      },
      nodeColorProp: {
        label: 'Node Color Property',
        type: SELECTION_TYPES.TEXT,
        default: 'color',
      },
      defaultRelColor: {
        label: 'Relationship Color',
        type: SELECTION_TYPES.TEXT,
        default: '#a0a0a0',
      },
      defaultRelWidth: {
        label: 'Relationship Width',
        type: SELECTION_TYPES.NUMBER,
        default: 1,
      },
      relLabelColor: {
        label: 'Relationship Label Color',
        type: SELECTION_TYPES.TEXT,
        default: '#a0a0a0',
      },
      relLabelFontSize: {
        label: 'Relationship Label Font Size',
        type: SELECTION_TYPES.NUMBER,
        default: 2.75,
      },
      relColorProp: {
        label: 'Relationship Color Property',
        type: SELECTION_TYPES.TEXT,
        default: 'color',
      },
      relWidthProp: {
        label: 'Relationship Width Property',
        type: SELECTION_TYPES.TEXT,
        default: 'width',
      },
      relationshipParticles: {
        label: 'Animated particles on Relationships',
        type: SELECTION_TYPES.LIST,
        default: false,
        values: [false, true],
      },
      relationshipParticleSpeed: {
        label: 'Speed of the particle animation',
        type: SELECTION_TYPES.NUMBER,
        default: 0.005,
      },
      arrowLengthProp: {
        label: 'Arrow head size',
        type: SELECTION_TYPES.NUMBER,
        default: 3,
      },
      layout: {
        label: 'Graph Layout (experimental)',
        type: SELECTION_TYPES.LIST,
        values: ['force-directed', 'tree-top-down', 'tree-bottom-up', 'tree-left-right', 'tree-right-left', 'radial'],
        default: 'force-directed',
      },
      graphDepthSep: {
        label: 'Tree layout level distance',
        type: SELECTION_TYPES.NUMBER,
        default: 30,
      },
      enableExploration: {
        label: 'Enable graph exploration',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      enableEditing: {
        label: 'Enable graph editing',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      showPropertiesOnHover: {
        label: 'Show pop-up on Hover',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      showPropertiesOnClick: {
        label: 'Show properties on Click',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      drilldownLink: {
        label: 'Drilldown Icon Link',
        type: SELECTION_TYPES.TEXT,
        placeholder: 'https://bloom.neo4j.io',
        default: '',
      },
      allowDownload: {
        label: 'Enable CSV Download',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      hideSelections: {
        label: 'Hide Property Selection',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      rightClickToExpandNodes: {
        label: 'Right Click to Expand Nodes',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
    },
  },
  gauge: {
    label: 'Gauge Chart',
    component: NeoGaugeChart,
    helperText: (
      <div>
        A gauge chart expects a single <code>value</code>.
      </div>
    ),
    maxRecords: 1,
    selection: {
      value: {
        label: 'Value',
        type: SELECTION_TYPES.NUMBER,
        key: true,
      },
    },
    withoutFooter: true,
    settings: {
      backgroundColor: {
        label: 'Background Color',
        type: SELECTION_TYPES.COLOR,
        default: '#fafafa',
      },
      nrOfLevels: {
        label: 'Number of levels',
        type: SELECTION_TYPES.NUMBER,
        default: 3,
      },
      arcsLength: {
        label: 'Comma-separated length of each arc',
        type: SELECTION_TYPES.TEXT,
        default: '0.15, 0.55, 0.3',
      },
      arcPadding: {
        label: 'Arc padding',
        type: SELECTION_TYPES.TEXT,
        default: '0.02',
      },
      colors: {
        label: 'Comma-separated arc colors',
        type: SELECTION_TYPES.TEXT,
        default: '#5BE12C, #F5CD19, #EA4228',
      },
      textColor: {
        label: 'Color of the text',
        type: SELECTION_TYPES.TEXT,
        default: 'black',
      },
      animDelay: {
        label: 'Delay in ms before needle animation',
        type: SELECTION_TYPES.NUMBER,
        default: 0,
      },
      animateDuration: {
        label: 'Duration in ms for needle animation',
        type: SELECTION_TYPES.NUMBER,
        default: 2000,
      },
      marginLeft: {
        label: 'Margin Left (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 24,
      },
      marginRight: {
        label: 'Margin Right (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 24,
      },
      marginTop: {
        label: 'Margin Top (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 40,
      },
      marginBottom: {
        label: 'Margin Bottom (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 40,
      },
    },
  },
  sunburst: {
    label: 'Sunburst Chart',
    component: NeoSunburstChart,
    useReturnValuesAsFields: true,
    helperText: (
      <div>
        A Sunburst chart expects two fields: a <code>path</code> (list of strings) and a <code>value</code>.
      </div>
    ),
    selection: {
      index: {
        label: 'Path',
        type: SELECTION_TYPES.LIST,
      },
      value: {
        label: 'Value',
        type: SELECTION_TYPES.NUMBER,
        key: true,
      },
      key: {
        label: 'Inline',
        type: SELECTION_TYPES.LIST,
        optional: true,
      },
    },
    maxRecords: 3000,
    settings: {
      backgroundColor: {
        label: 'Background Color',
        type: SELECTION_TYPES.COLOR,
        default: '#fafafa',
      },
      enableArcLabels: {
        label: 'Show Values on Arcs',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      interactive: {
        label: 'Enable interactivity',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      colors: {
        label: 'Color Scheme',
        type: SELECTION_TYPES.LIST,
        values: ['nivo', 'category10', 'accent', 'dark2', 'paired', 'pastel1', 'pastel2', 'set1', 'set2', 'set3'],
        default: 'set2',
      },
      borderWidth: {
        label: 'Arc border width (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 0,
      },
      marginLeft: {
        label: 'Margin Left (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 24,
      },
      marginRight: {
        label: 'Margin Right (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 24,
      },
      marginTop: {
        label: 'Margin Top (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 24,
      },
      marginBottom: {
        label: 'Margin Bottom (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 40,
      },
      arcLabelsSkipAngle: {
        label: 'Minimum Arc Angle for Label (degrees)',
        type: SELECTION_TYPES.NUMBER,
        default: 10,
      },
      cornerRadius: {
        label: 'Slice Corner Radius',
        type: SELECTION_TYPES.NUMBER,
        default: 3,
      },
      inheritColorFromParent: {
        label: 'Inherit color from parent',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
    },
  },
  circlePacking: {
    label: 'Circle Packing',
    component: NeoCirclePackingChart,
    useReturnValuesAsFields: true,
    helperText: (
      <div>
        A circle packing chart expects two fields: a <code>path</code> (list of strings) and a <code>value</code>.
      </div>
    ),
    selection: {
      index: {
        label: 'Path',
        type: SELECTION_TYPES.LIST,
      },
      value: {
        label: 'Value',
        type: SELECTION_TYPES.NUMBER,
        key: true,
      },
      key: {
        label: 'Inline',
        type: SELECTION_TYPES.LIST,
        optional: true,
      },
    },
    maxRecords: 3000,
    settings: {
      backgroundColor: {
        label: 'Background Color',
        type: SELECTION_TYPES.COLOR,
        default: '#fafafa',
      },
      interactive: {
        label: 'Enable interactivity',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      colors: {
        label: 'Color Scheme',
        type: SELECTION_TYPES.LIST,
        values: ['nivo', 'category10', 'accent', 'dark2', 'paired', 'pastel1', 'pastel2', 'set1', 'set2', 'set3'],
        default: 'set2',
      },
      showLabels: {
        label: 'Show Circle Labels',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      borderWidth: {
        label: 'Circle border width (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 0,
      },
      marginLeft: {
        label: 'Margin Left (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 24,
      },
      marginRight: {
        label: 'Margin Right (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 24,
      },
      marginTop: {
        label: 'Margin Top (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 24,
      },
      marginBottom: {
        label: 'Margin Bottom (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 40,
      },
    },
  },
  treeMap: {
    label: 'Treemap',
    component: NeoTreeMapChart,
    useReturnValuesAsFields: true,
    helperText: (
      <div>
        A Tree Map chart expects two fields: a <code>path</code> (list of strings) and a <code>value</code>.
      </div>
    ),
    selection: {
      index: {
        label: 'Path',
        type: SELECTION_TYPES.LIST,
      },
      value: {
        label: 'Value',
        type: SELECTION_TYPES.NUMBER,
        key: true,
      },
      key: {
        label: 'Inline',
        type: SELECTION_TYPES.LIST,
        optional: true,
      },
    },
    maxRecords: 3000,
    settings: {
      backgroundColor: {
        label: 'Background Color',
        type: SELECTION_TYPES.COLOR,
        default: '#fafafa',
      },
      interactive: {
        label: 'Enable interactivity',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      colors: {
        label: 'Color Scheme',
        type: SELECTION_TYPES.LIST,
        values: ['nivo', 'category10', 'accent', 'dark2', 'paired', 'pastel1', 'pastel2', 'set1', 'set2', 'set3'],
        default: 'set2',
      },
      borderWidth: {
        label: 'Rectangle border width (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 0,
      },
      marginLeft: {
        label: 'Margin Left (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 24,
      },
      marginRight: {
        label: 'Margin Right (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 24,
      },
      marginTop: {
        label: 'Margin Top (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 24,
      },
      marginBottom: {
        label: 'Margin Bottom (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 40,
      },
    },
  },
  sankey: {
    label: 'Sankey Chart',
    component: NeoSankeyChart,
    useNodePropsAsFields: true,
    autoAssignSelectedProperties: true,
    ignoreLabelColors: true,
    helperText: (
      <div>
        A Sankey chart expects Neo4j <code>nodes</code> and <code>weighted relationships</code>.
      </div>
    ),
    selection: {
      nodeProperties: {
        label: 'Node Properties',
        type: SELECTION_TYPES.NODE_PROPERTIES,
      },
    },
    maxRecords: 250,
    settings: {
      backgroundColor: {
        label: 'Background Color',
        type: SELECTION_TYPES.COLOR,
        default: '#fafafa',
      },
      legend: {
        label: 'Show legend',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      interactive: {
        label: 'Enable interactivity',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      layout: {
        label: 'Sankey layout',
        type: SELECTION_TYPES.LIST,
        values: ['horizontal', 'vertical'],
        default: 'horizontal',
      },
      colors: {
        label: 'Color Scheme',
        type: SELECTION_TYPES.LIST,
        values: ['nivo', 'category10', 'accent', 'dark2', 'paired', 'pastel1', 'pastel2', 'set1', 'set2', 'set3'],
        default: 'set2',
      },
      labelPosition: {
        label: 'Control sankey label position',
        type: SELECTION_TYPES.LIST,
        values: ['inside', 'outside'],
        default: 'inside',
      },
      labelOrientation: {
        label: 'Control sankey label orientation',
        type: SELECTION_TYPES.LIST,
        values: ['horizontal', 'vertical'],
        default: 'horizontal',
      },
      nodeBorderWidth: {
        label: 'Node border width (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 0,
      },
      marginLeft: {
        label: 'Margin Left (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 24,
      },
      marginRight: {
        label: 'Margin Right (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 24,
      },
      marginTop: {
        label: 'Margin Top (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 24,
      },
      marginBottom: {
        label: 'Margin Bottom (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 40,
      },
      labelProperty: {
        label: 'Relationship value Property',
        type: SELECTION_TYPES.TEXT,
        default: 'value',
      },
      nodeThickness: {
        label: 'Node thickness (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 18,
      },
      nodeSpacing: {
        label: 'Spacing between nodes at an identical level (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 18,
      },
    },
  },
  choropleth: {
    label: 'Choropleth Map',
    component: NeoChoroplethMapChart,
    useReturnValuesAsFields: true,
    helperText: (
      <div>
        A Choropleth Map chart expects two fields: a <code>country code</code> (three-letter code) and a
        <code>value</code>.
      </div>
    ),
    selection: {
      index: {
        label: 'Code',
        type: SELECTION_TYPES.TEXT,
      },
      value: {
        label: 'Value',
        type: SELECTION_TYPES.NUMBER,
        key: true,
      },
      key: {
        label: 'code',
        type: SELECTION_TYPES.TEXT,
        optional: true,
      },
    },
    maxRecords: 300,
    settings: {
      matchAccessor: {
        label: 'Country code format',
        type: SELECTION_TYPES.LIST,
        values: ['iso_a3', 'iso_a2', 'iso_n3'],
        default: 'iso_a3',
      },
      backgroundColor: {
        label: 'Background Color',
        type: SELECTION_TYPES.COLOR,
        default: '#fafafa',
      },
      interactive: {
        label: 'Enable Interactivity',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      legend: {
        label: 'Show Legend',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      colors: {
        label: 'Color Scheme',
        type: SELECTION_TYPES.LIST,
        values: ['nivo', 'BrBG', 'RdYlGn', 'YlOrRd', 'greens'],
        default: 'nivo',
      },
      borderWidth: {
        label: 'Polygon Border Width (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 0,
      },
      marginLeft: {
        label: 'Margin Left (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 24,
      },
      marginRight: {
        label: 'Margin Right (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 24,
      },
      marginTop: {
        label: 'Margin Top (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 24,
      },
      marginBottom: {
        label: 'Margin Bottom (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 40,
      },
      projectionScale: {
        label: 'Projection Scale',
        type: SELECTION_TYPES.NUMBER,
        default: 100,
      },
      projectionTranslationX: {
        label: 'Projection X translation',
        type: SELECTION_TYPES.NUMBER,
        default: 0.5,
      },
      projectionTranslationY: {
        label: 'Projection Y translation',
        type: SELECTION_TYPES.NUMBER,
        default: 0.5,
      },
      labelProperty: {
        label: 'Tooltip Property',
        type: SELECTION_TYPES.TEXT,
        default: 'properties.name',
      },
    },
  },
  radar: {
    label: 'Radar Chart',
    component: NeoRadarChart,
    useReturnValuesAsFields: true,
    helperText: (
      <div>
        A radar chart expects two advanced configurations: a <code>Quantitative Variables</code> and an
        <code>Index Property</code>.
      </div>
    ),
    selection: {
      index: {
        label: 'Index',
        type: SELECTION_TYPES.TEXT,
        key: true,
      },
      values: {
        label: 'Value',
        type: SELECTION_TYPES.NUMBER,
        multiple: true,
        key: true,
      },
    },
    maxRecords: 250,
    settings: {
      backgroundColor: {
        label: 'Background Color',
        type: SELECTION_TYPES.COLOR,
        default: '#fafafa',
      },
      legend: {
        label: 'Show Legend',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      interactive: {
        label: 'Enable interactivity',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      animate: {
        label: 'Enable transitions',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      colors: {
        label: 'Color Scheme',
        type: SELECTION_TYPES.LIST,
        values: ['nivo', 'category10', 'accent', 'dark2', 'paired', 'pastel1', 'pastel2', 'set1', 'set2', 'set3'],
        default: 'set2',
      },
      marginLeft: {
        label: 'Margin Left (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 24,
      },
      marginRight: {
        label: 'Margin Right (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 24,
      },
      marginTop: {
        label: 'Margin Top (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 40,
      },
      marginBottom: {
        label: 'Margin Bottom (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 40,
      },
      dotSize: {
        label: 'Size of the dots (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 10,
      },
      dotBorderWidth: {
        label: 'Width of the dots border (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 2,
      },
      gridLevels: {
        label: 'Number of levels to display for grid',
        type: SELECTION_TYPES.NUMBER,
        default: 5,
      },
      gridLabelOffset: {
        label: 'Label offset from outer radius (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 16,
      },
      blendMode: {
        label: 'Blend Mode',
        type: SELECTION_TYPES.LIST,
        values: [
          'normal',
          'multiply',
          'screen',
          'overlay',
          'darken',
          'lighten',
          'color-dodge',
          'color-burn',
          'hard-light',
          'soft-light',
          'difference',
          'exclusion',
          'hue',
          'saturation',
          'color',
          'luminosity',
        ],
        default: 'normal',
      },
      motionConfig: {
        label: 'Motion Configuration',
        type: SELECTION_TYPES.LIST,
        values: ['default', 'gentle', 'wobbly', 'stiff', 'slow', 'molasses'],
        default: 'gentle',
      },
      curve: {
        label: 'Curve interpolation',
        type: SELECTION_TYPES.LIST,
        values: ['basicClosed', 'cardinalClosed', 'catmullRomClosed', 'linearClosed'],
        default: 'linearClosed',
      },
    },
  },
  //
  /** *
   * * TODO: An idea here:
    For the level zero layers, perhaps we can make the component work agnostically of whether the user is using two or three level country codes.
    E.g. it can apply colouring to germany based on "DE" or "GER", whatever it picks up. That would be a lot easier than providing an advanced setting for it. In the rare case that the user returns both (this will probably never happen), we just choose either.
    I'm also thinking about adding three-letter country code support since that is what the choropleth used, so it will make migrating from choropleth to areamap a lot easier for users.
   */
  areamap: {
    label: 'Area Map',
    helperText: (
      <div>
        An Area Map expects two fields: a <code>country code / region code</code> (three-letter code) and a
        <code>value</code>.
      </div>
    ),
    useReturnValuesAsFields: true,
    maxRecords: 300,
    component: NeoAreaMapChart,
    selection: {
      index: {
        label: 'Code',
        type: SELECTION_TYPES.TEXT,
      },
      value: {
        label: 'Value',
        type: SELECTION_TYPES.NUMBER,
        key: true,
      },
    },
    settings: {
      providerUrl: {
        label: 'Map Provider URL',
        type: SELECTION_TYPES.TEXT,
        default: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      },
      colors: {
        label: 'Color Scheme',
        type: SELECTION_TYPES.LIST,
        values: ['nivo', 'BrBG', 'RdYlGn', 'YlOrRd', 'greens'],
        default: 'YlOrRd',
      },
      countryCodeFormat: {
        label: 'Country Code Format',
        type: SELECTION_TYPES.LIST,
        values: ['Alpha-2', 'Alpha-3'],
        default: 'Alpha-2',
      },
      showLegend: {
        label: 'Color Legend',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      mapDrillDown: {
        label: 'Drilldown Enabled',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
    },
  },
  gantt: {
    label: 'Gantt Chart',
    helperText: <div>A gantt chart requires nodes (events) and relationships (dependencies).</div>,
    maxRecords: 300,
    component: NeoGanttChart,
    withoutFooter: true,
    useNodePropsAsFields: true,
    autoAssignSelectedProperties: true,
    selection: {
      properties: {
        label: 'Node Properties',
        type: SELECTION_TYPES.NODE_PROPERTIES,
      },
    },
    settings: {
      barColor: {
        label: 'Bar Color',
        type: SELECTION_TYPES.TEXT,
        default: '#a3a3ff',
      },
      nameProperty: {
        label: 'Task Label Property',
        type: SELECTION_TYPES.TEXT,
        default: 'name',
      },
      startDateProperty: {
        label: 'Task Start Date Property',
        type: SELECTION_TYPES.TEXT,
        default: 'startDate',
      },
      endDateProperty: {
        label: 'Task End Date Property',
        type: SELECTION_TYPES.TEXT,
        default: 'endDate',
      },
      orderProperty: {
        label: 'Task Ordering Property',
        type: SELECTION_TYPES.TEXT,
        default: '(auto)',
      },
      dependencyTypeProperty: {
        label: 'Dependency Type Property',
        type: SELECTION_TYPES.TEXT,
        default: 'rel_type',
      },
      viewMode: {
        label: 'View mode',
        type: SELECTION_TYPES.LIST,
        values: ['auto', 'Half Day', 'Day', 'Week', 'Month', 'Quarter', 'Year'],
        default: 'auto',
      },
    },
  },
};

export const ADVANCED_REPORT_TYPES = objectMap(_ADVANCED_REPORT_TYPES, (value: any) => {
  return objMerge({ settings: COMMON_REPORT_SETTINGS }, value);
});
