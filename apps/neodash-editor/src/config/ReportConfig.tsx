import React from 'react';
import NeoCardSettingsContentPropertySelect from '../card/settings/custom/CardSettingsContentPropertySelect';
import NeoBarChart from '../chart/bar/BarChart';
import NeoGraphChart from '../chart/graph/GraphChart';
import NeoIFrameChart from '../chart/iframe/IFrameChart';
import NeoJSONChart from '../chart/json/JSONChart';
import NeoMapChart from '../chart/map/MapChart';
import NeoPieChart from '../chart/pie/PieChart';
import NeoTableChart from '../chart/table/TableChart';
import NeoSingleValueChart from '../chart/single/SingleValueChart';
import NeoParameterSelectionChart from '../chart/parameter/ParameterSelectionChart';
import NeoMarkdownChart from '../chart/markdown/MarkdownChart';
import { SELECTION_TYPES } from './CardConfig';
import NeoLineChart from '../chart/line/LineChart';
import NeoScatterPlot from '../chart/scatter/ScatterPlotChart';

// TODO: make the reportConfig a interface with not self-documented code
// Use Neo4j 4.0 subqueries to limit the number of rows returned by overriding the query.
export const HARD_ROW_LIMITING = false;

// A small delay (for UX reasons) between when to run the query after saving a report.
export const RUN_QUERY_DELAY_MS = 300;

// The default number of rows to process in a visualization.
export const DEFAULT_ROW_LIMIT = 100;

// A dictionary of available reports (visualizations).
export const REPORT_TYPES = {
  table: {
    label: 'Table',
    helperText: 'A table will contain all returned data.',
    component: NeoTableChart,
    useReturnValuesAsFields: true,
    maxRecords: 1000,
    settings: {
      backgroundColor: {
        label: 'Background Color',
        type: SELECTION_TYPES.COLOR,
        default: '#fafafa',
      },
      transposed: {
        label: 'Transpose Rows & Columns',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      compact: {
        label: 'Compact Table',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      columnWidthsType: {
        label: 'Column Widths Specification',
        type: SELECTION_TYPES.LIST,
        values: ['Relative (%)', 'Fixed (px)'],
        default: 'Relative (%)',
      },
      columnWidths: {
        label: 'Relative/Fixed Column Sizes',
        type: SELECTION_TYPES.TEXT,
        default: '[1, 1, 1, ...]',
      },
      allowDownload: {
        label: 'Enable CSV Download',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      refreshButtonEnabled: {
        label: 'Refreshable',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      fullscreenEnabled: {
        label: 'Fullscreen enabled',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      downloadImageEnabled: {
        label: 'Download Image enabled',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      autorun: {
        label: 'Auto-run query',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      refreshRate: {
        label: 'Refresh rate (seconds)',
        type: SELECTION_TYPES.NUMBER,
        default: '0 (No refresh)',
      },
      description: {
        label: 'Report Description',
        type: SELECTION_TYPES.MULTILINE_TEXT,
        default: 'Enter markdown here...',
      },
    },
  },
  graph: {
    label: 'Graph',
    helperText: 'A graph visualization will draw all returned nodes, relationships and paths.',
    selection: {
      properties: {
        label: 'Node Properties',
        type: SELECTION_TYPES.NODE_PROPERTIES,
      },
    },
    useNodePropsAsFields: true,
    autoAssignSelectedProperties: true,
    component: NeoGraphChart,
    maxRecords: 1000,
    // The idea is to match a setting to its dependency, the operator represents the kind of relationship
    // between the different options (EX: if operator is false, then it must be the opposite of the setting it depends on)
    disabledDependency: { relationshipParticleSpeed: { dependsOn: 'relationshipParticles', operator: false } },
    settings: {
      backgroundColor: {
        label: 'Background Color',
        type: SELECTION_TYPES.COLOR,
        default: '#fafafa',
      },
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
        values: ['force-directed', 'tree', 'radial'],
        default: 'force-directed',
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
      fixNodeAfterDrag: {
        label: 'Fix node positions after Drag',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      drilldownLink: {
        label: 'Drilldown Icon Link',
        type: SELECTION_TYPES.TEXT,
        placeholder: 'http://bloom.neo4j.io',
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
      refreshButtonEnabled: {
        label: 'Refreshable',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      fullscreenEnabled: {
        label: 'Fullscreen enabled',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      downloadImageEnabled: {
        label: 'Download Image enabled',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      lockable: {
        label: 'Enable locking node positions',
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
      iconStyle: {
        label: 'Node Label images',
        type: SELECTION_TYPES.TEXT,
        placeholder: '{label : url}',
        default: '',
      },
      refreshRate: {
        label: 'Refresh rate (seconds)',
        type: SELECTION_TYPES.NUMBER,
        default: '0 (No refresh)',
      },
      rightClickToExpandNodes: {
        label: 'Right Click to Expand Nodes',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      description: {
        label: 'Report Description',
        type: SELECTION_TYPES.MULTILINE_TEXT,
        default: 'Enter markdown here...',
      },
    },
  },
  bar: {
    label: 'Bar Chart',
    component: NeoBarChart,
    useReturnValuesAsFields: true,
    helperText: (
      <div>
        A bar chart expects two fields: a <code>category</code> and a <code>value</code>.
      </div>
    ),
    selection: {
      index: {
        label: 'Category',
        type: SELECTION_TYPES.TEXT,
      },
      value: {
        label: 'Value',
        type: SELECTION_TYPES.NUMBER,
        key: true,
      },
      key: {
        label: 'Group',
        type: SELECTION_TYPES.TEXT,
        optional: true,
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
      showOptionalSelections: {
        label: 'Grouping',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      valueScale: {
        label: 'Value Scale',
        type: SELECTION_TYPES.LIST,
        values: ['linear', 'symlog'],
        default: 'linear',
      },
      minValue: {
        label: 'Min Value',
        type: SELECTION_TYPES.NUMBER,
        default: 'auto',
      },
      maxValue: {
        label: 'Max Value',
        type: SELECTION_TYPES.NUMBER,
        default: 'auto',
      },
      groupMode: {
        label: 'Group Mode',
        type: SELECTION_TYPES.LIST,
        values: ['grouped', 'stacked'],
        default: 'stacked',
      },
      layout: {
        label: 'Layout',
        type: SELECTION_TYPES.LIST,
        values: ['horizontal', 'vertical'],
        default: 'vertical',
      },
      colors: {
        label: 'Color Scheme',
        type: SELECTION_TYPES.LIST,
        values: ['nivo', 'category10', 'accent', 'dark2', 'paired', 'pastel1', 'pastel2', 'set1', 'set2', 'set3'],
        default: 'set2',
      },
      barValues: {
        label: 'Show Value on Bars',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      labelSkipWidth: {
        label: 'Skip label on width (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 0,
      },
      labelSkipHeight: {
        label: 'Skip label on height (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 0,
      },
      positionLabel: {
        label: 'Custom label position',
        type: SELECTION_TYPES.LIST,
        values: ['off', 'top', 'bottom'],
        default: 'off',
      },
      labelRotation: {
        label: 'Label Rotation (degrees)',
        type: SELECTION_TYPES.NUMBER,
        default: 45,
      },
      marginLeft: {
        label: 'Margin Left (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 50,
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
        default: 45,
      },
      legendWidth: {
        label: 'Legend Width (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 128,
      },
      hideSelections: {
        label: 'Hide Property Selection',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      refreshButtonEnabled: {
        label: 'Refreshable',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      fullscreenEnabled: {
        label: 'Fullscreen enabled',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      downloadImageEnabled: {
        label: 'Download Image enabled',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      autorun: {
        label: 'Auto-run query',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      refreshRate: {
        label: 'Refresh rate (seconds)',
        type: SELECTION_TYPES.NUMBER,
        default: '0 (No refresh)',
      },
      description: {
        label: 'Report Description',
        type: SELECTION_TYPES.MULTILINE_TEXT,
        default: 'Enter markdown here...',
      },
    },
  },
  pie: {
    label: 'Pie Chart',
    component: NeoPieChart,
    useReturnValuesAsFields: true,
    helperText: (
      <div>
        A pie chart expects two fields: a <code>category</code> and a <code>value</code>.
      </div>
    ),
    selection: {
      index: {
        label: 'Category',
        type: SELECTION_TYPES.TEXT,
      },
      value: {
        label: 'Value',
        type: SELECTION_TYPES.NUMBER,
        key: true,
      },
      key: {
        label: 'Group',
        type: SELECTION_TYPES.TEXT,
        optional: true,
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
      sortByValue: {
        label: 'Auto-sort slices by value',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      enableArcLabels: {
        label: 'Show Values in slices',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      arcLabelsSkipAngle: {
        label: "Skip label if corresponding arc's angle is lower than provided value",
        type: SELECTION_TYPES.NUMBER,
        default: 10,
      },
      enableArcLinkLabels: {
        label: 'Show categories next to slices',
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
      innerRadius: {
        label: 'Pie Inner Radius (between 0 and 1)',
        type: SELECTION_TYPES.NUMBER,
        default: 0,
      },
      padAngle: {
        label: 'Slice padding angle (degrees)',
        type: SELECTION_TYPES.NUMBER,
        default: 0,
      },
      borderWidth: {
        label: 'Slice border width (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 0,
      },
      activeOuterRadiusOffset: {
        label: 'Extends active slice outer radius',
        type: SELECTION_TYPES.NUMBER,
        default: 8,
      },
      arcLinkLabelsOffset: {
        label: 'Link offset from pie outer radius, useful to have links overlapping pie slices',
        type: SELECTION_TYPES.NUMBER,
        default: 15,
      },
      arcLinkLabelsSkipAngle: {
        label: "Skip label if corresponding slice's angle is lower than provided value",
        type: SELECTION_TYPES.NUMBER,
        default: 1,
      },
      cornerRadius: {
        label: 'Slice Corner Radius',
        type: SELECTION_TYPES.NUMBER,
        default: 1,
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
      refreshButtonEnabled: {
        label: 'Refreshable',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      fullscreenEnabled: {
        label: 'Fullscreen enabled',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      downloadImageEnabled: {
        label: 'Download Image enabled',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      autorun: {
        label: 'Auto-run query',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      refreshRate: {
        label: 'Refresh rate (seconds)',
        type: SELECTION_TYPES.NUMBER,
        default: '0 (No refresh)',
      },
      description: {
        label: 'Report Description',
        type: SELECTION_TYPES.MULTILINE_TEXT,
        default: 'Enter markdown here...',
      },
    },
  },
  line: {
    label: 'Line Chart',
    component: NeoLineChart,
    useReturnValuesAsFields: true,
    helperText: (
      <div>
        A line chart expects two fields: an <code>x</code> value and a <code>y</code> value. The <code>x</code> value
        can be a number or a Neo4j datetime object. Values are automatically selected from your query results.
      </div>
    ),
    selection: {
      x: {
        label: 'X-value',
        type: SELECTION_TYPES.NUMBER_OR_DATETIME,
      },
      value: {
        label: 'Y-value',
        type: SELECTION_TYPES.NUMBER,
        key: true,
        multiple: true,
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
      colors: {
        label: 'Color Scheme',
        type: SELECTION_TYPES.LIST,
        values: ['nivo', 'category10', 'accent', 'dark2', 'paired', 'pastel1', 'pastel2', 'set1', 'set2', 'set3'],
        default: 'set2',
      },
      xScale: {
        label: 'X Scale',
        type: SELECTION_TYPES.LIST,
        values: ['linear', 'log', 'point'],
        default: 'linear',
      },
      yScale: {
        label: 'Y Scale',
        type: SELECTION_TYPES.LIST,
        values: ['linear', 'log'],
        default: 'linear',
      },
      minXValue: {
        label: 'Min X Value',
        type: SELECTION_TYPES.NUMBER,
        default: 'auto',
      },
      maxXValue: {
        label: 'Max X Value',
        type: SELECTION_TYPES.NUMBER,
        default: 'auto',
      },
      minYValue: {
        label: 'Min Y Value',
        type: SELECTION_TYPES.NUMBER,
        default: 'auto',
      },
      maxYValue: {
        label: 'Max Y Value',
        type: SELECTION_TYPES.NUMBER,
        default: 'auto',
      },
      xTickValues: {
        label: 'X-axis Tick Count (Approximate)',
        type: SELECTION_TYPES.NUMBER,
        default: 'auto',
      },
      xAxisTimeFormat: {
        label: 'X-axis Format (Time chart)',
        type: SELECTION_TYPES.TEXT,
        default: '%Y-%m-%dT%H:%M:%SZ',
      },
      xTickTimeValues: {
        label: 'X-axis Tick Size (Time chart)',
        type: SELECTION_TYPES.TEXT,
        default: 'every 1 year',
      },
      xTickRotationAngle: {
        label: 'X-axis Tick Rotation (Degrees)',
        type: SELECTION_TYPES.NUMBER,
        default: 0,
      },
      yTickRotationAngle: {
        label: 'Y-axis Tick Rotation (Degrees)',
        type: SELECTION_TYPES.NUMBER,
        default: 0,
      },
      curve: {
        label: 'Line Smoothing',
        type: SELECTION_TYPES.LIST,
        values: ['linear', 'basis', 'cardinal', 'step'],
        default: 'linear',
      },
      showGrid: {
        label: 'Show Grid',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      pointSize: {
        label: 'Point Radius (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 10,
      },
      lineWidth: {
        label: 'Line Width (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 2,
      },
      marginLeft: {
        label: 'Margin Left (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 50,
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
      legendWidth: {
        label: 'Legend Label Width (px)',
        type: SELECTION_TYPES.NUMBER,
        default: 100,
      },
      hideSelections: {
        label: 'Hide Property Selection',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      refreshButtonEnabled: {
        label: 'Refreshable',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      fullscreenEnabled: {
        label: 'Fullscreen enabled',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      downloadImageEnabled: {
        label: 'Download Image enabled',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      autorun: {
        label: 'Auto-run query',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      refreshRate: {
        label: 'Refresh rate (seconds)',
        type: SELECTION_TYPES.NUMBER,
        default: '0 (No refresh)',
      },
      description: {
        label: 'Report Description',
        type: SELECTION_TYPES.MULTILINE_TEXT,
        default: 'Enter markdown here...',
      },
    },
  },
  // TODO - move to advanced visualization.
  // scatterPlot: {
  //   label: 'Scatter Plot',
  //   component: NeoScatterPlot,
  //   useReturnValuesAsFields: true,
  //   helperText: (
  //     <div>
  //       A Scatter plot chart expects two fields: an <code>x</code> value and a <code>y</code> value. The <code>x</code>
  //       value can be a number or a Neo4j datetime object. Values are automatically selected from your query results.
  //     </div>
  //   ),
  //   selection: {
  //     x: {
  //       label: 'X-value',
  //       type: SELECTION_TYPES.NUMBER_OR_DATETIME,
  //     },
  //     value: {
  //       label: 'Y-value',
  //       type: SELECTION_TYPES.NUMBER,
  //       key: true,
  //     },
  //   },
  //   maxRecords: 2000,
  //   settings: {
  //     backgroundColor: {
  //       label: 'Background Color',
  //       type: SELECTION_TYPES.COLOR,
  //       default: '#fafafa',
  //     },
  //     colorIntensityProp: {
  //       label: 'Intensity value field',
  //       type: SELECTION_TYPES.TEXT,
  //       default: 'intensity',
  //     },
  //     labelProp: {
  //       label: 'Point label field',
  //       type: SELECTION_TYPES.TEXT,
  //       default: 'label',
  //     },
  //     legend: {
  //       label: 'Show Legend',
  //       type: SELECTION_TYPES.LIST,
  //       values: [true, false],
  //       default: false,
  //     },
  //     legendWidth: {
  //       label: 'Legend Width (px)',
  //       type: SELECTION_TYPES.NUMBER,
  //       default: 20,
  //     },
  //     xScale: {
  //       label: 'X Scale',
  //       type: SELECTION_TYPES.LIST,
  //       values: ['linear', 'log'],
  //       default: 'linear',
  //     },
  //     yScale: {
  //       label: 'Y Scale',
  //       type: SELECTION_TYPES.LIST,
  //       values: ['linear', 'log'],
  //       default: 'linear',
  //     },
  //     minXValue: {
  //       label: 'Min X Value',
  //       type: SELECTION_TYPES.NUMBER,
  //       default: 'auto',
  //     },
  //     maxXValue: {
  //       label: 'Max X Value',
  //       type: SELECTION_TYPES.NUMBER,
  //       default: 'auto',
  //     },
  //     minYValue: {
  //       label: 'Min Y Value',
  //       type: SELECTION_TYPES.NUMBER,
  //       default: 'auto',
  //     },
  //     maxYValue: {
  //       label: 'Max Y Value',
  //       type: SELECTION_TYPES.NUMBER,
  //       default: 'auto',
  //     },
  //     xTickValues: {
  //       label: 'X-axis Tick Count (Approximate)',
  //       type: SELECTION_TYPES.NUMBER,
  //       default: 'auto',
  //     },
  //     xAxisTimeFormat: {
  //       label: 'X-axis Format (Time chart)',
  //       type: SELECTION_TYPES.TEXT,
  //       default: '%Y-%m-%dT%H:%M:%SZ',
  //     },
  //     xTickTimeValues: {
  //       label: 'X-axis Tick Size (Time chart)',
  //       type: SELECTION_TYPES.TEXT,
  //       default: 'every 1 year',
  //     },
  //     xTickRotationAngle: {
  //       label: 'X-axis Tick Rotation (Degrees)',
  //       type: SELECTION_TYPES.NUMBER,
  //       default: 0,
  //     },
  //     yTickRotationAngle: {
  //       label: 'Y-axis Tick Rotation (Degrees)',
  //       type: SELECTION_TYPES.NUMBER,
  //       default: 0,
  //     },
  //     showGrid: {
  //       label: 'Show Grid',
  //       type: SELECTION_TYPES.LIST,
  //       values: [true, false],
  //       default: true,
  //     },
  //     pointSize: {
  //       label: 'Point Radius (px)',
  //       type: SELECTION_TYPES.NUMBER,
  //       default: 9,
  //     },
  //     marginLeft: {
  //       label: 'Margin Left (px)',
  //       type: SELECTION_TYPES.NUMBER,
  //       default: 50,
  //     },
  //     marginRight: {
  //       label: 'Margin Right (px)',
  //       type: SELECTION_TYPES.NUMBER,
  //       default: 24,
  //     },
  //     marginTop: {
  //       label: 'Margin Top (px)',
  //       type: SELECTION_TYPES.NUMBER,
  //       default: 24,
  //     },
  //     marginBottom: {
  //       label: 'Margin Bottom (px)',
  //       type: SELECTION_TYPES.NUMBER,
  //       default: 40,
  //     },
  //     hideSelections: {
  //       label: 'Hide Property Selection',
  //       type: SELECTION_TYPES.LIST,
  //       values: [true, false],
  //       default: false,
  //     },
  //     refreshButtonEnabled: {
  //       label: 'Refreshable',
  //       type: SELECTION_TYPES.LIST,
  //       values: [true, false],
  //       default: false,
  //     },
  //     fullscreenEnabled: {
  //       label: 'Fullscreen enabled',
  //       type: SELECTION_TYPES.LIST,
  //       values: [true, false],
  //       default: false,
  //     },
  //     downloadImageEnabled: {
  //       label: 'Download Image enabled',
  //       type: SELECTION_TYPES.LIST,
  //       values: [true, false],
  //       default: false,
  //     },
  //     autorun: {
  //       label: 'Auto-run query',
  //       type: SELECTION_TYPES.LIST,
  //       values: [true, false],
  //       default: true,
  //     },
  //     refreshRate: {
  //       label: 'Refresh rate (seconds)',
  //       type: SELECTION_TYPES.NUMBER,
  //       default: '0 (No refresh)',
  //     },
  //     description: {
  //       label: 'Report Description',
  //       type: SELECTION_TYPES.MULTILINE_TEXT,
  //       default: 'Enter markdown here...',
  //     },
  //   },
  // },
  map: {
    label: 'Map',
    helperText: 'A map will draw all nodes and relationships with spatial properties.',
    selection: {
      properties: {
        label: 'Node Properties',
        type: SELECTION_TYPES.NODE_PROPERTIES,
      },
    },
    useNodePropsAsFields: true,
    component: NeoMapChart,
    maxRecords: 1000,
    settings: {
      backgroundColor: {
        label: 'Background Color',
        type: SELECTION_TYPES.COLOR,
        default: '#fafafa',
      },
      layerType: {
        label: 'Layer Type',
        type: SELECTION_TYPES.LIST,
        values: ['markers', 'heatmap'],
        default: 'markers',
      },
      clusterMarkers: {
        label: 'Cluster Markers',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      separateOverlappingMarkers: {
        label: 'Seperate Overlapping Markers',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
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
      defaultNodeSize: {
        label: 'Node Marker Size',
        type: SELECTION_TYPES.LIST,
        values: ['small', 'medium', 'large'],
        default: 'large',
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
      providerUrl: {
        label: 'Map Provider URL',
        type: SELECTION_TYPES.TEXT,
        default: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      },
      intensityProp: {
        label: 'Intensity Property (for heatmap)',
        type: SELECTION_TYPES.TEXT,
        default: 'intensity',
      },
      hideSelections: {
        label: 'Hide Property Selection',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
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
  value: {
    label: 'Single Value',
    helperText: 'This report will show only the first value of the first row returned.',
    component: NeoSingleValueChart,
    maxRecords: 1,
    settings: {
      backgroundColor: {
        label: 'Background Color',
        type: SELECTION_TYPES.COLOR,
        default: '#fafafa',
      },
      fontSize: {
        label: 'Font Size',
        type: SELECTION_TYPES.NUMBER,
        default: 64,
      },
      color: {
        label: 'Color',
        type: SELECTION_TYPES.TEXT,
        default: 'rgba(0, 0, 0, 0.87)',
      },
      format: {
        label: 'Display format',
        type: SELECTION_TYPES.LIST,
        values: ['auto', 'json', 'yml'],
        default: 'auto',
      },
      monospace: {
        label: 'Use monospace font',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      textAlign: {
        label: 'Horizontal Align',
        type: SELECTION_TYPES.LIST,
        values: ['left', 'center', 'right'],
        default: 'left',
      },
      verticalAlign: {
        label: 'Vertical Align',
        type: SELECTION_TYPES.LIST,
        values: ['bottom', 'middle', 'top'],
        default: 'top',
      },
      refreshButtonEnabled: {
        label: 'Refreshable',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      fullscreenEnabled: {
        label: 'Fullscreen enabled',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      downloadImageEnabled: {
        label: 'Download Image enabled',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      autorun: {
        label: 'Auto-run query',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      refreshRate: {
        label: 'Refresh rate (seconds)',
        type: SELECTION_TYPES.NUMBER,
        default: '0 (No refresh)',
      },
      description: {
        label: 'Report Description',
        type: SELECTION_TYPES.MULTILINE_TEXT,
        default: 'Enter markdown here...',
      },
    },
  },
  json: {
    label: 'Raw JSON',
    helperText: 'This report will render the raw data returned by Neo4j.',
    component: NeoJSONChart,
    allowScrolling: true,
    maxRecords: 500,
    settings: {
      format: {
        label: 'Format',
        type: SELECTION_TYPES.LIST,
        values: ['json', 'yml'],
        default: 'json',
      },
      backgroundColor: {
        label: 'Background Color',
        type: SELECTION_TYPES.COLOR,
        default: '#fafafa',
      },
      refreshButtonEnabled: {
        label: 'Refreshable',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      fullscreenEnabled: {
        label: 'Fullscreen enabled',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      downloadImageEnabled: {
        label: 'Download Image enabled',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      autorun: {
        label: 'Auto-run query',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      refreshRate: {
        label: 'Refresh rate (seconds)',
        type: SELECTION_TYPES.NUMBER,
        default: '0 (No refresh)',
      },
      description: {
        label: 'Report Description',
        type: SELECTION_TYPES.MULTILINE_TEXT,
        default: 'Enter markdown here...',
      },
    },
  },
  select: {
    label: 'Parameter Select',
    helperText:
      'This report will let users interactively select Cypher parameters that are available globally, in all reports. A parameter can either be a node property, relationship property, or a free text field.',
    component: NeoParameterSelectionChart,
    settingsComponent: NeoCardSettingsContentPropertySelect,
    disableCypherParameters: true,
    textOnly: true,
    maxRecords: 100,
    settings: {
      backgroundColor: {
        label: 'Background Color',
        type: SELECTION_TYPES.COLOR,
        default: '#fafafa',
      },
      multiSelector: {
        label: 'Multiple Selection',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      overridePropertyDisplayName: {
        label: 'Property Display Name Override',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      suggestionLimit: {
        label: 'Value Suggestion Limit',
        type: SELECTION_TYPES.NUMBER,
        default: 5,
      },
      searchType: {
        label: 'Search Type',
        type: SELECTION_TYPES.LIST,
        values: ['CONTAINS', 'STARTS WITH', 'ENDS WITH'],
        default: 'CONTAINS',
      },
      caseSensitive: {
        label: 'Case Sensitive Search',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      deduplicateSuggestions: {
        label: 'Deduplicate Suggestion Values',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      defaultValue: {
        label: 'Default Value (Override)',
        type: SELECTION_TYPES.TEXT,
        default: '',
      },
      clearParameterOnFieldClear: {
        label: 'Clear Parameter on Field Reset',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      manualPropertyNameSpecification: {
        label: 'Manual Label/Property Name Specification',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      helperText: {
        label: 'Helper Text (Override)',
        type: SELECTION_TYPES.TEXT,
        default: 'Enter a custom helper text here...',
      },
      suggestionsUpdateTimeout: {
        label: 'Timeout for value suggestions (ms)',
        type: SELECTION_TYPES.NUMBER,
        default: 250,
      },
      setParameterTimeout: {
        label: 'Timeout for value updates (ms)',
        type: SELECTION_TYPES.NUMBER,
        default: 1000,
      },
      fullscreenEnabled: {
        label: 'Fullscreen enabled',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      description: {
        label: 'Report Description',
        type: SELECTION_TYPES.MULTILINE_TEXT,
        default: 'Enter markdown here...',
      },
    },
  },
  iframe: {
    label: 'iFrame',
    helperText:
      'iFrame reports let you embed external webpages into your dashboard. Enter an URL in the query box above to embed it as an iFrame.',
    textOnly: true, // this makes sure that no query is executed, input of the report gets passed directly to the renderer.
    disableDatabaseSelector: true,
    component: NeoIFrameChart,
    inputMode: 'url',
    maxRecords: 1,
    allowScrolling: true,
    settings: {
      backgroundColor: {
        label: 'Background Color',
        type: SELECTION_TYPES.COLOR,
        default: '#fafafa',
      },
      replaceGlobalParameters: {
        label: 'Replace global parameters in URL',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      passGlobalParameters: {
        label: 'Append global parameters to iFrame URL',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      fullscreenEnabled: {
        label: 'Fullscreen enabled',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      description: {
        label: 'Report Description',
        type: SELECTION_TYPES.MULTILINE_TEXT,
        default: 'Enter markdown here...',
      },
    },
  },
  text: {
    label: 'Markdown',
    helperText: 'Markdown text specified above will be rendered in the report.',
    component: NeoMarkdownChart,
    inputMode: 'markdown',
    textOnly: true, // this makes sure that no query is executed, input of the report gets passed directly to the renderer.
    disableDatabaseSelector: true,
    maxRecords: 1,
    allowScrolling: true,
    settings: {
      backgroundColor: {
        label: 'Background Color',
        type: SELECTION_TYPES.COLOR,
        default: '#fafafa',
      },
      replaceGlobalParameters: {
        label: 'Replace global parameters in Markdown',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: true,
      },
      fullscreenEnabled: {
        label: 'Fullscreen enabled',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      downloadImageEnabled: {
        label: 'Download Image enabled',
        type: SELECTION_TYPES.LIST,
        values: [true, false],
        default: false,
      },
      description: {
        label: 'Report Description',
        type: SELECTION_TYPES.MULTILINE_TEXT,
        default: 'Enter markdown here...',
      },
    },
  },
};

// Default node labels to display when rendering a node in a graph visualization.
export const DEFAULT_NODE_LABELS = ['name', 'title', 'label', 'id', 'uid', '(label)'];

// Default node labels to display when rendering a node in a graph visualization.
export const DEFAULT_NODE_LABEL_BLANK = '(no label)';
