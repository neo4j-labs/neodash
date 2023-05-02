import React, { useEffect, useState } from 'react';
import useDimensions from 'react-cool-dimensions';
import { ChartProps } from '../Chart';
import { NeoGraphChartInspectModal } from './component/GraphChartInspectModal';
import { NeoGraphChartVisualization2D } from './GraphChartVisualization2D';
import { NeoGraphChartDeepLinkButton } from './component/button/GraphChartDeepLinkButton';
import { NeoGraphChartCanvas } from './component/GraphChartCanvas';
import { NeoGraphChartLockButton } from './component/button/GraphChartLockButton';
import { NeoGraphChartFitViewButton } from './component/button/GraphChartFitViewButton';
import { buildGraphVisualizationObjectFromRecords } from './util/RecordUtils';
import { parseNodeIconConfig } from './util/NodeUtils';
import { GraphChartVisualizationProps, layouts } from './GraphChartVisualization';
import { handleExpand } from './util/ExplorationUtils';
import { categoricalColorSchemes } from '../../config/ColorConfig';
import { IconButton, Tooltip } from '@material-ui/core';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { RenderSubValue } from '../../report/ReportRecordProcessing';
import { downloadCSV } from '../ChartUtils';
import { GraphChartContextMenu } from './component/GraphChartContextMenu';
import { getSettings } from '../SettingsUtils';
import { generateSafeColumnKey } from '../table/TableChart';

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
  const settings = getSettings(props.settings, props.extensions, props.getGlobalParameter);
  const linkDirectionalParticles = props.settings && props.settings.relationshipParticles ? 5 : undefined;
  const arrowLengthProp = props?.settings?.arrowLengthProp ?? 3;

  let nodePositions = props.settings && props.settings.nodePositions ? props.settings.nodePositions : {};
  const parameters = props.parameters ? props.parameters : {};

  const setNodePositions = (positions) =>
    props.updateReportSetting && props.updateReportSetting('nodePositions', positions);
  const handleEntityClick = (item) => {
    setSelectedEntity(item);
    setContextMenuOpen(false);
    if (item !== undefined && settings.showPropertiesOnClick) {
      setInspectModalOpen(true);
    }
  };

  const handleEntityRightClick = (item, event) => {
    setSelectedEntity(item);
    setContextMenuOpen(true);
    setClickPosition({
      x: event.clientX,
      y: event.clientY,
    });
  };
  const frozen: boolean = props.settings && props.settings.frozen !== undefined ? props.settings.frozen : false;
  const [inspectModalOpen, setInspectModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(undefined);
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [recenterAfterEngineStop, setRecenterAfterEngineStop] = useState(true);
  const [cooldownTicks, setCooldownTicks] = useState(100);

  let [nodeLabels, setNodeLabels] = useState({});
  let [linkTypes, setLinkTypes] = useState({});
  const [data, setData] = useState({ nodes: [] as any[], links: [] as any[] });

  const setLayoutFrozen = (value) => {
    if (value == false) {
      setCooldownTicks(100);
      setRecenterAfterEngineStop(true);
      setNodePositions({});
    }
    props.updateReportSetting && props.updateReportSetting('frozen', value);
  };

  const setGraph = (nodes, links) => {
    setData({ nodes: nodes, links: links });
  };
  const setNodes = (nodes) => {
    setData({ nodes: nodes, links: data.links });
  };
  const setLinks = (links) => {
    setData({ nodes: data.nodes, links: links });
  };

  let icons = parseNodeIconConfig(settings.iconStyle);
  const colorScheme = categoricalColorSchemes[settings.nodeColorScheme];

  const generateVisualizationDataGraph = (records, _) => {
    let nodes: Record<string, any>[] = [];
    let links: Record<string, any>[] = [];
    const extractedGraphFromRecords = buildGraphVisualizationObjectFromRecords(
      records,
      nodes,
      links,
      nodeLabels,
      linkTypes,
      colorScheme,
      props.fields,
      settings.nodeColorProp,
      settings.defaultNodeColor,
      settings.nodeSizeProp,
      settings.defaultNodeSize,
      settings.relWidthProp,
      settings.defaultRelWidth,
      settings.relColorProp,
      settings.defaultRelColor,
      settings.styleRules,
      nodePositions,
      frozen
    );
    setData(extractedGraphFromRecords);
  };

  const { observe, width, height } = useDimensions({
    onResize: ({ observe, unobserve }) => {
      unobserve(); // To stop observing the current target element
      observe(); // To re-start observing the current target element
    },
  });

  const chartProps: GraphChartVisualizationProps = {
    data: {
      nodes: data.nodes,
      nodeLabels: nodeLabels,
      links: data.links,
      linkTypes: linkTypes,
      parameters: parameters,
      setGraph: setGraph,
      setNodes: setNodes,
      setLinks: setLinks,
      setNodeLabels: setNodeLabels,
      setLinkTypes: setLinkTypes,
    },
    style: {
      width: width,
      height: height,
      backgroundColor: settings.backgroundColor,
      linkDirectionalParticles: linkDirectionalParticles,
      linkDirectionalArrowLength: arrowLengthProp,
      linkDirectionalParticleSpeed: settings.linkDirectionalParticleSpeed,
      nodeLabelFontSize: settings.nodeLabelFontSize,
      nodeLabelColor: settings.nodeLabelColor,
      relLabelFontSize: settings.relLabelFontSize,
      relLabelColor: settings.relLabelColor,
      defaultNodeSize: settings.defaultNodeSize,
      nodeIcons: icons,
      colorScheme: colorScheme,
      nodeColorProp: settings.nodeColorProp,
      defaultNodeColor: settings.defaultNodeColor,
      nodeSizeProp: settings.nodeSizeProp,
      relWidthProp: settings.relWidthProp,
      defaultRelWidth: settings.defaultRelWidth,
      relColorProp: settings.relColorProp,
      defaultRelColor: settings.defaultRelColor,
    },
    engine: {
      layout: layouts[settings.layout],
      queryCallback: props.queryCallback,
      cooldownTicks: cooldownTicks,
      setCooldownTicks: setCooldownTicks,
      selection: props.selection,
      setSelection: () => {
        throw 'NotImplemented';
      },
      fields: props.fields,
      setFields: props.setFields,
      recenterAfterEngineStop: recenterAfterEngineStop,
      setRecenterAfterEngineStop: setRecenterAfterEngineStop,
    },
    interactivity: {
      enableExploration: settings.enableExploration,
      enableEditing: settings.enableEditing,
      layoutFrozen: frozen,
      setLayoutFrozen: setLayoutFrozen,
      nodePositions: nodePositions,
      setNodePositions: setNodePositions,
      showPropertiesOnHover: settings.showPropertiesOnHover,
      showPropertiesOnClick: settings.showPropertiesOnClick,
      showPropertyInspector: inspectModalOpen,
      setPropertyInspectorOpen: setInspectModalOpen,
      fixNodeAfterDrag: settings.fixNodeAfterDrag,
      handleExpand: handleExpand,
      setGlobalParameter: props.setGlobalParameter,
      setPageNumber: props.setPageNumber,
      pageNames: [],
      onNodeClick: (item) => handleEntityClick(item),
      onNodeRightClick: (item, event) => handleEntityRightClick(item, event),
      onRelationshipClick: (item) => handleEntityClick(item),
      onRelationshipRightClick: (item, event) => handleEntityRightClick(item, event),
      drilldownLink: settings.drilldownLink,
      selectedEntity: selectedEntity,
      setSelectedEntity: setSelectedEntity,
      contextMenuOpen: contextMenuOpen,
      setContextMenuOpen: setContextMenuOpen,
      clickPosition: clickPosition,
      setClickPosition: setClickPosition,
      createNotification: props.createNotification,
    },
    extensions: {
      styleRules: settings.styleRules,
      actionsRules: [],
    },
  };

  // When data is refreshed, rebuild the visualization data.
  useEffect(() => {
    generateVisualizationDataGraph(props.records, chartProps);
  }, [props.records]);

  return (
    <div ref={observe} style={{ width: '100%', height: '100%' }}>
      <NeoGraphChartCanvas>
        <GraphChartContextMenu {...chartProps} />
        <NeoGraphChartFitViewButton {...chartProps} />
        {settings.lockable ? <NeoGraphChartLockButton {...chartProps} /> : <></>}
        {settings.drilldownLink ? <NeoGraphChartDeepLinkButton {...chartProps} /> : <></>}
        <NeoGraphChartVisualization2D {...chartProps} />
        <NeoGraphChartInspectModal {...chartProps}></NeoGraphChartInspectModal>
        {settings.allowDownload && props.records && props.records.length > 0 ? (
          <Tooltip title='Download CSV' aria-label=''>
            <IconButton
              onClick={() => {
                const rows = props.records.map((record, rownumber) => {
                  return Object.assign(
                    { id: rownumber },
                    ...record._fields.map((field, i) => ({ [generateSafeColumnKey(record.keys[i])]: field }))
                  );
                });
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
