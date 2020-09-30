import * as d3 from "d3";
import React from "react";
import axios from 'axios';


class NeoGraphViz extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {

// chart dimensions
            var width = -60 + this.props.width * 105, height = -145 + this.props.height * 100, radius = 50;

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
        var forceLink = d3.forceLink().id(function (d) {
            return d.id;
        });

        var simulation = d3.forceSimulation()
            .force("link", d3.forceLink().id(function (d) {
                return d.id;
            }))
            .force("charge", d3.forceManyBody().strength(-400))
            .force("center", d3.forceCenter(width / 2, height / 2));

        d3.json("data.json", function (error, graph) {

            var link = svg.append("g")
                .style("stroke", "#aaa")
                .selectAll("line")
                .data(graph.links)
                .enter().append("line");

            var node = svg.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(graph.nodes)
                .enter().append("circle")
                .attr("r", function (d) {
                    return +d.radius
                })
                .style("fill", function (d) {
                    return d.fill
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
                    return "i'm a node"
                })
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

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
                    return d.x = Math.max(radius, Math.min(width - radius, d.x));
                })
                    .attr("cy", function (d) {
                        return d.y = Math.max(radius, Math.min(height - radius, d.y));
                    });

                // update label positions
                label
                    .attr("x", function (d) {
                        return d.x;
                    })
                    .attr("y", function (d) {
                        return d.y;
                    })

            }


            // // when the input range changes update the circle
            // d3.select("#id1").on("input", function() {
            //     var value = +this.value;
            //     d3.select("#id2").html(value);
            // });

        });


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
            <svg className={'chart new iteration' + this.props.page} style={{backgroundColor: '#f9f9f9'}}>
            </svg>

        );
    }
}

export default (NeoGraphViz);

