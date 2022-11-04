import React, { useCallback, useEffect, useRef, useState } from 'react';
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

const drawDataURIOnCanvas = (node, strDataURI, canvas, defaultNodeSize) => {
  const img = new Image();
  const prop = defaultNodeSize * 6;
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

const update = (state, mutations) => Object.assign({}, state, mutations);

const layouts = {
  'force-directed': undefined,
  tree: 'td',
  radial: 'radialout',
};

/**
 * Draws graph data using a force-directed-graph visualization.
 * This visualization is powered by `react-force-graph`.
 * See https://github.com/vasturiano/react-force-graph for examples on customization.
 */
const NeoGraphChart = (props: ChartProps) => {
  if (props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <>No data, re-run the report.</>;
  }

  const [open, setOpen] = useState(false);
  const [firstRun, setFirstRun] = useState(true);
  const [inspectItem, setInspectItem] = useState({});

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
  const styleRules = props.settings && props.settings.styleRules ? props.settings.styleRules : [];
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
  const rightClickToExpandNodes = false; // TODO - this isn't working properly yet, disable it.
  const defaultNodeColor = 'lightgrey'; // Color of nodes without labels
  const linkDirectionalParticles = props.settings && props.settings.relationshipParticles ? 5 : undefined;
  const linkDirectionalParticleSpeed =
    props.settings && props.settings.relationshipParticleSpeed ? props.settings.relationshipParticleSpeed : 0.005; // Speed of particles on relationships.
  const iconStyle = props.settings && props.settings.iconStyle !== undefined ? props.settings.iconStyle : '';
  let iconObject = undefined;
  try {
    iconObject = iconStyle ? JSON.parse(iconStyle) : undefined;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  // get dashboard parameters.
  const parameters = props.parameters ? props.parameters : {};

  const [data, setData] = useState({ nodes: [], links: [] });

  // Create the dictionary used for storing the memory of dragged node positions.
  if (props.settings.nodePositions == undefined) {
    props.settings.nodePositions = {};
  }
  let nodePositions = props.settings && props.settings.nodePositions;

  // 'frozen' indicates that the graph visualization engine is paused, node positions and stored and only dragging is possible.
  const [frozen, setFrozen] = useState(
    props.settings && props.settings.frozen !== undefined ? props.settings.frozen : false,
  );

  // Currently unused, but dynamic graph exploration could be done with these records.
  const [extraRecords, setExtraRecords] = useState([]);

  // When data is refreshed, rebuild the visualization data.
  useEffect(() => {
    buildVisualizationDictionaryFromRecords(props.records);
  }, []);

  const { observe, width, height } = useDimensions({
    onResize: ({ observe, unobserve }) => {
      // Triggered whenever the size of the target is changed...
      unobserve(); // To stop observing the current target element
      observe(); // To re-start observing the current target element
    },
  });

  // Dictionaries to populate based on query results.
  const nodes = {};
  const nodeLabels = {};
  const links = {};
  const linkTypes = {};

  // Gets all graphy objects (nodes/relationships) from the complete set of return values.
  function extractGraphEntitiesFromField(value) {
    if (value == undefined) {
      return;
    }

    const [open, setOpen] = React.useState(false);
    const [firstRun, setFirstRun] = React.useState(true);
    const [inspectItem, setInspectItem] = React.useState({});

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Retrieve config from advanced settings
    const backgroundColor = props.settings && props.settings.backgroundColor ? props.settings.backgroundColor : "#fafafa";
    const nodeSizeProp = props.settings && props.settings.nodeSizeProp ? props.settings.nodeSizeProp : "size";
    const nodeColorProp = props.settings && props.settings.nodeColorProp ? props.settings.nodeColorProp : "color";
    const defaultNodeSize = props.settings && props.settings.defaultNodeSize ? props.settings.defaultNodeSize : 2;
    const relWidthProp = props.settings && props.settings.relWidthProp ? props.settings.relWidthProp : "width";
    const relColorProp = props.settings && props.settings.relColorProp ? props.settings.relColorProp : "color";
    const defaultRelWidth = props.settings && props.settings.defaultRelWidth ? props.settings.defaultRelWidth : 1;
    const defaultRelColor = props.settings && props.settings.defaultRelColor ? props.settings.defaultRelColor : "#a0a0a0";
    const nodeLabelColor = props.settings && props.settings.nodeLabelColor ? props.settings.nodeLabelColor : "black";
    const nodeLabelFontSize = props.settings && props.settings.nodeLabelFontSize ? props.settings.nodeLabelFontSize : 3.5;
    const relLabelFontSize = props.settings && props.settings.relLabelFontSize ? props.settings.relLabelFontSize : 2.75;
    const styleRules = extensionEnabled(props.extensions, 'styling') && props.settings && props.settings.styleRules ? props.settings.styleRules : [];
    const relLabelColor = props.settings && props.settings.relLabelColor ? props.settings.relLabelColor : "#a0a0a0";
    const nodeColorScheme = props.settings && props.settings.nodeColorScheme ? props.settings.nodeColorScheme : "neodash";
    const showPropertiesOnHover = props.settings && props.settings.showPropertiesOnHover !== undefined ? props.settings.showPropertiesOnHover : true;
    const showPropertiesOnClick = props.settings && props.settings.showPropertiesOnClick !== undefined ? props.settings.showPropertiesOnClick : true;
    const fixNodeAfterDrag = props.settings && props.settings.fixNodeAfterDrag !== undefined ? props.settings.fixNodeAfterDrag : true;
    const layout = props.settings && props.settings.layout !== undefined ? props.settings.layout : "force-directed";
    const lockable = props.settings && props.settings.lockable !== undefined ? props.settings.lockable : true;
    const drilldownLink = props.settings && props.settings.drilldownLink !== undefined ? props.settings.drilldownLink : "";
    const selfLoopRotationDegrees = 45;
    const rightClickToExpandNodes = false; // TODO - this isn't working properly yet, disable it.
    const defaultNodeColor = "lightgrey"; // Color of nodes without labels
    const linkDirectionalParticles = props.settings && props.settings.relationshipParticles ? 5 : undefined;
    const linkDirectionalParticleSpeed = props.settings && props.settings.relationshipParticleSpeed ? props.settings.relationshipParticleSpeed : 0.005; // Speed of particles on relationships.
    const iconStyle = props.settings && props.settings.iconStyle !== undefined ? props.settings.iconStyle : "";
    let iconObject = undefined;
    try {
        iconObject = iconStyle ? JSON.parse(iconStyle) : undefined;
    } catch (error) {
        console.error(error);
    }
  }

  // Function to manually compute curvatures for dense node pairs.
  function getCurvature(index, total) {
    if (total <= 6) {
      // Precomputed edge curvatures for nodes with multiple edges in between.
      const curvatures = {
        0: 0,
        1: 0,
        2: [-0.5, 0.5], // 2 = Math.floor(1/2) + 1
        3: [-0.5, 0, 0.5], // 2 = Math.floor(3/2) + 1
        4: [-0.66666, -0.33333, 0.33333, 0.66666], // 3 = Math.floor(4/2) + 1
        5: [-0.66666, -0.33333, 0, 0.33333, 0.66666], // 3 = Math.floor(5/2) + 1
        6: [-0.75, -0.5, -0.25, 0.25, 0.5, 0.75], // 4 = Math.floor(6/2) + 1
        7: [-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75], // 4 = Math.floor(7/2) + 1
      };
      return curvatures[total][index];
    }
    const arr1 = [...Array(Math.floor(total / 2)).keys()].map((i) => {
      return (i + 1) / (Math.floor(total / 2) + 1);
    });
    const arr2 = total % 2 == 1 ? [0] : [];
    const arr3 = [...Array(Math.floor(total / 2)).keys()].map((i) => {
      return (i + 1) / -(Math.floor(total / 2) + 1);
    });
    return arr1.concat(arr2).concat(arr3)[index];
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
              nodePair.length + mirroredNodePair.length,
            ),
        });
      });
    });

    // Assign proper colors to nodes.
    const totalColors = categoricalColorSchemes[nodeColorScheme] ? categoricalColorSchemes[nodeColorScheme].length : 0;
    const nodeLabelsList = Object.keys(nodeLabels);
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

    // Set the data dictionary that is read by the visualization.
    setData({
      nodes: nodesList,
      links: linksList.flat(),
    });
  }

  // Replaces all global dashboard parameters inside a string with their values.
  function replaceDashboardParameters(str) {
    Object.keys(parameters).forEach((key) => {
      str = str.replaceAll(`$${key}`, parameters[key]);
    });
    return str;
  }

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
            <Table size="small">
              <TableBody>
                {Object.keys(value.properties)
                  .sort()
                  .map((key) => (
                    <TableRow key={key}>
                      <TableCell component="th" scope="row" style={{ padding: '3px', paddingLeft: '8px' }}>
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

  // TODO - implement this.
  const handleExpand = useCallback((node) => {
    if (rightClickToExpandNodes) {
      props.queryCallback &&
        props.queryCallback(`MATCH (n)-[e]-(m) WHERE id(n) =${node.id} RETURN e,m`, {}, setExtraRecords);
    }
  }, []);

  const showPopup = useCallback((item) => {
    if (showPropertiesOnClick) {
      setInspectItem(item);
      handleOpen();
    }
  }, []);

  const showPopup2 = useCallback((item) => {
    if (showPropertiesOnClick) {
      setInspectItem(item);
      handleOpen();
    }
  }, []);

  // If the set of extra records gets updated (e.g. on relationship expand), rebuild the graph.
  useEffect(() => {
    buildVisualizationDictionaryFromRecords(props.records.concat(extraRecords));
  }, [extraRecords]);

  // Return the actual graph visualization component with the parsed data and selected customizations.
  const fgRef = useRef();
  return (
    <>
      <div
        ref={observe}
        style={{ paddingLeft: '10px', position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}
      >
        <Tooltip title="Fit graph to view." aria-label="">
          <SettingsOverscanIcon
            onClick={() => {
              fgRef.current.zoomToFit(400);
            }}
            style={{ fontSize: '1.3rem', opacity: 0.6, bottom: 11, right: 34, position: 'absolute', zIndex: 5 }}
            color="disabled"
            fontSize="small"
          ></SettingsOverscanIcon>
        </Tooltip>
        {lockable ? (
          frozen ? (
            <Tooltip title="Toggle dynamic graph layout." aria-label="">
              <LockIcon
                onClick={() => {
                  setFrozen(false);
                  if (props.settings) {
                    props.settings.frozen = false;
                  }
                }}
                style={{ fontSize: '1.3rem', opacity: 0.6, bottom: 12, right: 12, position: 'absolute', zIndex: 5 }}
                color="disabled"
                fontSize="small"
              ></LockIcon>
            </Tooltip>
          ) : (
            <Tooltip title="Toggle fixed graph layout." aria-label="">
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
                color="disabled"
                fontSize="small"
              ></LockOpenIcon>
            </Tooltip>
          )
        ) : (
          <></>
        )}
        {drilldownLink !== '' ? (
          <a href={replaceDashboardParameters(drilldownLink)} target="_blank">
            <Fab
              style={{ position: 'absolute', backgroundColor: 'steelblue', right: '15px', zIndex: 50, top: '5px' }}
              color="primary"
              size="small"
              aria-label="search"
            >
              <Tooltip title="Investigate" aria-label="">
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
          linkCurvature="curvature"
          backgroundColor={backgroundColor}
          linkDirectionalArrowLength={3}
          linkDirectionalArrowRelPos={1}
          dagMode={layouts[layout]}
          linkWidth={(link) => link.width}
          linkLabel={(link) => (showPropertiesOnHover ? `<div>${generateTooltip(link)}</div>` : '')}
          nodeLabel={(node) => (showPropertiesOnHover ? `<div>${generateTooltip(node)}</div>` : '')}
          nodeVal={(node) => node.size}
          onNodeClick={showPopup}
          // nodeThreeObject = {nodeTree}
          onLinkClick={showPopup}
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
            if (link.target != link.source) {
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
          graphData={width ? data : { nodes: [], links: [] }}
        />

        <NeoGraphItemInspectModal
          open={open}
          handleClose={handleClose}
          title={(inspectItem.labels && inspectItem.labels.join(', ')) || inspectItem.type}
          object={inspectItem.properties}
        ></NeoGraphItemInspectModal>
      </div>
    </>
  );
};

export default NeoGraphChart;
