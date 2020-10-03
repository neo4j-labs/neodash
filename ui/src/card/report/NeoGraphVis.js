import * as d3 from "d3";
import React from "react";
import NeoReport from "./NeoReport";


class NeoGraphViz extends NeoReport {
    constructor(props) {
        super(props);
        this.runQuery();
    }

    convertDataToGraph() {
        let graph = {nodes: [], links: [], nodeLabelsMap: {}}

        if (this.state.data == null) {
            return graph;
        }
        // unique nodes
        let nodesMap = {}
        let nodeLabelsMap = {}
        let linksMap = {}

        // unique relationships
        this.state.data.forEach(row => {
            Object.values(row).forEach(value => {
                // single nodes
                if (value["labels"] && value["identity"] && value["properties"]) {
                    this.extractNodeInfo(value, nodeLabelsMap, nodesMap);
                }
                // arrays of nodes
                if (Array.isArray(value)) {
                    value.forEach(item => {
                        if (item["labels"] && item["identity"] && item["properties"]) {
                            this.extractNodeInfo(item, nodeLabelsMap, nodesMap);
                        }
                    })
                }
                // paths
                if (value["start"] && value["end"] && value["segments"] && value["length"]) {
                    this.extractNodeInfo(value.start, nodeLabelsMap, nodesMap);
                    value.segments.forEach(segment => {
                        this.extractNodeInfo(segment.end, nodeLabelsMap, nodesMap);
                    });
                }
            })
        });

        this.state.data.forEach(row => {
            Object.values(row).forEach(value => {
                // single rel
                if (value["type"] && value["start"] && value["end"] && value["identity"] && value["properties"]) {
                    this.extractRelInfo(value, nodesMap, linksMap);
                }
                // arrays of rel
                if (Array.isArray(value)) {
                    value.forEach(item => {
                        if (item["type"] && item["start"] && item["end"] && item["identity"] && item["properties"]) {
                            this.extractRelInfo(item, nodesMap, linksMap);
                        }
                    })
                }
                // paths
                if (value["start"] && value["end"] && value["segments"] && value["length"]) {
                    this.extractNodeInfo(value.start, nodeLabelsMap, nodesMap);
                    value.segments.forEach(segment => {
                        this.extractRelInfo(segment.relationship, nodesMap, linksMap);
                    });
                }
            });
        });
        graph.nodes = Object.values(nodesMap)
        graph.links = Object.values(linksMap)
        graph.nodeLabels = Object.keys(nodeLabelsMap)
        this.props.onNodeLabelUpdate(nodeLabelsMap)
        return graph
    }

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
            stroke: "#969696",
            radius: 25,
            properties: value['properties'],
            labels: value['labels']
        }
    }

    extractRelInfo(value, nodesMap, linksMap) {
        linksMap["" + value['identity']['low']] = {
            source: value["start"]["low"],
            target: value["end"]["low"],
            type: value["type"]
            // avgRadius: (nodesMap[value["start"]["low"]].radius + nodesMap[value["end"]["low"]].radius) * 0.5
        }
        if (!nodesMap["" + value['start']['low']]) {
            nodesMap["" + value['start']['low']] = {
                id: value['start']['low'],
                fill: 'seagreen',
                stroke: "#969696",
                radius: 25,
                properties: [],
                labels: []
            }
        }
        if (!nodesMap["" + value['end']['low']]) {
            nodesMap["" + value['end']['low']] = {
                id: value['end']['low'],
                fill: 'seagreen',
                stroke: "#969696",
                radius: 25,
                properties: [],
                labels: []
            }
        }
    }

    componentDidMount() {

        let colors = ["#588c7e", "#f2e394", "#f2ae72", "#d96459", "#5b9aa0", "#d6d4e0", "#b8a9c9", "#622569", "#ddd5af", "#d9ad7c", "#a2836e", "#674d3c", "grey"]

        let graph = this.convertDataToGraph();
        this.state.nodeLabels = graph.nodeLabels

        // chart dimensions
        var width = -60 + this.props.width * 105, height = -145 + this.props.height * 100;

        // set up svg
        svg = d3.select('.new').attr("transform", null);
        let zoom = d3.zoom();
        zoom.transform(svg, d3.zoomIdentity);
        var svg = d3.select('.new')
            .attr("width", width)
            .attr("height", height)
            .attr("class", "chart")
            .call(zoom.on("zoom", function () {
                svg.attr("transform", d3.event.transform)
            }))
            .append("g");

        var simulation = d3.forceSimulation()
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("link", d3.forceLink().strength(function (d) {
                return 0.1;
            }).id(function (d) {
                return d.id;
            }))

            .force("charge", d3.forceManyBody().strength(-50))
            .force("collide", d3.forceCollide().strength(1).radius(function (d) {
                return d.radius * 1.2
            }))
            .force("collide", d3.forceCollide().strength(0.1).radius(function (d) {
                return d.radius * 2.3
            }))

        ;


        var link = svg.append("g")
            .style("stroke", "#aaa")
            .selectAll("line")
            .data(graph.links)
            .enter().append("path").attr("class", "graph-edge");

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

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
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
        var label = svg.append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(graph.nodes)
            .enter().append("text")
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .style('font-family', '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif')
            .style('font-size', '10px')
            .text(function (d) {
                return d.properties.name
            })

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        function ticked() {
            link.attr("d", function (d) {
                let x1 = d.source.x,
                    y1 = d.source.y,
                    x2 = d.target.x,
                    y2 = d.target.y,
                    dx = x2 - x1,
                    dy = y2 - y1,

                    // Defaults for normal edge.
                    drx = 0,
                    dry = 0,
                    xRotation = 0, // degrees
                    largeArc = 0, // 1 or 0
                    sweep = 1; // 1 or 0

                // Self edge.
                if (x1 === x2 && y1 === y2) {

                    // Fiddle with this angle to get loop oriented.
                    xRotation = -45;

                    // Needs to be 1.
                    largeArc = 1;

                    // Change sweep to change orientation of loop.
                    //sweep = 0;

                    // Make drx and dry different to get an ellipse
                    // instead of a circle.
                    drx = 25;
                    dry = 25;

                    // For whatever reason the arc collapses to a point if the beginning
                    // and ending points of the arc are the same, so kludge it.
                    x2 = x2 + 1;
                    y2 = y2 + 1;
                    y1 = y1 -25;
                    x2 = x2 +25;
                    return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x2 + "," + y2 + "m -25 5";
                }
                return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x2 + "," + y2;
            });



            // update node positions
            // note in this example we bound the positions
            node.attr("cx", function (d) {
                return d.x = Math.max(d.radius - width * 5, Math.min(width + width * 5 - d.radius, d.x));
            })
                .attr("cy", function (d) {
                    return d.y = Math.max(d.radius - height * 5, Math.min(height + height * 5 - d.radius, d.y));
                });

            // update label positions
            label
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return d.y;
                })
            // update type positions
            type
                .attr("x", function (d) {
                    if (d.source.x == d.target.x && d.source.y == d.target.y){
                        return d.source.x +5;
                    }
                    return (d.source.x + d.target.x) * 0.5;
                })
                .attr("y", function (d) {
                    if (d.source.x == d.target.x && d.source.y == d.target.y){
                        return d.source.y - 60;
                    }
                    return (d.source.y + d.target.y) * 0.5;
                })
                .attr("transform-origin", function (d) {
                    return "" + (d.source.x + d.target.x) * 0.5 + " " + (d.source.y + d.target.y) * 0.5;
                })
                .attr("transform", function (d) {
                    return "rotate(" + angle(d.source, d.target) + ",0,0)translate(0,-5)";
                })
        }

        function angle(source, target) {
            if (source.x == target.x && source.y == target.y){
                return 45;
            }
            let deltaY = target.y - source.y
            let deltaX = target.x - source.x
            let angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
            return (angle > -90 && angle < 90) ? angle : angle - 180;
        }

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart()
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

    }

    componentDidUpdate() {
        d3.select('.new').select('g').remove();
        this.componentDidMount();
    }

    render() {
        let rendered = super.render();
        if (rendered) {
            return rendered;
        }
        return (
            <svg className={'chart new iteration' + this.props.page + " isRunning" + this.state.running}
                 style={{backgroundColor: '#f9f9f9'}}>

                <defs>
                    <marker id="arrowhead" markerWidth="5" markerHeight="3.5"
                            refX="16" refY="1.75" orient="auto" fill="rgb(170, 170, 170)">
                        <polygon points="0 0, 5 1.75, 0 3"/>
                    </marker>

                </defs>
            </svg>

        );
    }
}

export default (NeoGraphViz);

