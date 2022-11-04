
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ResponsiveSankey  } from '@nivo/sankey';
import { ChartProps } from '../../../../chart/Chart';
import { valueIsArray, valueIsNode, valueIsPath, valueIsRelationship } from '../../../../chart/ChartUtils';
import { categoricalColorSchemes } from '../../../../config/ColorConfig';
import { evaluateRulesOnDict, evaluateRulesOnNode } from '../../../styling/StyleRuleEvaluator';
import NeoCodeViewerComponent from '../../../../component/editor/CodeViewerComponent';
import { isCyclic } from '../../Utils';


/**
 * Embeds a SankeyChart (from Charts) into NeoDash.
 */
const NeoSankeyChart = (props: ChartProps) => {
  const { records } = props;

  const settings = props.settings ? props.settings : {};
  const legendHeight = 20;
  const legendWidth = 120;
  const marginRight = settings.marginRight ? settings.marginRight : 24;
  const marginLeft = settings.marginLeft ? settings.marginLeft : 24;
  const marginTop = settings.marginTop ? settings.marginTop : 24;
  const marginBottom = settings.marginBottom ? settings.marginBottom : 40;

  const interactive = settings.interactive !== undefined ? settings.interactive : true;
  const nodeBorderWidth = settings.nodeBorderWidth ? settings.nodeBorderWidth : 0;

  const legend = settings.legend !== undefined ? settings.legend : false;
  const colorScheme = settings.colors ? settings.colors : 'set2';
  const labelProperty = settings.labelProperty ? settings.labelProperty : 'value';
  const layout = settings.layout ? settings.layout : 'horizontal';
  const labelPosition = settings.labelPosition ? settings.labelPosition : 'inside';
  const labelOrientation = settings.labelOrientation ? settings.labelOrientation : 'horizontal';
  const nodeThickness = settings.nodeThickness ? settings.nodeThickness : 12;
  const nodeSpacing = settings.nodeSpacing ? settings.nodeSpacing : 12;

  const styleRules = settings && settings.styleRules ? settings.styleRules : [];

  const update = (state, mutations) => Object.assign({}, state, mutations);

  const [data, setData] = React.useState({ nodes: [], links: [] });

  useEffect(() => {
    buildVisualizationDictionaryFromRecords(props.records);
  }, []);

  if (props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <>No data, re-run the report.</>;
  }
  const nodes = {};
  const nodeLabels = {};
  const links = {};

  function extractGraphEntitiesFromField(value) {
    if (value == undefined) {
      return;
    }
    if (valueIsArray(value)) {
      value.forEach((v) => extractGraphEntitiesFromField(v));
    } else if (valueIsNode(value)) {
      value.labels.forEach((l) => (nodeLabels[l] = true));
      nodes[value.identity.low] = {
        id: value.identity.low,
        labels: value.labels,
        properties: value.properties,
        lastLabel: value.labels[value.labels.length - 1],
      };
    } else if (valueIsRelationship(value)) {
      if (links[`${value.start.low},${value.end.low}`] == undefined) {
        links[`${value.start.low},${value.end.low}`] = [];
      }
      const addItem = (arr, item) => arr.find((x) => x.id === item.id) || arr.push(item);
      if (value.properties[labelProperty] !== undefined && !isNaN(value.properties[labelProperty])) {
        addItem(links[`${value.start.low},${value.end.low}`], {
          id: value.identity.low,
          source: value.start.low,
          target: value.end.low,
          type: value.type,
          properties: value.properties,
          value: value.properties[labelProperty],
        });
      }
    } else if (valueIsPath(value)) {
      value.segments.map((segment) => {
        extractGraphEntitiesFromField(segment.start);
        extractGraphEntitiesFromField(segment.relationship);
        extractGraphEntitiesFromField(segment.end);
      });
    }
  }

  function buildVisualizationDictionaryFromRecords(records) {
    // Extract graph objects from result set.
    records.forEach((record) => {
      record._fields.forEach((field) => {
        extractGraphEntitiesFromField(field);
      });
    });
    // Assign proper curvatures to relationships.
    // This is needed for pairs of nodes that have multiple relationships between them, or self-loops.
    const linksList = Object.values(links).map((nodePair) => {
      return nodePair;
    });

    // Assign proper colors to nodes.
    const totalColors = categoricalColorSchemes[colorScheme] ? categoricalColorSchemes[colorScheme].length : 0;
    const nodeLabelsList = Object.keys(nodeLabels);
    const nodesList = Object.values(nodes).map((node) => {
      // First try to assign a node a color if it has a property specifying the color.
      let assignedColor =
        totalColors > 0
          ? categoricalColorSchemes[colorScheme][nodeLabelsList.indexOf(node.lastLabel) % totalColors]
          : 'grey';
      // Next, evaluate the custom styling rules to see if there's a rule-based override
      assignedColor = evaluateRulesOnNode(node, 'node color', assignedColor, styleRules);
      return update(node, { nodeColor: assignedColor ? assignedColor : 'grey' });
    });

    // Set the data dictionary that is read by the visualization.
    setData({
      nodes: nodesList,
      links: linksList.flat(),
    });
  }

  // Compute slice color based on rules - overrides default color scheme completely.
  const getSliceColor = (slice) => {
    const data = {};
    if (!props.selection) {
      return 'grey';
    }
    data[props.selection.value] = slice.value;
    data[props.selection.index] = slice.id;
    const validRuleIndex = evaluateRulesOnDict(data, styleRules, ['slice color']);
    if (validRuleIndex !== -1) {
      return styleRules[validRuleIndex].customizationValue;
    }
    return 'grey';
  };

  const getArcLabel = (item) => {
    let lbl = '';

    switch (props.selection[item.lastLabel]) {
      case '(id)':
        lbl = item.id;
        break;
      case '(label)':
        lbl = item.lastLabel;
        break;
      default:
        lbl = item.properties[props.selection[item.lastLabel]];
    }

    return typeof lbl === 'object' ? lbl.low : lbl;
  };

  if (data && data.links && data.links.length == 0) {
    return (
      <NeoCodeViewerComponent
        value={
          "No relationship weights found. \nDefine a numeric 'Relationship Property' in the \nreport's advanced settings to view the sankey diagram."
        }
      ></NeoCodeViewerComponent>
    );
  }

  if (data && data.nodes && data.links && isCyclic(data)) {
    return (
      <NeoCodeViewerComponent
        value={'Please be careful with the data you use for this chart as it does not support cyclic dependencies.'}
      ></NeoCodeViewerComponent>
    );
  }

  return (
    <ResponsiveSankey
      data={data}
      margin={{
        top: marginTop,
        right: legend ? legendWidth + marginRight : marginRight,
        bottom: legend ? legendHeight + marginBottom : marginBottom,
        left: marginLeft,
      }}
      isInteractive={interactive}
      layout={layout}
      label={getArcLabel}
      nodeBorderWidth={nodeBorderWidth}
      align="justify"
      nodeOpacity={1}
      nodeHoverOthersOpacity={0.35}
      nodeThickness={nodeThickness}
      nodeSpacing={nodeSpacing}
      nodeBorderColor={{
        from: 'color',
        modifiers: [['darker', 0.8]],
      }}
      nodeBorderRadius={3}
      linkOpacity={0.5}
      linkHoverOthersOpacity={0.1}
      linkContract={3}
      enableLinkGradient={true}
      labelPosition={labelPosition}
      labelOrientation={labelOrientation}
      labelPadding={16}
      labelTextColor={{
        from: 'color',
        modifiers: [['darker', 1]],
      }}
      colors={styleRules.length >= 1 ? getSliceColor : { scheme: colorScheme }}
      legends={
        legend
          ? [
              {
                anchor: 'bottom-right',
                direction: 'column',
                translateX: 120,
                itemWidth: 100,
                itemHeight: 14,
                itemDirection: 'right-to-left',
                itemsSpacing: 2,
                itemTextColor: '#999',
                symbolSize: 14,
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemTextColor: '#000',
                    },
                  },
                ],
              },
            ]
          : []
      }
      animate={true}
    />
  );
};

export default NeoSankeyChart;
