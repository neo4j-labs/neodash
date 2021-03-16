import React from "react";
import NeoReport from "./NeoReport";
import * as d3 from "d3";

/**
 * A line chart report draws the resulting data from Neo4j as a line chart.
 * The x-axis and the y-axis can be selected from the returned field names.
 */
class NeoLineChartReport extends NeoReport {
    /**
     * On initialization, generate the visualization with d3.
     * The drawn axes are generated from the selected properties.
     * The size and style of the visualization is set based on the provided properties.
     */
    componentDidMount() {
        let data = this.state.data;
        let page = this.state.page;
        let props = this.props;
        let id = props.id;
        let parsedParameters = props.params;

        d3.select(".chart" + id).select('g').remove()
        if (!data || data.length === 0) {
            return
        }
        let prop1 = props.propertiesSelected[0];
        let prop2 = props.propertiesSelected[1];
        let index1 = prop1 ? Object.keys(data[0]).indexOf(prop1) : 0;
        let index2 = prop2 ? Object.keys(data[0]).indexOf(prop2) : 1;


        data = data.map((row, i) => {
            return [this.parseChartValue(Object.values(row)[index1], 0, i),
                this.parseChartValue(Object.values(row)[index2], 1, i)]
        })


        let labels = {}
        if (data.length > 0) {
            Object.keys(this.state.data[0]).forEach(
                i => labels[i] = i
            )
            props.onNodeLabelUpdate(labels);
        }

        data = data.filter(entry => entry[0] !== null && !isNaN(entry[0]) && entry[1] !== null && !isNaN(entry[1]))

        // Set size
        let {maxY, minY, maxX, minX} = this.getDataLimits(data);
        var xShift = 40;
        var yShift = 30;

        var width = props.clientWidth - 100; //-90 + props.width * 105 - xShift * 0.5;
        var height = -140 + props.height * 100 - yShift;
        var margin = {top: 0, right: 0, bottom: yShift, left: xShift};


        var svg = d3.select(".chart" + id)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Add X axis --> it is a date format
        var x = d3.scaleLinear()
            .domain([minX - (maxX - minX) * 0.02, maxX + (maxX - minX) * 0.04])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([minY - (maxY - minY) * 0.1, maxY + (maxY - minY) * 0.1])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add the line
        let line = d3.line()
            .x(function (d) {
                return x(d[0])
            })
            .y(function (d) {
                return y(d[1])
            });


        if (parsedParameters && parsedParameters.curve === true) {
            line.curve(d3.curveMonotoneX)
        } else if (parsedParameters && parsedParameters.curveLoop === true) {
            line.curve(d3.curveCardinalClosed)
        }

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", function (d) {
                return (parsedParameters && parsedParameters.color) ? (parsedParameters.color) : "steelblue";
            })
            .attr("stroke-width", function (d) {
                return (parsedParameters && parsedParameters.width) ? (parsedParameters.width) : 1.5;
            })

            .attr("d", line)

        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle") // Uses the enter().append() method
            .attr("class", "dot") // Assign a class for styling
            .attr("cx", function (d) {
                return x(d[0])
            })
            .attr("cy", function (d) {
                return y(d[1])
            })
            .attr("fill", function (d) {
                return (parsedParameters && parsedParameters.color) ? (parsedParameters.color) : "steelblue";
            })

            .attr("r", function (d) {
                return (parsedParameters && parsedParameters.radius) ? (parsedParameters.radius) : 3;
            })
            .on("mousemove", function (d) {
                let prop1 = (props.propertiesSelected[0]) ? props.propertiesSelected[0] : Object.keys(labels)[0];
                let prop2 = (props.propertiesSelected[1]) ? props.propertiesSelected[1] : Object.keys(labels)[1];
                d3.select(".chart-tooltip")
                    .style("left", d3.event.pageX - 50 + "px")
                    .style("top", d3.event.pageY - 80 + "px")
                    .style("display", "inline-block")
                    .html(prop1 + ": " + d[0] + "<br>" + prop2 + ": " + d[1]);
            })
            .on("mouseout", function (d) {
                d3.select(".chart-tooltip").style("display", "none")
            });

    }

    /**
     * Handle updates to the component. Perform a remount on each update.
     */
    componentDidUpdate(prevProps) {
        super.componentDidUpdate(prevProps);
        this.componentDidMount();
    }

    /**
     * Helper function to get the max/min values from the values selected for the plot's axes.
     */
    getDataLimits(data) {
        let xValues = data.map(row => row[0]);
        let yValues = data.map(row => row[1]);
        let maxY = Math.max.apply(Math, yValues.filter(y => y !== null && !isNaN(y)));
        let minY = Math.min.apply(Math, yValues.filter(y => y !== null && !isNaN(y)));
        let maxX = Math.max.apply(Math, xValues.filter(x => x !== null && !isNaN(x)));
        let minX = Math.min.apply(Math, xValues.filter(x => x !== null && !isNaN(x)));
        if (minY === maxY) {
            minY = minY - 1;
            maxY = maxY + 1;
        }
        if (minX === maxX) {
            minX = minX - 1;
            maxX = maxX + 1;
        }
        if (!isFinite(maxY) || !isFinite((minY))) {
            maxY = 1;
            minY = 0;
        }
        if (!isFinite(maxX) || !isFinite((minX))) {
            maxX = 1;
            minX = 0;
        }
        // to prevent -infinity for maxY = 0
        if (maxY === 0) {
            maxY = 0.1;
        }
        if (maxX === 0) {
            maxX = 0.1;
        }
        return {maxY, minY, maxX, minX};
    }

    /**
     * Attempt to parse a 'drawable' value from what was returned by Neo4j.
     * For line charts, we only consider numeric values.
     */
    parseChartValue(value, index, i) {
        // If there's no data, fill it with some blanks.
        if (value === null) {
            return NaN
        }

        // if it's a number, just return it.
        if (!isNaN(value)) {
            return value
        }
        if (typeof (value) === "object" && !isNaN(value["low"])) {
            return value.low
        }

        // Nothing numeric? just return NaN.
        return NaN
    }

    /**
     * Draw the report based on the generated visualization.
     */
    render() {
        let rendered = super.render();
        if (rendered) {
            return rendered;
        }
        return <svg
            className={'chart chart' + this.props.id + ' iteration' + this.props.page + " isRunning" + this.state.running}>
        </svg>
    }

}

export default (NeoLineChartReport);
