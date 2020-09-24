import * as d3 from "d3";
import React from "react";
import axios from 'axios';


class Graph extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const url = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';

        axios.get(url).then(res => {
            const data = res.data;

            const width = 640,
                height = 280;

            //Initializing chart
            const chart = d3.select('.chart')
                .attr('width', width)
                .attr('height', height);

            //Creating tooltip
            const tooltip = d3.select('.container')
                .append('div')
                .attr('class', 'tooltip')
                .html('Tooltip');

            //Initializing force simulation
            const simulation = d3.forceSimulation()
                .force('link', d3.forceLink())
                .force('charge', d3.forceManyBody())
                .force('collide', d3.forceCollide())
                .force('center', d3.forceCenter(width / 2, height / 2))
                .force("y", d3.forceY(0))
                .force("x", d3.forceX(0));


            //Drag functions
            const dragStart = d => {
                if (!d3.event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            };

            const drag = d => {
                d.fx = d3.event.x;
                d.fy = d3.event.y;
            };

            const dragEnd = d => {
                if (!d3.event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

            //Creating links
            const link = chart.append('g')
                .attr('class', 'links')
                .selectAll('line')
                .data(data.links).enter()
                .append('line');

            //Creating nodes
            const node = chart.append('g')
                .selectAll('circle')
                .data(data.nodes).enter()
                .append('circle')
                .attr("height", 50)
                .attr("width", 50)
                .attr("background", 'blue')

        .call(d3.drag()
                    .on('start', dragStart)
                    .on('drag', drag)
                    .on('end', dragEnd)
                );

            //Setting location when ticked
            const ticked = () => {
                link
                    .attr("color", "black")
                    .attr("width", "5px")
                    .attr("stroke", "#eee")
                    .attr("x1", d => { return d.source.x; })
                    .attr("y1", d => { return d.source.y; })
                    .attr("x2", d => { return d.target.x; })
                    .attr("y2", d => { return d.target.y; })
                    .attr("style", d => {
                        return 'stroke: black; position: absolute;';
                    });

                node
                    .attr("cy", d => { return d.y; })
                    .attr("cx", d => { return d.x; })
                    .attr("r", d => { return 10; })
                    .attr("fill", d => { return "black"; })
                    .attr("stroke", d => { return "red"; })
                    .attr("style", d => {
                        return 'background: black; position: absolute;';
                    });
            };

            //Starting simulation
            simulation.nodes(data.nodes)
                .on('tick', ticked);

            simulation.force('link')
                .links(data.links);

        });
    }

    render() {
        return (
            <div className='container'>
                <div className='chartContainer'>
                    <svg className='chart'>
                    </svg>
                </div>
            </div>
        );
    }
}
export default (Graph);

