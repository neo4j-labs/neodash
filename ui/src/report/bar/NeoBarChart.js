import Table from "react-materialize/lib/Table";
import React from "react";
import NeoReport from "../NeoReport";
import NeoGraphChip from "../../component/NeoGraphChip";
import * as d3 from "d3";

class NeoBarChart extends NeoReport {
    constructor(props) {
        super(props);

    }

    componentDidUpdate(prevProps) {
        super.componentDidUpdate(prevProps);
        d3.select('.new').select('g').remove();
        this.componentDidMount();
    }

    componentDidMount() {
        let data = this.state.data;
        let parsedParameters = this.props.params;


        if (!data) {
            return
        }
        data = data.map((row, index) => {
            return [this.parseChartValue(Object.values(row)[0]), this.parseChartValue(Object.values(row)[1])]
        })
        if (data.length > 0) {
            let labels = {}
            Object.keys(this.state.data[0]).forEach(
                i => labels[i] = i
            )
            this.props.onNodeLabelUpdate(labels);
        }

        let yValues = data.map(row => row[1]);
        let xValues = data.map(row => row[0].toString().length);
        let maxY = Math.max.apply(Math, yValues);
        let minY = Math.min.apply(Math, yValues);
        let maxX = Math.max.apply(Math, xValues);

        if (minY === maxY){
            minY = minY - 1;
            maxY = maxY + 1;
        }
        let digits = Math.log10(Math.abs(maxY));
        var xShift = ((digits > 1) ? digits * 7 + 18 : Math.abs(digits) * 7 + 32);
        xShift += (maxY < 0 || minY < 0) ? 10 : 0;
        var yShift = 20 + maxX * 4;
        var width = -90 + this.props.width * 105 - xShift * 0.5, height = -140 + this.props.height * 100 - yShift;
        var margin = {top: 0, right: 0, bottom: yShift, left: xShift};

        var svg = d3.select(".new")
            .attr("class", "chart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        var x = d3.scaleBand()
            .range([0, width])
            .domain(data.map(function (d) {
                return d[0];
            }))
            .padding(0.2);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");

        var y = d3.scaleLinear()
            .domain([minY - (maxY - minY) * 0.1, maxY + (maxY - minY) * 0.1])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));


        svg.selectAll("mybar")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function (d) {
                return x(d[0]);
            })
            .attr("y", function (d) {
                return y(d[1]);
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(d[1]);
            })
            .attr("fill", function (d) {

                let color = (parsedParameters && parsedParameters.color) ? (parsedParameters.color) : "#69b3a2";
                return (d[1]) ? color : "transparent";
            })
    }

    parseChartValue(value) {

        if (typeof (value) === "object"  && value !== null && value.low !== null){
            return value.low;
        }else{
            return value
        }
    }

    render() {
        let rendered = super.render();
        if (rendered) {
            return rendered;
        }
        return (
            <svg className={'chart new iteration' + this.props.page + " isRunning" + this.state.running}>
            </svg>
        );
    }

}

export default (NeoBarChart);
