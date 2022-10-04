// This file contains utilities for rendering the graph visualization
// e.g. tooltips, image nodes, etc.

/*
Method to draw an image on a node of the graph.
 */
import {ChartProps} from "../Chart";

export const drawDataURIOnCanvas = (node, strDataURI, canvas, defaultNodeSize) => {
    var img = new Image;
    let prop = defaultNodeSize * 6;
    img.src = strDataURI;
    canvas.drawImage(img,node.x - (prop/2),node.y -(prop/2) , prop, prop);
}
/*
Possible layout options of the graph
 */
export const graphLayout = {
    "force-directed": undefined,
    "tree": "td",
    "radial": "radialout"
};

const DEFAULT_NODE_SIZE_PROP = "size"
const DEFAULT_NODE_COLOR_PROP = "color"
const DEFAULT_NODE_LABEL_COLOR = "black"
const DEFAULT_NODE_SIZE_VALUE = 2
const DEFAULT_NODE_LABEL_FONT_SIZE = 3.5
const DEFAULT_NODE_LABEL_COLOR_SCHEME = 3.5
const DEFAULT_NODE_COLOR = "lightgrey"
const DEFAULT_REL_WIDTH_COLOR = "width"
const DEFAULT_REL_COLOR_PROP = "color"
const DEFAULT_REL_WIDTH_VALUE = 1
const DEFAULT_REL_COLOR_VALUE = "#a0a0a0"
const DEFAULT_REL_LABEL_FONT_SIZE = 2.75
const DEFAULT_REL_LINK_DIRECTIONAL_PARTICLES = 5
const DEFAULT_REL_LINK_DIRECTIONAL_PARTICLES_SPEED = 0.005



/*
Extract the necessary options from the chartProps
 */
export const getGraphChartProps = (props:ChartProps) => {

    // Node Props
    const nodeSizeProp = props.settings && props.settings.nodeSizeProp ? props.settings.nodeSizeProp : DEFAULT_NODE_SIZE_PROP;
    const nodeColorProp = props.settings && props.settings.nodeColorProp ? props.settings.nodeColorProp : DEFAULT_NODE_COLOR_PROP;
    const nodeLabelColor = props.settings && props.settings.nodeLabelColor ? props.settings.nodeLabelColor : DEFAULT_NODE_LABEL_COLOR;
    const defaultNodeSize = props.settings && props.settings.defaultNodeSize ? props.settings.defaultNodeSize : DEFAULT_NODE_SIZE_VALUE;
    const nodeLabelFontSize = props.settings && props.settings.nodeLabelFontSize ? props.settings.nodeLabelFontSize : DEFAULT_NODE_LABEL_FONT_SIZE;
    const nodeColorScheme = props.settings && props.settings.nodeColorScheme ? props.settings.nodeColorScheme : DEFAULT_NODE_LABEL_COLOR_SCHEME;
    const defaultNodeColor = DEFAULT_NODE_COLOR; // Color of nodes without labels
    const fixNodeAfterDrag = props.settings && props.settings.fixNodeAfterDrag !== undefined ? props.settings.fixNodeAfterDrag : true;

    // Rel props
    const relWidthProp = props.settings && props.settings.relWidthProp ? props.settings.relWidthProp : DEFAULT_REL_WIDTH_COLOR;
    const relColorProp = props.settings && props.settings.relColorProp ? props.settings.relColorProp : DEFAULT_REL_COLOR_PROP;
    const defaultRelWidth = props.settings && props.settings.defaultRelWidth ? props.settings.defaultRelWidth : DEFAULT_REL_WIDTH_VALUE;
    const defaultRelColor = props.settings && props.settings.defaultRelColor ? props.settings.defaultRelColor : DEFAULT_REL_COLOR_VALUE;
    const relLabelFontSize = props.settings && props.settings.relLabelFontSize ? props.settings.relLabelFontSize : DEFAULT_REL_LABEL_FONT_SIZE;

    // Animation props
    const linkDirectionalParticles = props.settings && props.settings.relationshipParticles ? DEFAULT_REL_LINK_DIRECTIONAL_PARTICLES : undefined;
    const linkDirectionalParticleSpeed = DEFAULT_REL_LINK_DIRECTIONAL_PARTICLES_SPEED; // Speed of particles on relationships.

    // General options
    const backgroundColor = props.settings && props.settings.backgroundColor ? props.settings.backgroundColor : "#fafafa";
    const relLabelColor = props.settings && props.settings.relLabelColor ? props.settings.relLabelColor : "#a0a0a0";
    const styleRules = props.settings && props.settings.styleRules ? props.settings.styleRules : [];
    const showPropertiesOnHover = props.settings && props.settings.showPropertiesOnHover !== undefined ? props.settings.showPropertiesOnHover : true;
    const showPropertiesOnClick = props.settings && props.settings.showPropertiesOnClick !== undefined ? props.settings.showPropertiesOnClick : true;
    const layout = props.settings && props.settings.layout !== undefined ? props.settings.layout : "force-directed";
    const lockable = props.settings && props.settings.lockable !== undefined ? props.settings.lockable : true;
    const drilldownLink = props.settings && props.settings.drilldownLink !== undefined ? props.settings.drilldownLink : "";
    const selfLoopRotationDegrees = 45;
    const rightClickToExpandNodes = false; // TODO - this isn't working properly yet, disable it.
    const iconStyle = props.settings && props.settings.iconStyle !== undefined ? props.settings.iconStyle : "";
    return {
        backgroundColor,
        nodeSizeProp,
        nodeColorProp,
        defaultNodeSize,
        relWidthProp,
        relColorProp,
        defaultRelWidth,
        defaultRelColor,
        nodeLabelColor,
        nodeLabelFontSize,
        relLabelFontSize,
        styleRules,
        relLabelColor,
        nodeColorScheme,
        showPropertiesOnHover,
        showPropertiesOnClick,
        fixNodeAfterDrag,
        layout,
        lockable,
        drilldownLink,
        selfLoopRotationDegrees,
        rightClickToExpandNodes,
        defaultNodeColor,
        linkDirectionalParticles,
        linkDirectionalParticleSpeed,
        iconStyle
    };
}
