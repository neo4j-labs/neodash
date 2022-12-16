import React from 'react';
import { SELECTION_TYPES } from '../../config/CardConfig';
import NeoChoroplethMapChart from './chart/choropleth/ChoroplethMapChart';
import NeoCirclePackingChart from './chart/circlepacking/CirclePackingChart';
import NeoGaugeChart from './chart/gauge/GaugeChart';
import NeoSankeyChart from './chart/sankey/SankeyChart';
import NeoSunburstChart from './chart/sunburst/SunburstChart';
import NeoTreeMapChart from './chart/treemap/TreeMapChart';
import NeoRadarChart from './chart/radar/RadarChart';

export const ADVANCED_REPORT_TYPES = {
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
      autorun: {
        label: 'Auto-run query',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      description: {
        label: 'Report Description',
        type: SELECTION_TYPES.MULTILINE_TEXT,
        default: 'Enter markdown here...',
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
      autorun: {
        label: 'Auto-run query',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      description: {
        label: 'Report Description',
        type: SELECTION_TYPES.MULTILINE_TEXT,
        default: 'Enter markdown here...',
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
      autorun: {
        label: 'Auto-run query',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      description: {
        label: 'Report Description',
        type: SELECTION_TYPES.MULTILINE_TEXT,
        default: 'Enter markdown here...',
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
      autorun: {
        label: 'Auto-run query',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      description: {
        label: 'Report Description',
        type: SELECTION_TYPES.MULTILINE_TEXT,
        default: 'Enter markdown here...',
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
      autorun: {
        label: 'Auto-run Query',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
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
      description: {
        label: 'Report Description',
        type: SELECTION_TYPES.MULTILINE_TEXT,
        default: 'Enter markdown here...',
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
      autorun: {
        label: 'Auto-run query',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
    },
  },
};
