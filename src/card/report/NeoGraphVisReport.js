import * as d3 from "d3";
import React from "react";
import NeoReport from "./NeoReport";

/**
 * A NeoGraphVis report will contain a force-directed graph visualization.
 * This visualization is similar to the one provided by Neo4j browser.
 */
class NeoGraphVisReport extends NeoReport {
    constructor(props) {
        super(props);
    }
    /**
     * Converts Neo4j query results into a graph representation that D3 can work with.
     * Return type is a dictionary 'graph' with nodes, relationships and labels.
     */
    convertDataToGraph() {
        let graph = {nodes: [], links: [], nodeLabelsMap: {}}

        if (this.state.data == null) {
            return graph;
        }
        // To ensure we do not render duplicates, we build sets of nodes, relationships and labels.
        let nodesMap = {}
        let nodeLabelsMap = {}
        let linksMap = {}

        // First, iterate over the result rows to collect the unique nodes.
        // We handle different types of return objects in different ways.
        // These types are single nodes, arrays of nodes and paths.
        // This also handles finding all unique node labels we have in the entire result set.
        this.state.data.forEach(row => {
            Object.values(row).forEach(value => {
                // single nodes
                if (value && value["labels"] && value["identity"] && value["properties"]) {
                    this.extractNodeInfo(value, nodeLabelsMap, nodesMap);
                }
                // arrays of nodes
                if (value && Array.isArray(value)) {
                    value.forEach(item => {
                        if (item["labels"] && item["identity"] && item["properties"]) {
                            this.extractNodeInfo(item, nodeLabelsMap, nodesMap);
                        }
                    })
                }
                // paths
                if (value && value["start"] && value["end"] && value["segments"] && value["length"]) {
                    this.extractNodeInfo(value.start, nodeLabelsMap, nodesMap);
                    value.segments.forEach(segment => {
                        this.extractNodeInfo(segment.end, nodeLabelsMap, nodesMap);
                    });
                }
            })
        });

        // Then, also extract the relationships from the result set.
        // We store only unique relationships. where uniqueness is defined by the tuple [startNode, endNode, relId].

        // As a preprocessing step, we first sort the relationships in groups that share the same start/end nodes.
        // This is done by building a dictionary where the key is the tuple [startNodeId, endNodeId], and the value
        // is the relationship ID.

        // Additionally, preprocess the relationships and sort them such that startNode is always the lowest ID.

        // We also store a seperate dict with [startNodeId, endNodeId] as the key, and directions as values.

        let relsVisited = {}
        let relsVisitedDirections = {}
        this.state.data.forEach(row => {
            Object.values(row).forEach(value => {
                // single rel
                if (value && value["type"] && value["start"] && value["end"] && value["identity"] && value["properties"]) {
                    this.preprocessVisitedRelationships(value, relsVisited, relsVisitedDirections);
                }
                // arrays of rel
                if (value && Array.isArray(value)) {
                    value.forEach(item => {
                        if (item["type"] && item["start"] && item["end"] && item["identity"] && item["properties"]) {
                            this.preprocessVisitedRelationships(item, relsVisited, relsVisitedDirections);
                        }
                    })
                }
                // paths
                if (value && value["start"] && value["end"] && value["segments"] && value["length"]) {
                    value.segments.forEach(segment => {
                        this.preprocessVisitedRelationships(segment.relationship, relsVisited, relsVisitedDirections);
                    });
                }
            });
        })

        // Now, we use the preprocessed relationship data as well as the built nodesMap.
        // With this data, we can build a graph.nodesMap and graph.linksMap object that D3 can work with.
        this.state.data.forEach(row => {
            Object.values(row).forEach(value => {
                // single rel
                if (value && value["type"] && value["start"] && value["end"] && value["identity"] && value["properties"]) {
                    this.extractRelInfo(value, nodesMap, linksMap, relsVisited, relsVisitedDirections);
                }
                // arrays of rel
                if (value && Array.isArray(value)) {
                    value.forEach(item => {
                        if (item["type"] && item["start"] && item["end"] && item["identity"] && item["properties"]) {
                            this.extractRelInfo(item, nodesMap, linksMap, relsVisited, relsVisitedDirections);
                        }
                    })
                }
                // paths
                if (value && value["start"] && value["end"] && value["segments"] && value["length"]) {
                    // this.extractNodeInfo(value.start, nodeLabelsMap, nodesMap);
                    value.segments.forEach(segment => {
                        this.extractRelInfo(segment.relationship, nodesMap, linksMap, relsVisited, relsVisitedDirections);
                    });
                }
            });
        })

        graph.nodes = Object.values(nodesMap)
        graph.links = Object.values(linksMap)
        graph.nodeLabels = Object.keys(nodeLabelsMap)


        // Trigger a refresh of the graph visualization.
        this.props.onNodeLabelUpdate(nodeLabelsMap)
        return graph
    }

    /**
     * Convert a Neo4j node result representation `node` into a format the visualization expects.
     * The 'visualization-supported' representation will be added to the nodesMap dictionary.
     * @param value - a Neo4j node representation as produced as a query result by the javascript driver.
     * @param nodeLabelsMap - a dictionary of currently identified node labels.
     * @param nodesMap - a (to-be-constructed) dictionary of nodes to visualize.
     */
    extractNodeInfo(value, nodeLabelsMap, nodesMap) {
        value["labels"].forEach(l => {
            if (!nodeLabelsMap[l]) {
                nodeLabelsMap[l] = Object.keys(value['properties'])
            } else {
                Object.keys(value['properties']).forEach(prop => {
                    if (nodeLabelsMap[l].indexOf(prop) === -1) {
                        nodeLabelsMap[l] = nodeLabelsMap[l].concat(prop)
                    }
                });
            }
        });
        nodesMap["" + value['identity']['low']] = {
            id: value['identity']['low'],
            fill: 'seagreen',
            stroke: "#666",
            radius: 25,
            properties: value['properties'],
            labels: value['labels']
        }
    }

    /**
     * Identify the unique SET of relationships returned by the query.
     * In other words, remove all duplicates from the result set and store them in 'relsVisited' and 'relsVisitedDirections'.
     *
     * @param value - a relationship query result, as returned by the javascript driver
     * @param relsVisited - a dictionary of unique relationships in the result set.
     * @param relsVisitedDirections - a dictionary of unique relationships with directions in the result set.
     */
    preprocessVisitedRelationships(value, relsVisited, relsVisitedDirections) {
        let minIndex = Math.min(value["start"]["low"], value["end"]["low"])
        let maxIndex = Math.max(value["start"]["low"], value["end"]["low"])
        if (relsVisited[[minIndex, maxIndex]] == null) {
            relsVisited[[minIndex, maxIndex]] = [];
            relsVisitedDirections[[minIndex, maxIndex]] = [];
        }
        // if this is a new one, append it.
        // TODO - this is potentially an O(n) operation, checking if a list contains a value.
        if(!relsVisited[[minIndex, maxIndex]].includes(value['identity']['low'])){
            relsVisited[[minIndex, maxIndex]].push(value['identity']['low']);
            relsVisitedDirections[[minIndex, maxIndex]].push(value['start']['low'] === minIndex);
        }


    }

    /**
     * After we've collected the unique set of relationships in 'preprocessVisitedRelationships()'.
     * Build the graph representation that the visualization supports.
     */
    extractRelInfo(value, nodesMap, linksMap, relsVisited, relsVisitedDirections) {
        let minIndex = Math.min(value["start"]["low"], value["end"]["low"])
        let maxIndex = Math.max(value["start"]["low"], value["end"]["low"])
        let isEvenLength = (relsVisited[[minIndex, maxIndex]].length % 2 == 0)
        linksMap["" + value['identity']['low']] = {
            source: value["start"]["low"],
            target: value["end"]["low"],
            type: value["type"],
            count: relsVisited[[minIndex, maxIndex]].indexOf(value['identity']['low']) + (isEvenLength ? 1 : 0),
            totalCount: relsVisited[[minIndex, maxIndex]].length + (isEvenLength ? 1 : 0),
            direction: relsVisitedDirections[[minIndex, maxIndex]][relsVisited[[minIndex, maxIndex]].indexOf(value['identity']['low']) ]
        }
        if (!nodesMap["" + value['start']['low']]) {
            nodesMap["" + value['start']['low']] = {
                id: value['start']['low'],
                fill: 'seagreen',
                stroke: "#666",
                radius: 25,
                properties: [],
                labels: []
            }
        }
        if (!nodesMap["" + value['end']['low']]) {
            nodesMap["" + value['end']['low']] = {
                id: value['end']['low'],
                fill: 'seagreen',
                stroke: "#666",
                radius: 25,
                properties: [],
                labels: []
            }
        }
    }

    /**
     * After the component mounts, build the D3 Visualization from the query results provided to the report.
     */
    componentDidMount() {
        // Default node colors.
        let colors = ["#588c7e", "#f2e394", "#f2ae72", "#d96459", "#5b9aa0", "#d6d4e0", "#b8a9c9", "#622569", "#ddd5af", "#d9ad7c", "#a2836e", "#674d3c", "grey"]

        // Handle optional override of node colors in the visualization.
        let parsedParameters = this.props.params;
        if (parsedParameters && parsedParameters.nodeColors) {
            if (typeof (parsedParameters.nodeColors) === 'string') {
                colors = [parsedParameters.nodeColors]
            } else {
                colors = parsedParameters.nodeColors
            }
        }
        // Convert the Cypher query result into a nodesMap, relsMap and nodeLabelsMap on the graph object.
        let graph = this.convertDataToGraph();
        this.state.nodeLabels = graph.nodeLabels

        // chart dimensions generated based on the size of the current report.
        var width = this.props.clientWidth - 50; //-90 + props.width * 105 - xShift * 0.5;
        var height = -145 + this.props.height * 100;

        // set up svg for d3.
        svg = d3.select('.chart' + this.props.id).attr("transform", null);
        let zoom = d3.zoom();
        zoom.transform(svg, d3.zoomIdentity);
        var svg = d3.select('.chart' + this.props.id)
            .attr("width", width)
            .attr("height", height)
            .attr("class", "chart")
            .call(zoom.on("zoom", function () {
                svg.attr("transform", d3.event.transform)
            }))
            .append("g");

        // Add force directed graph simulation to SVG.
        var simulation = d3.forceSimulation()
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("link", d3.forceLink().strength(function (d) {
                // If two relationships share one or more nodes, add a force of 0.1 between them.
                if (d.count === 0 && d.totalCount % 2 === 0) {
                    return 0.1;
                } else if (d.totalCount === 1) {
                    return 0.1;
                } else if (d.count === 1 && d.totalCount % 2 === 1) {
                    return 0.1;
                } else {
                    return 0.0;
                }

            }).id(function (d) {
                return d.id;
            }))

            .force("charge", d3.forceManyBody().strength(-50))
            .force("collide", d3.forceCollide().strength(1).radius(function (d) {
                // A strong force pushing away nodes from eachother when they get real close.
                return d.radius * 1.2
            }))
            .force("collide", d3.forceCollide().strength(0.1).radius(function (d) {
                // A weak force pushing away nodes from eachother when they are kind of close.
                return d.radius * 2.4
            }));


        var prevSelected;

        function handePopUp(d, i) {
            function prettifyNodePropertyAsString(d, item) {
                if (d.properties[item]["low"]){
                    return JSON.stringify(d.properties[item]["low"]);
                }
                return JSON.stringify(d.properties[item]);
            }

            // Render a nice pop-up when we click a node.
            let circ = svg.selectAll("text").filter(c => d === c);
            svg.selectAll("tspan").remove();
            svg.selectAll("text").attr('filter', "none")
            if (circ !== null && circ.node() === prevSelected) {
                prevSelected = null;
                return
            }
            circ.node().parentNode.appendChild(circ.node());
            circ.attr('filter', "url(#solid)")

            circ.append("tspan").attr("x", d.x).attr("dy", -25).text(" ")
            Object.keys(d.properties).forEach((item, i) => {
                circ.append("tspan")
                    .attr("dy", (i === 0) ? 60 : 15)
                    .attr("x", d.x)
                    .text(function () {
                        let string = JSON.stringify(item) + ": " + prettifyNodePropertyAsString(d, item);
                        return string.substr(0, Math.min(100, string.length));
                    });

            })
            prevSelected = circ.node();
        }

        // Style properties for the links drawn by the visualization.
        var link = svg.append("g")
            .style("stroke", "#aaa")
            .selectAll("line")
            .data(graph.links)
            .enter().append("path").attr("class", function (d) {
                if (d.direction) {
                    return "graph-edge"
                } else {
                    return "graph-edge-reverse"
                }
            });

        // Draw the type of relationship next to the links.
        var type = svg.append("g")
            .attr("class", "types")
            .selectAll("text")
            .data(graph.links)
            .enter().append("text")
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .style('font-family', '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif')
            .style('font-size', '10px')
            .style('fill', 'grey')
            .text(function (d) {
                return d.type
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        // Draw the nodes with the colors we've generated.
        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)

            .enter().append("circle")
            .on("click", handePopUp)
            .attr("r", function (d) {
                return d.radius
            })
            .style("fill", function (d) {
                return colors[graph.nodeLabels.indexOf(d.labels[d.labels.length - 1]) % colors.length]
            })
            .style("stroke", function (d) {
                return d.stroke
            })
            .style("stroke-width", "1px")
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));

        // Draw the label on top of the nodes. Depending on what property we've selected to drawn.
        let propertiesSelected = this.props.propertiesSelected;
        var label = svg.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(graph.nodes)
            .enter().append("text")
            .on("click", handePopUp)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .style('font-family', '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif')
            .style('font-size', '10px')
            .text(function (d) {
                if (propertiesSelected.length === 0) {
                    return (d.properties.name) ? (d.properties.name) : "(" + d.labels + ")";
                }
                let indexOfPropertyToShow = graph.nodeLabels.indexOf(d.labels[d.labels.length - 1]);
                let propertyNameToShow = propertiesSelected[indexOfPropertyToShow];
                let propertyValue = d.properties[propertyNameToShow];
                return (propertyValue) ? propertyValue : "(" + d.labels + ")";
            })

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        function ticked() {
            // Each tick of the simulation, recompute the link positions.
            link.attr("d", function (d) {
                let orientation = (d.source.id > d.target.id);

                let x1 = (orientation) ? d.target.x : d.source.x,
                    y1 = (orientation) ? d.target.y : d.source.y,
                    x2 = (orientation) ? d.source.x : d.target.x,
                    y2 = (orientation) ? d.source.y : d.target.y,
                    dx = x2 - x1,
                    dy = y2 - y1,

                    sweep = (d.count >= d.totalCount * 0.5 ? 1 : 0),  //orientation
                    sideCount = (sweep === 1) ? d.count - ((d.totalCount - 1) / 2) : d.count,
                    relativeCount = sideCount / ((d.totalCount - 1) / 2),
                    drx = Math.sqrt(dx * dx + dy * dy) * (0.5 + relativeCount * relativeCount),
                    dry = Math.sqrt(dx * dx + dy * dy) * (0.5 + relativeCount * relativeCount),
                    xRotation = 45, // degrees
                    largeArc = 0 // 1 or 0

                if (d.count === 0) {
                    drx = 0
                    dry = 0
                }
                // Self edge.
                if (x1 === x2 && y1 === y2) {

                    // Fiddle with this angle to get loop oriented.
                    xRotation = -45;

                    // Needs to be 1.
                    largeArc = 1;

                    // Change sweep to change orientation of loop.
                    sweep = 1;

                    // Make drx and dry different to get an ellipse
                    // instead of a circle.
                    let count = (d.totalCount === 1) ? 1 : d.count + (d.totalCount + 1) % 2;
                    if (count <= 3) {
                        drx = 30 + count * -5;
                        dry = 30 + count * -5;
                    } else {
                        drx = 10 + count * 5;
                        dry = 10 + count * 5;
                    }


                    // For whatever reason the arc collapses to a point if the beginning
                    // and ending points of the arc are the same, so kludge it.
                    x2 = x2 + 1;
                    y2 = y2 + 1;
                    y1 = y1 - 25;
                    x2 = x2 + 25;
                    return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x2 + "," + y2 + "m -25 5";
                }
                return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x2 + "," + y2;
            });


            // update node positions
            node.attr("cx", function (d) {
                return d.x = Math.max(d.radius - width * 15, Math.min(width + width * 15 - d.radius, d.x));
            })
                .attr("cy", function (d) {
                    return d.y = Math.max(d.radius - height * 15, Math.min(height + height * 15 - d.radius, d.y));
                });

            // update label positions
            label
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                }).selectAll('tspan')


                .attr("x", function (d) {
                    return d.x
                })


            /** Update relationship type text positions.
             *  TODO: The math here is not very sound, especially for multiple relationships between nodes.
             */
            type
                .attr("x", function (d) {
                    // If the type is a self loop, then...
                    if (d.source.x == d.target.x && d.source.y == d.target.y) {
                        return d.source.x + 5
                    }
                    return (d.source.x + d.target.x) * 0.5;
                })
                .attr("y", function (d) {
                    // If the type is a self loop, then...
                    if (d.source.x == d.target.x && d.source.y == d.target.y) {
                        let count = (d.totalCount) === 1 ? 0 : d.count - 1;

                        return (count < 3) ? d.source.y - 60 + 15 * count : d.source.y - 37 - 11 * count;
                    }
                    return (d.source.y + d.target.y) * 0.5;
                })
                .attr("transform-origin", function (d) {
                    return "" + (d.source.x + d.target.x) * 0.5 + " " + (d.source.y + d.target.y) * 0.5;
                })
                .attr("transform", function (d) {
                    let distance = Math.sqrt((d.source.x - d.target.x) * (d.source.x - d.target.x) + (d.source.y - d.target.y) * (d.source.y - d.target.y))
                    let axis = isRotatedAngle(d.source, d.target)
                    let orientation = d.source.id > d.target.id;
                    let x1 = (orientation) ? d.target.x : d.source.x,
                        y1 = (orientation) ? d.target.y : d.source.y,
                        x2 = (orientation) ? d.source.x : d.target.x,
                        y2 = (orientation) ? d.source.y : d.target.y,
                        dx = x2 - x1,
                        dy = y2 - y1,

                        sweep = (d.count >= d.totalCount * 0.5 ? 1 : 0),  //orientation
                        sideCount = (sweep === 1) ? d.count - ((d.totalCount - 1) / 2) : d.count,
                        relativeCount = 1.0 - sideCount / ((d.totalCount + 1) / 2)

                    if (sideCount == 0) {
                        return "rotate(" + relationshipTextAngle(d.source, d.target) + ",0,0)translate(0,-5)";
                    } else {
                        let side = ((sweep === 1) ? 1  : -1) * isRotatedAngle( {x: x2, y: y2}, {x: x1, y: y1});
                        let drx = Math.sqrt(dx * dx + dy * dy + relativeCount * relativeCount) * relativeCount,
                            dry = Math.sqrt(dx * dx + dy * dy + relativeCount * relativeCount) * relativeCount * side,
                            textYshift = (side === 1) ? -8 : 0;
                        return "rotate(" + relationshipTextAngle(d.source, d.target) + ",0,0)" +
                            "translate(0," + dry * 0.08 * Math.round(d.totalCount / 2 + 1) + ")translate(0, " + textYshift + ")";
                    }
                });
        }

        /**
         * Determine the angle of a relationship type to draw in the visualization.
         */
        function relationshipTextAngle(source, target) {
            if (source.x == target.x && source.y == target.y) {
                return 45;
            }
            let deltaY = target.y - source.y
            let deltaX = target.x - source.x
            let angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
            return (angle > -90 && angle < 90) ? angle : angle - 180;
        }

        /**
         *  Returns -1 if the angle is negative, 1 if the angle is positive.
         */
        function isRotatedAngle(source, target) {
            if (source.x == target.x && source.y == target.y) {
                return 45;
            }
            let deltaY = target.y - source.y
            let deltaX = target.x - source.x
            let angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
            return (angle > -90 && angle < 90) ? 1 : -1;
        }

        /**
         * When a user starts dragging a node, update positions and restart the simulation.
         */
        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x;
            d.fy = d.y;
        }
        /**
         * Handles dragging of the visualization' nodes by the user.
         */
        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }
        /**
         * When a user stops dragging a node, disable the drag action.
         */
        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

    }




    /**
     * After the component updates, remount and reset the visualization with the newly retrieved data.
     */
    componentDidUpdate(prevProps) {
        super.componentDidUpdate(prevProps);
        d3.select('.chart' + this.props.id).select('g').remove();
        this.componentDidMount();
    }

    /**
     * Render the visualization SVG.
     */
    render() {
        let rendered = super.render();
        if (rendered) {
            return rendered;
        }
        return (
            <svg
                className={'chart chart' + this.props.id + ' iteration' + this.props.page + " isRunning" + this.state.running}
                style={{backgroundColor: '#f9f9f9'}}>

                <defs>
                    <filter x="0" y="0" width="1" height="1" id="solid">
                        <feFlood floodColor="rgba(255,255,255,0.85)"/>
                        <feComposite in="SourceGraphic"/>

                    </filter>
                    <marker id="arrowhead" markerWidth="5" markerHeight="3"
                            refX="16" refY="1.5" orient="auto" fill="rgb(170, 170, 170)">
                        <polygon points="0 0, 5 1.5, 0 3"/>
                    </marker>
                    <marker id="arrowhead-reverse" markerWidth="5" markerHeight="3"

                            refX="-11" refY="1.5" orient="auto" fill="rgb(170, 170, 170)">
                        <polygon points="5 0, 0 1.5, 5 3"/>
                    </marker>
                </defs>
            </svg>

        );
    }
}

export default (NeoGraphVisReport);

