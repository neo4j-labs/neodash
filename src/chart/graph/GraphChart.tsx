import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import ReactDOMServer from 'react-dom/server';
import useDimensions from 'react-cool-dimensions';
import { categoricalColorSchemes } from '../../config/ColorConfig';
import { ChartProps } from '../Chart';
import { valueIsArray, valueIsNode, valueIsRelationship, valueIsPath } from '../../chart/ChartUtils';
import { NeoGraphItemInspectModal } from '../../modal/GraphItemInspectModal';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import SettingsOverscanIcon from '@material-ui/icons/SettingsOverscan';
import { Card, Fab, Tooltip } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import SearchIcon from '@material-ui/icons/Search';
import { evaluateRulesOnNode } from '../../extensions/styling/StyleRuleEvaluator';
import { extensionEnabled } from '../../extensions/ExtensionUtils';
import {
  actionRule,
  getCurvature,
  getPageFromPageNames,
  getRuleWithFieldPropertyName,
  merge,
  update
} from '../../extensions/advancedcharts/Utils';
import {connect} from "react-redux";
import {getPages} from "../../dashboard/DashboardSelectors";
import {createNotificationThunk} from "../../page/PageThunks";
import {forceRefreshPage} from "../../page/PageActions";
import {updateDashboardSetting} from "../../settings/SettingsActions";

const drawDataURIOnCanvas = (node, strDataURI, canvas, defaultNodeSize) => {
  let img = new Image();
  let prop = defaultNodeSize * 6;
  /* img.onload = function(){
      canvas.drawImage(img,node.x - (prop/2),node.y -(prop/2) , prop, prop);
  }*/

  img.src = strDataURI;
  canvas.drawImage(img, node.x - prop / 2, node.y - prop / 2, prop, prop);
};

// TODO: Fix experimental 3D graph visualization.
// const nodeTree = (node) => {
//     const imgTexture = new THREE.TextureLoader().load(`https://img.icons8.com/external-flaticons-lineal-color-flat-icons/344/external-url-gdpr-flaticons-lineal-color-flat-icons.png`);
//     const material = new THREE.SpriteMaterial({ map: imgTexture });
//     const sprite = new THREE.Sprite(material);
//     sprite.scale.set(12, 12);
//     return sprite;
// }

const layouts = {
  'force-directed': undefined,
  tree: 'td',
  radial: 'radialout',
};

const NeoGraphChart = (props: ChartProps) => {
  if (props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <>No data, re-run the report.</>;
  }

  // Retrieve config from advanced settings
  const backgroundColor = props.settings && props.settings.backgroundColor ? props.settings.backgroundColor : '#fafafa';
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
  const styleRules =
    extensionEnabled(props.extensions, 'styling') && props.settings && props.settings.styleRules
      ? props.settings.styleRules
      : [];
  const relLabelColor = props.settings && props.settings.relLabelColor ? props.settings.relLabelColor : '#a0a0a0';
  const nodeColorScheme = props.settings && props.settings.nodeColorScheme ? props.settings.nodeColorScheme : 'neodash';
  const showPropertiesOnHover =
    props.settings && props.settings.showPropertiesOnHover !== undefined ? props.settings.showPropertiesOnHover : true;
  const showPropertiesOnClick =
    props.settings && props.settings.showPropertiesOnClick !== undefined ? props.settings.showPropertiesOnClick : true;
  const fixNodeAfterDrag =
    props.settings && props.settings.fixNodeAfterDrag !== undefined ? props.settings.fixNodeAfterDrag : true;
  const layout = props.settings && props.settings.layout !== undefined ? props.settings.layout : 'force-directed';
  const lockable = props.settings && props.settings.lockable !== undefined ? props.settings.lockable : true;
  const drilldownLink =
    props.settings && props.settings.drilldownLink !== undefined ? props.settings.drilldownLink : '';
  const selfLoopRotationDegrees = 45;
  const rightClickToExpandNodes =
    props.settings && props.settings.rightClickToExpandNodes !== undefined
      ? props.settings.rightClickToExpandNodes
      : false; // TODO - this isn't working properly yet, disable it.
  const defaultNodeColor = 'lightgrey'; // Color of nodes without labels
  const linkDirectionalParticles = props.settings && props.settings.relationshipParticles ? 5 : undefined;
  const linkDirectionalParticleSpeed =
    props.settings && props.settings.relationshipParticleSpeed ? props.settings.relationshipParticleSpeed : 0.005; // Speed of particles on relationships.
  const actionsRules =
    extensionEnabled(props.extensions, 'actions') && props.settings && props.settings.actionsRules
      ? props.settings.actionsRules
      : [];

  const iconStyle = props.settings && props.settings.iconStyle !== undefined ? props.settings.iconStyle : '';
  let iconObject = undefined;
  try {
    iconObject = iconStyle ? JSON.parse(iconStyle) : undefined;
  } catch (error) {
    console.error(error);
  }

  const { observe, unobserve, width, height } = useDimensions({
    onResize: ({ observe, unobserve }) => {
      // Triggered whenever the size of the target is changed...
      unobserve(); // To stop observing the current target element
      observe(); // To re-start observing the current target element
    },
  });

  const { useRef } = React;
  // Return the actual graph visualization component with the parsed data and selected customizations.
  const fgRef = useRef();
  const [data, setData] = React.useState({ nodes: {}, links: {} });
  const [dataViz, setDataViz] = React.useState({ nodes: [], links: [] });
  const [firstRun, setFirstRun] = React.useState(true);
  const [frozen, setFrozen] = React.useState(
    props.settings && props.settings.frozen !== undefined ? props.settings.frozen : false
  );
  const [addExtraRecords, setAddExtraRecords] = React.useState([]);
  const [removeExtraRecords, setRemoveExtraRecords] = React.useState([]);
  const [refreshRecords, setRefreshRecords] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [inspectItem, setInspectItem] = React.useState({});

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Create the dictionary used for storing the memory of dragged node positions.
  if (props.settings && props.settings.nodePositions == undefined) {
    props.settings.nodePositions = {};
  }
  let nodePositions = props.settings && props.settings.nodePositions;

  // get dashboard parameters.
  const parameters = props.parameters ? props.parameters : {};

  const replaceDashboardParameters = (str) => {
    Object.keys(parameters).forEach((key) => {
      str = str.replaceAll(`$${key}`, parameters[key]);
    });
    return str;
  };

  // let nodeLabels = {};
  function extractGraphEntitiesFromField(value, nodes, links) {
    if (value == undefined) {
      return;
    }
    if (valueIsArray(value)) {
      value.forEach((v) => extractGraphEntitiesFromField(v, nodes, links));
    } else if (valueIsNode(value)) {
      // value.labels.forEach(l => nodeLabels[l] = true);
      nodes[value.identity.low] = {
        id: value.identity.low,
        labels: value.labels,
        size: value.properties[nodeSizeProp] ? value.properties[nodeSizeProp] : defaultNodeSize,
        properties: value.properties,
        lastLabel: value.labels[value.labels.length - 1],
      };
      if (frozen && nodePositions && nodePositions[value.identity.low]) {
        nodes[value.identity.low].fx = nodePositions[value.identity.low][0];
        nodes[value.identity.low].fy = nodePositions[value.identity.low][1];
      }
    } else if (valueIsRelationship(value)) {
      if (links[`${value.start.low},${value.end.low}`] == undefined) {
        links[`${value.start.low},${value.end.low}`] = [];
      }
      const addItem = (arr, item) => arr.find((x) => x.id === item.id) || arr.push(item);
      addItem(links[`${value.start.low},${value.end.low}`], {
        id: value.identity.low,
        source: value.start.low,
        target: value.end.low,
        type: value.type,
        width: value.properties[relWidthProp] ? value.properties[relWidthProp] : defaultRelWidth,
        color: value.properties[relColorProp] ? value.properties[relColorProp] : defaultRelColor,
        properties: value.properties,
      });
    } else if (valueIsPath(value)) {
      value.segments.map((segment) => {
        extractGraphEntitiesFromField(segment.start, nodes, links);
        extractGraphEntitiesFromField(segment.relationship, nodes, links);
        extractGraphEntitiesFromField(segment.end, nodes, links);
      });
    }
  }

  function extractNodesAndRelationshipsFromRecords(records) {
    if (records.length === 0) {
      return;
    }

    let nodes = {};
    let links = {};
    records.forEach((record) => {
      record._fields.forEach((field) => {
        extractGraphEntitiesFromField(field, nodes, links);
      });
    });

    return { nodes: nodes, links: links };
  }

  function mergeGraphData(mergeData, operation) {
    let nodesState = { ...data.nodes };
    let linksState = { ...data.links };
    return mergeData == undefined
      ? data
      : { nodes: merge(nodesState, mergeData.nodes, operation), links: merge(linksState, mergeData.links, operation) };
  }

  // TODO : CHECK AUTO REFRESH BEHAVIOR
  useEffect(() => {
    if (refreshRecords && refreshRecords.length > 0) {
      let data = extractNodesAndRelationshipsFromRecords(refreshRecords);
      // Here I need to check what action must be done. Let test the auto add btm
      setData(mergeGraphData(data, true));
    }
  }, [refreshRecords]);

  useEffect(() => {
    if (props.settings.r != 0) {
      setInterval(
        () => props.queryCallback && props.queryCallback(props.settings.q, props.settings.p, setRefreshRecords),
        5000
      );
    }
  }, []);

  useEffect(() => {
    setData(mergeGraphData(extractNodesAndRelationshipsFromRecords(props.records), true));
  }, [props.records]);

  useEffect(() => {
    let links = { ...data.links };
    let nodes = { ...data.nodes };
    const linksList = Object.values(links).map((nodePair) => {
      return nodePair.map((link, i) => {
        if (link.source == link.target) {
          // Self-loop
          return update(link, { curvature: 0.4 + i / 8 });
        }
        // If we also have edges from the target to the source, adjust curvatures accordingly.
        const mirroredNodePair = links[`${link.target},${link.source}`];
        if (!mirroredNodePair) {
          return update(link, { curvature: getCurvature(i, nodePair.length) });
        }
        return update(link, {
          curvature:
            (link.source > link.target ? 1 : -1) *
            getCurvature(
              link.source > link.target ? i : i + mirroredNodePair.length,
              nodePair.length + mirroredNodePair.length
            ),
        });
      });
    });

    const totalColors = categoricalColorSchemes[nodeColorScheme] ? categoricalColorSchemes[nodeColorScheme].length : 0;

    let nodeLabels = {};
    Object.values(nodes).forEach((node) =>
      node.labels.forEach((l) => {
        nodeLabels[l] = true;
        return true;
      })
    );
    const nodeLabelsList = Object.keys(nodeLabels).sort();
    const nodesList = Object.values(nodes).map((node) => {
      // First try to assign a node a color if it has a property specifying the color.
      let assignedColor = node.properties[nodeColorProp]
        ? node.properties[nodeColorProp]
        : totalColors > 0
        ? categoricalColorSchemes[nodeColorScheme][nodeLabelsList.indexOf(node.lastLabel) % totalColors]
        : 'grey';
      // Next, evaluate the custom styling rules to see if there's a rule-based override
      assignedColor = evaluateRulesOnNode(node, 'node color', assignedColor, styleRules);
      return update(node, { color: assignedColor ? assignedColor : defaultNodeColor });
    });

    setDataViz({ nodes: nodesList, links: linksList.flat() });
  }, [data]);

  // TODO - implement this.
  const handleExpand = useCallback((node, e) => {
    if (rightClickToExpandNodes) {
      if (e.ctrlKey) {
        props.queryCallback &&
          props.queryCallback(
            `MATCH (n)-[e]-(m) WHERE id(n) =${node.id} RETURN n,e limit 100`,
            {},
            setRemoveExtraRecords
          );
      } else {
        props.queryCallback &&
          props.queryCallback(`MATCH (n)-[e]-(m) WHERE id(n) =${node.id} RETURN e,m limit 100`, {}, setAddExtraRecords);
      }
    }
  }, []);

  useEffect(() => {
    if (addExtraRecords && addExtraRecords.length > 0) {
      setData(mergeGraphData(extractNodesAndRelationshipsFromRecords(addExtraRecords), true));
    }
  }, [addExtraRecords]);

  useEffect(() => {
    if (removeExtraRecords && removeExtraRecords.length > 0) {
      setData(mergeGraphData(extractNodesAndRelationshipsFromRecords(removeExtraRecords), false));
    }
  }, [removeExtraRecords]);

  const showPopup = useCallback((item) => {
    if (showPropertiesOnClick) {
      setInspectItem(item);
      handleOpen();
    }
  }, []);

  // Generates tooltips when hovering on nodes/relationships.
  const generateTooltip = (value) => {
    const tooltip = (
      <Card>
        <b style={{ padding: '10px' }}>
          {value.labels ? (value.labels.length > 0 ? value.labels.join(', ') : 'Node') : value.type}
        </b>

        {Object.keys(value.properties).length == 0 ? (
          <i>
            <br />
            (No properties)
          </i>
        ) : (
          <TableContainer>
            <Table size='small'>
              <TableBody>
                {Object.keys(value.properties)
                  .sort()
                  .map((key) => (
                    <TableRow key={key}>
                      <TableCell component='th' scope='row' style={{ padding: '3px', paddingLeft: '8px' }}>
                        {key}
                      </TableCell>
                      <TableCell align={'left'} style={{ padding: '3px', paddingLeft: '8px' }}>
                        {value.properties[key].toString().length <= 30
                          ? value.properties[key].toString()
                          : `${value.properties[key].toString().substring(0, 40)}...`}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>
    );
    return ReactDOMServer.renderToString(tooltip);
  };

  const renderNodeLabel = (node) => {
    const selectedProp = props.selection && props.selection[node.lastLabel];
    if (selectedProp == '(id)') {
      return node.id;
    }
    if (selectedProp == '(label)') {
      return node.labels;
    }
    if (selectedProp == '(no label)') {
      return '';
    }
    return node.properties[selectedProp] ? node.properties[selectedProp] : '';
  };

  return (
    <>
      <div
        ref={observe}
        style={{ paddingLeft: '10px', position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}
      >
        <Tooltip title='Fit graph to view.' aria-label=''>
          <SettingsOverscanIcon
            onClick={() => {
              fgRef.current.zoomToFit(400);
            }}
            style={{ fontSize: '1.3rem', opacity: 0.6, bottom: 11, right: 34, position: 'absolute', zIndex: 5 }}
            color='disabled'
            fontSize='small'
          />
        </Tooltip>
        {lockable ? (
          frozen ? (
            <Tooltip title='Toggle dynamic graph layout.' aria-label=''>
              <LockIcon
                onClick={() => {
                  setFrozen(false);
                  if (props.settings) {
                    props.settings.frozen = false;
                  }
                }}
                style={{ fontSize: '1.3rem', opacity: 0.6, bottom: 12, right: 12, position: 'absolute', zIndex: 5 }}
                color='disabled'
                fontSize='small'
              />
            </Tooltip>
          ) : (
            <Tooltip title='Toggle fixed graph layout.' aria-label=''>
              <LockOpenIcon
                onClick={() => {
                  if (nodePositions == undefined) {
                    nodePositions = {};
                  }
                  setFrozen(true);
                  if (props.settings) {
                    props.settings.frozen = true;
                  }
                }}
                style={{ fontSize: '1.3rem', opacity: 0.6, bottom: 12, right: 12, position: 'absolute', zIndex: 5 }}
                color='disabled'
                fontSize='small'
              />
            </Tooltip>
          )
        ) : (
          <></>
        )}
        {drilldownLink !== '' ? (
          <a href={replaceDashboardParameters(drilldownLink)} target='_blank'>
            <Fab
              style={{ position: 'absolute', backgroundColor: 'steelblue', right: '15px', zIndex: 50, top: '5px' }}
              color='primary'
              size='small'
              aria-label='search'
            >
              <Tooltip title='Investigate' aria-label=''>
                <SearchIcon />
              </Tooltip>
            </Fab>
          </a>
        ) : (
          <></>
        )}
        <ForceGraph2D
          ref={fgRef}
          width={width ? width - 10 : 0}
          height={height ? height - 10 : 0}
          linkCurvature='curvature'
          backgroundColor={backgroundColor}
          linkDirectionalArrowLength={3}
          linkDirectionalArrowRelPos={1}
          dagMode={layouts[layout]}
          linkWidth={(link) => link.width}
          linkLabel={(link) => (showPropertiesOnHover ? `<div>${generateTooltip(link)}</div>` : '')}
          nodeLabel={(node) => (showPropertiesOnHover ? `<div>${generateTooltip(node)}</div>` : '')}
          nodeVal={(node) => node.size}
          onNodeClick={(e) => {
            let rules = getRuleWithFieldPropertyName(e, actionsRules, 'onNodeClick', 'labels');
            rules != null ? rules.forEach((rule) => actionRule(rule, e, props)) : showPopup(e);
          }}
          onLinkClick={(e) => {
            let rules = getRuleWithFieldPropertyName(e, actionsRules, 'onLinkClick', 'type');
            rules != null ? rules.forEach((rule) => actionRule(rule, e, props)) : showPopup(e);
          }}
          onNodeRightClick={handleExpand}
          linkDirectionalParticles={linkDirectionalParticles}
          linkDirectionalParticleSpeed={linkDirectionalParticleSpeed}
          cooldownTicks={100}
          onEngineStop={() => {
            if (firstRun) {
              fgRef.current.zoomToFit(400);
              setFirstRun(false);
            }
          }}
          onNodeDragEnd={(node) => {
            if (fixNodeAfterDrag) {
              node.fx = node.x;
              node.fy = node.y;
            }
            if (frozen) {
              if (nodePositions == undefined) {
                nodePositions = {};
              }
              nodePositions[`${node.id}`] = [node.x, node.y];
            }
          }}
          nodeCanvasObjectMode={() => 'after'}
          nodeCanvasObject={(node, ctx) => {
            if (iconObject && iconObject[node.lastLabel]) {
              drawDataURIOnCanvas(node, iconObject[node.lastLabel], ctx, defaultNodeSize);
            } else {
              const label = props.selection && props.selection[node.lastLabel] ? renderNodeLabel(node) : '';
              const fontSize = nodeLabelFontSize;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.fillStyle = evaluateRulesOnNode(node, 'node label color', nodeLabelColor, styleRules);
              ctx.textAlign = 'center';
              ctx.fillText(label, node.x, node.y + 1);
              if (frozen && !node.fx && !node.fy && nodePositions) {
                node.fx = node.x;
                node.fy = node.y;
                nodePositions[`${node.id}`] = [node.x, node.y];
              }
              if (!frozen && node.fx && node.fy && nodePositions && nodePositions[node.id]) {
                nodePositions[node.id] = undefined;
                node.fx = undefined;
                node.fy = undefined;
              }
            }
          }}
          linkCanvasObjectMode={() => 'after'}
          linkCanvasObject={(link, ctx) => {
            const label = link.properties.name || link.type || link.id;
            const fontSize = relLabelFontSize;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.fillStyle = relLabelColor;
            if (link && link.target && link.source && link.target != link.source) {
              const lenX = link.target.x - link.source.x;
              const lenY = link.target.y - link.source.y;
              const posX = link.target.x - lenX / 2;
              const posY = link.target.y - lenY / 2;
              const length = Math.sqrt(lenX * lenX + lenY * lenY);
              const angle = Math.atan(lenY / lenX);
              ctx.save();
              ctx.translate(posX, posY);
              ctx.rotate(angle);
              // Mirrors the curvatures when the label is upside down.
              const mirror = link.source.x > link.target.x ? 1 : -1;
              ctx.textAlign = 'center';
              if (link.curvature) {
                ctx.fillText(label, 0, mirror * length * link.curvature * 0.5);
              } else {
                ctx.fillText(label, 0, 0);
              }
              ctx.restore();
            } else {
              ctx.save();
              ctx.translate(link.source.x, link.source.y);
              ctx.rotate((Math.PI * selfLoopRotationDegrees) / 180);
              ctx.textAlign = 'center';
              ctx.fillText(label, 0, -18.7 + -37.1 * (link.curvature - 0.5));
              ctx.restore();
            }
          }}
          graphData={width ? dataViz : { nodes: [], links: [] }}
        />
        <NeoGraphItemInspectModal
          open={open}
          handleClose={handleClose}
          title={(inspectItem.labels && inspectItem.labels.join(', ')) || inspectItem.type}
          object={inspectItem.properties}
        />
      </div>
    </>
  );
};

export default NeoGraphChart;
