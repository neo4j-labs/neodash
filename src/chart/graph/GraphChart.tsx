import React, { useEffect, useRef, useState } from 'react';
import useDimensions from 'react-cool-dimensions';
import { ChartProps } from '../Chart';
import { NeoGraphChartInspectModal } from './component/GraphChartInspectModal';
import { useStyleRules } from '../../extensions/styling/StyleRuleEvaluator';
import { extensionEnabled } from '../../extensions/ExtensionUtils';
import { NeoGraphChartVisualization2D } from './GraphChartVisualization2D';
import { NeoGraphChartDeepLinkButton } from './component/button/GraphChartDeepLinkButton';
import { NeoGraphChartCanvas } from './component/GraphChartCanvas';
import { NeoGraphChartLockButton } from './component/button/GraphChartLockButton';
import { NeoGraphChartFitViewButton } from './component/button/GraphChartFitViewButton';
import { buildGraphVisualizationObjectFromRecords } from './util/RecordUtils';
import { parseNodeIconConfig } from './util/NodeUtils';
import { GraphChartVisualizationProps, layouts } from './GraphChartVisualization';
import { handleExpand } from './util/GraphUtils';
import { categoricalColorSchemes } from '../../config/ColorConfig';
import { IconButton, Tooltip } from '@material-ui/core';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { RenderSubValue } from '../../report/ReportRecordProcessing';
import { downloadCSV } from '../ChartUtils';
/**
 * Draws graph data using a force-directed-graph visualization.
 * This visualization is powered by `react-force-graph`.
 * See https://github.com/vasturiano/react-force-graph for examples on customization.
 */
const NeoGraphChart = (props: ChartProps) => {
  if (props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <>No data, re-run the report.</>;
  }

  // Retrieve config from advanced settings
  const transposed = props.settings && props.settings.transposed ? props.settings.transposed : false;
  const backgroundColor = props.settings && props.settings.backgroundColor ? props.settings.backgroundColor : '#fafafa';
  const allowDownload = props.settings && props.settings.allowDownload !== undefined ? props.settings.allowDownload : false;
  const nodeSizeProp = props.settings && props.settings.nodeSizeProp ? props.settings.nodeSizeProp : 'size';
  const nodeColorProp = props.settings && props.settings.nodeColorProp ? props.settings.nodeColorProp : 'color';
  const defaultNodeSize = props.settings && props.settings.defaultNodeSize ? props.settings.defaultNodeSize : 2;
  const relWidthProp = props.settings && props.settings.relWidthProp ? props.settings.relWidthProp : 'width';
  const relColorProp = props.settings && props.settings.relColorProp ? props.settings.relColorProp : 'color';
  const defaultRelWidth = props.settings && props.settings.defaultRelWidth ? props.settings.defaultRelWidth : 1;
  const defaultRelColor = props.settings && props.settings.defaultRelColor ? props.settings.defaultRelColor : '#a0a0a0';
  const nodeLabelColor = props.settings && props.settings.nodeLabelColor ? props.settings.nodeLabelColor : 'black';
  const nodeLabelFontSize = props.settings && props.settings.nodeLabelFontSize ? props.settings.nodeLabelFontSize : 3.5;
  const relLabelFontSize = props.settings && props.settings.relLabelFontSize ? props.settings.relLabelFontSize : 2.75;
  const relLabelColor = props.settings && props.settings.relLabelColor ? props.settings.relLabelColor : '#a0a0a0';
  const nodeColorScheme = props.settings && props.settings.nodeColorScheme ? props.settings.nodeColorScheme : 'neodash';
  const showPropertiesOnHover: boolean =
    props.settings && props.settings.showPropertiesOnHover !== undefined ? props.settings.showPropertiesOnHover : true;
  const showPropertiesOnClick =
    props.settings && props.settings.showPropertiesOnClick !== undefined ? props.settings.showPropertiesOnClick : true;
  const fixNodeAfterDrag: boolean =
    props.settings && props.settings.fixNodeAfterDrag !== undefined ? props.settings.fixNodeAfterDrag : true;
  const layout = props.settings && props.settings.layout !== undefined ? props.settings.layout : 'force-directed';
  const lockable = props.settings && props.settings.lockable !== undefined ? props.settings.lockable : true;
  const drilldownLink: string =
    props.settings && props.settings.drilldownLink !== undefined ? props.settings.drilldownLink : '';
  const rightClickToExpandNodes = false; // TODO - this isn't working properly yet, disable it.
  const defaultNodeColor = 'lightgrey'; // Color of nodes without labels
  const linkDirectionalParticles = props.settings && props.settings.relationshipParticles ? 5 : undefined;
  const linkDirectionalParticleSpeed =
    props.settings && props.settings.relationshipParticleSpeed ? props.settings.relationshipParticleSpeed : 0.005; // Speed of particles on relationships.
  const iconStyle = props.settings && props.settings.iconStyle !== undefined ? props.settings.iconStyle : '';
  const styleRules = useStyleRules(
    extensionEnabled(props.extensions, 'styling'),
    props.settings && props.settings.styleRules,
    props.getGlobalParameter
  );
  const parameters = props.parameters ? props.parameters : {};
  let nodePositions = props.settings && props.settings.nodePositions ? props.settings.nodePositions : {};
  const setNodePositions = (positions) =>
    props.updateReportSetting && props.updateReportSetting('nodePositions', positions);
  const generateSafeColumnKey = (key) => {
      return key != 'id' ? key : `${key} `;
    };
  const handleEntityClick = (item) => {
    if (showPropertiesOnClick) {
      setSelectedEntity(item);
      setInspectModalOpen(true);
    }
  };
  const frozen: boolean = props.settings && props.settings.frozen !== undefined ? props.settings.frozen : false;
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(undefined);
  const [firstRun, setFirstRun] = useState(true);
  let nodes: Record<string, any>[] = {};
  let nodeLabels = {};
  let links: Record<string, any>[] = {};
  let linkTypes = {};
  const [data, setData] = useState({ nodes: [] as any[], links: [] as any[] });
  const [extraRecords, setExtraRecords] = useState([]);
  const setLayoutFrozen = (value) => {
    if (value == false) {
      setFirstRun(true);
      setNodePositions({});
    }
    props.updateReportSetting && props.updateReportSetting('frozen', value);
  };
  const { records } = props;
  let icons = parseNodeIconConfig(iconStyle);
  const colorScheme = categoricalColorSchemes[nodeColorScheme];
  const rows = transposed
    ? records[0].keys.map((key, i) => {
        return Object.assign(
          { id: i, Field: key },
          ...records.map((r, j) => ({
            [`Value${j == 0 ? '' : ` ${(j + 1).toString()}`}`]: RenderSubValue(r._fields[i]),
          }))
        );
      })
    : records.map((record, rownumber) => {
        return Object.assign(
          { id: rownumber },
          ...record._fields.map((field, i) => ({ [generateSafeColumnKey(record.keys[i])]: field }))
        );
      });
  const generateVisualizationDataGraph = (records) => {
    const extractedGraphFromRecords = buildGraphVisualizationObjectFromRecords(
      records,
      nodes,
      links,
      nodeLabels,
      linkTypes,
      colorScheme,
      nodeColorProp,
      defaultNodeColor,
      nodeSizeProp,
      defaultNodeSize,
      relWidthProp,
      defaultRelWidth,
      relColorProp,
      defaultRelColor,
      styleRules,
      nodePositions,
      frozen
    );
    setData(extractedGraphFromRecords);
  };

  // When data is refreshed, rebuild the visualization data.
  useEffect(() => {
    generateVisualizationDataGraph(props.records.concat(extraRecords));
  }, [props.records, extraRecords]);

  const { observe, width, height } = useDimensions({
    onResize: ({ observe, unobserve }) => {
      unobserve(); // To stop observing the current target element
      observe(); // To re-start observing the current target element
    },
  });

  const chartProps: GraphChartVisualizationProps = {
    data: {
      nodes: data.nodes,
      links: data.links,
      parameters: parameters,
    },
    style: {
      width: width,
      height: height,
      backgroundColor: backgroundColor,
      linkDirectionalParticles: linkDirectionalParticles,
      linkDirectionalParticleSpeed: linkDirectionalParticleSpeed,
      nodeLabelFontSize: nodeLabelFontSize,
      nodeLabelColor: nodeLabelColor,
      relLabelFontSize: relLabelFontSize,
      relLabelColor: relLabelColor,
      defaultNodeSize: defaultNodeSize,
      nodeIcons: icons,
    },
    engine: {
      layout: layouts[layout],
      queryCallback: props.queryCallback,
      setExtraRecords: setExtraRecords,
      firstRun: firstRun,
      setFirstRun: setFirstRun,
      selection: props.selection,
    },
    interactivity: {
      layoutFrozen: frozen,
      setLayoutFrozen: setLayoutFrozen,
      nodePositions: nodePositions,
      setNodePositions: setNodePositions,
      showPropertiesOnHover: showPropertiesOnHover,
      showPropertiesOnClick: showPropertiesOnClick,
      showPropertyInspector: inspectModalOpen,
      setPropertyInspectorOpen: setInspectModalOpen,
      fixNodeAfterDrag: fixNodeAfterDrag,
      handleExpand: handleExpand,
      onNodeClick: (item) => handleEntityClick(item),
      onRelationshipClick: (item) => handleEntityClick(item),
      drilldownLink: drilldownLink,
      selectedEntity: selectedEntity,
      setSelectedEntity: setSelectedEntity,
    },
    extensions: {
      styleRules: styleRules,
    },
  };

  return (
    <div ref={observe} style={{ width: '100%', height: '100%' }}>
      <NeoGraphChartCanvas>
        <NeoGraphChartFitViewButton {...chartProps} />
        {lockable ? <NeoGraphChartLockButton {...chartProps} /> : <></>}
        {drilldownLink ? <NeoGraphChartDeepLinkButton {...chartProps} /> : <></>}
        <NeoGraphChartVisualization2D {...chartProps} />
        <NeoGraphChartInspectModal {...chartProps}></NeoGraphChartInspectModal>
        {allowDownload && rows && rows.length > 0 ? (
        <Tooltip title='Download CSV' aria-label=''>
          <IconButton
            onClick={() => {
              downloadCSV(rows);
            }}
            aria-label='download csv'
            style={{ bottom: '9px', left: '3px', position: 'absolute' }}
          >
            <SaveAltIcon style={{ fontSize: '1.3rem', zIndex: 5 }} fontSize='small'></SaveAltIcon>
          </IconButton>
        </Tooltip>
      ) : (
        <></>
      )}
      </NeoGraphChartCanvas>
    </div>
  );
};

export default NeoGraphChart;
