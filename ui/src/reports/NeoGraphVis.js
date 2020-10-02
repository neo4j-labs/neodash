import * as d3 from "d3";
import React from "react";
import axios from 'axios';
import NeoReport from "./NeoReport";
import NeoGraphChip from "../NeoGraphChip";


class NeoGraphViz extends NeoReport {
    constructor(props) {
        super(props);
        this.state = {
            'running': true,
            'query': 'Match (n:Artist) WITH n LIMIT 50 MATCH (n)-[e]-(m) RETURN id(n), n,e,m LIMIT 50',
            'params': {},
            'data': []
        };
        this.runQuery();
    }

    convertDataToGraph() {
        let graph = {nodes: [], links: []}

        // unique nodes
        let nodesMap = {}
        let nodeLabelsMap = {}
        this.state.data.forEach(row => {
            Object.values(row).forEach(value => {
                if (value["labels"] && value["identity"] && value["properties"]) {
                    value["labels"].forEach(l => nodeLabelsMap[l] = true)
                    nodesMap["" + value['identity']['low']] = {
                        id: value['identity']['low'],
                        fill: 'seagreen',
                        stroke: "#969696",
                        radius: 25,
                        properties: value['properties'],
                        labels: value['labels']
                    }
                }
            })
        });
        graph.nodes = Object.values(nodesMap)

        // unique relationships
        let linksMap = {}
        this.state.data.forEach(row => {
            Object.values(row).forEach(value => {
                if (value["type"] && value["start"] && value["end"] && value["identity"] && value["properties"]) {
                    linksMap["" + value['identity']['low']] = {
                        source: value["start"]["low"],
                        target: value["end"]["low"],
                        type: value["type"]
                        // avgRadius: (nodesMap[value["start"]["low"]].radius + nodesMap[value["end"]["low"]].radius) * 0.5
                    }
                }
            });
        });
        graph.links = Object.values(linksMap)
        graph.nodeLabels = Object.keys(nodeLabelsMap)
        this.props.onNodeLabelUpdate(graph.nodeLabels)
        return graph
    }

    componentDidMount() {
        let colors = ["#588c7e","#f2e394","#f2ae72","#d96459","#5b9aa0","#d6d4e0","#b8a9c9","#622569", "#ddd5af","#d9ad7c","#a2836e","#674d3c","grey"]

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
            .enter().append("line").attr("class", "graph-edge");

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
                return colors[graph.nodeLabels.indexOf(d.labels[d.labels.length-1]) % colors.length]
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

            //update link positions
            link
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
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
                    return (d.source.x + d.target.x)*0.5;
                })
                .attr("y", function (d) {
                    return (d.source.y+ d.target.y)*0.5;
                })
                .attr("transform-origin",function(d){
                    return ""+(d.source.x + d.target.x)*0.5 + " " +(d.source.y+ d.target.y)*0.5;
                })
                .attr("transform", function(d){
                    return "rotate("+angle(d.source, d.target)+",0,0)translate(0,-5)";
                })
        }

        function angle(source, target){
            //find vector components
            let deltaY = target.y - source.y
            let deltaX = target.x - source.x
            let angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
            return (angle > -90 && angle < 90) ? angle : angle -180;
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
        return (
            <svg className={'chart new iteration' + this.props.page + this.state.running}
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

