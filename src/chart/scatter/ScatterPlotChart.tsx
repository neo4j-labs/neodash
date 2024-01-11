import React, { useEffect } from 'react';
import { NoDrawableDataErrorMessage } from '../../component/editor/CodeViewerComponent';
import { ChartProps } from '../Chart';
import { recordToNative } from '../ChartUtils';
import { ResponsiveScatterPlot, ResponsiveScatterPlotCanvas } from '@nivo/scatterplot';
import { animated } from '@react-spring/web';
import chroma from 'chroma-js';
import { themeNivo } from '../Utils';

/**
 * Embeds a Nivo ResponsiveScatterPlot and a ResponsiveScatterPlotCanvas into NeoDash.
 */
const NeoScatterPlot = (props: ChartProps) => {
  const POSSIBLE_TIME_FORMATS = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'];

  if (props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <>No data, re-run the report.</>;
  }

  const { records, selection } = props;

  if (!selection || !selection.value || selection.value.length == 0) {
    return <div style={{ margin: '15px' }}>No y-axis selected. To view the report, select a value below. </div>;
  }

  if (!selection.value.length) {
    return <p></p>;
  }

  const [keepLegend, setKeepLegend] = React.useState(false);
  const [isTimeChart, setIsTimeChart] = React.useState(false);
  const [parseFormat, setParseFormat] = React.useState('%Y-%m-%dT%H:%M:%SZ');
  const [validSelection, setValidSelection] = React.useState(true);
  const [data, setData] = React.useState({
    id: selection.value as string,
    data: [] as any[],
  });

  const [intensities, setIntensities] = React.useState<number[]>([]);
  const [legendRange, setLegendRange] = React.useState({ min: 1, max: 2 });

  const settings = props.settings ? props.settings : {};

  const colorIntensityProp = settings.colorIntensityProp != undefined ? settings.colorIntensityProp : 'intensity';
  const labelProp = settings.labelProp != undefined ? settings.labelProp : 'label';
  const colorScale = chroma.scale('Spectral');

  const pointSize = settings.pointSize ? settings.pointSize : 10;
  const showGrid = settings.showGrid != undefined ? settings.showGrid : true;
  const showLegend = settings.legend !== undefined ? settings.legend : false;
  const legendWidth = settings.legendWidth !== undefined ? settings.legendWidth : 20;
  const xScale = settings.xScale ? settings.xScale : 'linear';
  const yScale = settings.yScale ? settings.yScale : 'linear';

  const xScaleLogBase = settings.xScaleLogBase ? settings.xScaleLogBase : 10;
  const yScaleLogBase = settings.yScaleLogBase ? settings.yScaleLogBase : 10;

  const minXValue = settings.minXValue ? settings.minXValue : 'auto';
  const maxXValue = settings.maxXValue ? settings.maxXValue : 'auto';
  const minYValue = settings.minYValue ? settings.minYValue : 'auto';
  const maxYValue = settings.maxYValue ? settings.maxYValue : 'auto';

  const marginRight = settings.marginRight ? settings.marginRight : 24;
  const marginLeft = settings.marginLeft ? settings.marginLeft : 36;
  const marginTop = settings.marginTop ? settings.marginTop : 24;
  const marginBottom = settings.marginBottom ? settings.marginBottom : 40;

  const xTickValues = settings.xTickValues != undefined ? settings.xTickValues : undefined;
  const xTickTimeValues = settings.xTickTimeValues != undefined ? settings.xTickTimeValues : 'every 1 years';
  const xAxisTimeFormat = settings.xAxisTimeFormat != undefined ? settings.xAxisTimeFormat : '%Y-%m-%dT%H:%M:%SZ';
  const xAxisFormat = settings.xAxisFormat != undefined ? settings.xAxisFormat : undefined;
  const xTickRotationAngle = settings.xTickRotationAngle != undefined ? settings.xTickRotationAngle : 0;
  const yTickRotationAngle = settings.yTickRotationAngle != undefined ? settings.yTickRotationAngle : 0;

  const isDate = (x) => {
    return x.__isDate__;
  };

  const isDateTime = (x) => {
    return x.__isDateTime__;
  };

  const isDateTimeOrDate = (x) => {
    return isDate(x) || isDateTime(x) || x instanceof Date;
  };

  // Effect used to recalculate the values at each selection change.
  // This prevents the app doing computations on each re-render.
  useEffect(() => {
    let key = selection.value as string;
    let processed = {
      id: key,
      data: [] as any[],
    };

    let newIntensities: any[] = [];

    records.forEach((row) => {
      const intensity: any = row.keys.includes(colorIntensityProp)
        ? recordToNative(row.get(colorIntensityProp))
        : undefined;

      const label: any = row.keys.includes(labelProp) ? recordToNative(row.get(labelProp)) : undefined;

      if (intensity) {
        newIntensities.push(intensity);
        if (!keepLegend) {
          setKeepLegend(true);
        }
      }

      let x: number | Date = row.get(selection.x) || 0;
      let y: any = recordToNative(row.get(key)) || 0;
      if (!isNaN(y)) {
        if (isDateTime(x)) {
          x = new Date(x.toString());
        }
        processed.data.push({ x, y, intensity, label });
      }
    });

    setData(processed);
    setValidSelection(processed.data.length > 0);
    setIntensities(newIntensities);
  }, [records, selection]);

  // Resetting the legend range
  useEffect(() => {
    let sortedIntensities = [...intensities].sort((a, b) => {
      return a - b;
    });

    setLegendRange({ min: sortedIntensities[0], max: sortedIntensities.slice(-1)[0] });
  }, [intensities]);

  // Post-processing validation on the data --> confirm only numeric data was selected by the user.
  if (!validSelection) {
    return <NoDrawableDataErrorMessage />;
  }

  // TODO - Nivo has a bug that, when we switch from a time-axis to a number axis, the visualization breaks.
  // Therefore, we now require a manual refresh.
  // TODO - check if this is still an issue with latest Nivo version.

  const chartIsTimeChart =
    data !== undefined &&
    data.data !== undefined &&
    data.data[0] !== undefined &&
    data.data[0].x !== undefined &&
    isDateTimeOrDate(data.data[0].x);

  if (isTimeChart !== chartIsTimeChart) {
    if (!chartIsTimeChart) {
      return (
        <div style={{ margin: '15px' }}>
          Line chart switched from time-axis to number-axis. Please re-run the report to see your changes.
        </div>
      );
    }

    const p = chartIsTimeChart ? (isDateTime(data.data[0].x) ? '%Y-%m-%dT%H:%M:%SZ' : '%Y-%m-%d') : '';
    setParseFormat(p);
    setIsTimeChart(chartIsTimeChart);
  }

  const validateXTickTimeValues = xTickTimeValues.split(' ');
  if (
    validateXTickTimeValues.length != 3 ||
    validateXTickTimeValues[0] != 'every' ||
    !Number.isInteger(parseFloat(validateXTickTimeValues[1])) ||
    parseFloat(validateXTickTimeValues[1]) <= 0 ||
    !POSSIBLE_TIME_FORMATS.includes(validateXTickTimeValues[2])
  ) {
    return (
      <code style={{ margin: '10px' }}>
        Invalid tick size specification for time chart. Parameter value must be set to "every [number] ['years',
        'months', 'weeks', 'days', 'hours', 'seconds', 'milliseconds']".
      </code>
    );
  }

  /**
   * Color gradient showing the possible colors binded to the viz
   * @returns Legend based on the intensity
   */
  const generateColorLegend = () => {
    return (
      <div
        style={{
          backgroundImage: `linear-gradient(0deg, ${[...Array(11)].map((_, i) => colorScale(i / 10)).join(', ')})`,
          height: props.dimensions.height - marginBottom - marginTop - 100,
          marginTop: 20,
          marginBottom: 50,
          marginRight: 10,
          width: legendWidth,
          float: 'right',
        }}
      ></div>
    );
  };

  /**
   * Given a point in input, gets a color using the colorPicker function based on chroma.js.
   * @param node A point inside the chart
   * @returns A color based on the intensity value on the node
   */
  const getNodeColor = (node) => {
    let { intensity } = node.data;
    if (isNaN(intensity)) {
      return 'green';
    }
    // The input is normalized before passing it inside the colorPicker function
    let value =
      legendRange.max === legendRange.min ? 0.3 : (intensity - legendRange.min) / (legendRange.max - legendRange.min);

    return colorScale(value).toString();
  };

  /**
   * Component to render a custom node (necessary to bind colors to each node)
   * @param node
   * @returns Custom circle representing a node
   */
  const getCanvasNode = (node) => {
    return (
      <animated.circle
        cx={node.style.x}
        cy={node.style.y}
        r={node.style.size.to((size) => size / 2)}
        fill={getNodeColor(node.node)}
      />
    );
  };

  /**
   * Used to render a node
   * @param ctx
   * @param node
   */
  const renderNode = (ctx, node) => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size / 2, 0, 2 * Math.PI);
    ctx.fillStyle = getNodeColor(node);
    ctx.fill();
  };

  /**
   * Component to render a custom tooltip
   * @param node Current selected node
   * @returns Tooltip generated for that node
   */
  const generateTooltip = (node) => {
    return (
      <div style={{ color: 'black', background: 'white', border: '1px solid black', padding: '12px 16px' }}>
        <strong>{node.data.label ? `${labelProp}: ${node.data.label} ` : ''}</strong>
        <br />
        <strong>{node.data.intensity ? `${colorIntensityProp}: ${node.data.intensity}` : ''}</strong>
        {node.data.label ? <br /> : <></>}
        {`x: ${node.formattedX}`}
        <br />
        {`y: ${node.formattedY}`}
        <br />
      </div>
    );
  };

  // Fixing canvas bug, from https://github.com/plouc/nivo/issues/2162
  HTMLCanvasElement.prototype.getBBox = function tooltipMapper() {
    return { width: this.offsetWidth, height: this.offsetHeight };
  };

  // If the query returns too many nodes, pass to a Canvas verison of the chart (scales easier than a normal plot)
  const ComponentType = data.data.length <= 50 ? ResponsiveScatterPlot : ResponsiveScatterPlotCanvas;

  const scatterplot = (
    <div
      style={{
        width: !keepLegend ? '100%' : props.dimensions.width - legendWidth - 10,
        height: '100%',
        float: 'left',
        display: 'flex',
      }}
    >
      <ComponentType
        theme={themeNivo}
        data={[data]}
        key={`${selection.value}`}
        xScale={
          isTimeChart
            ? { format: parseFormat, type: 'time' }
            : xScale == 'linear'
            ? { type: xScale, min: minXValue, max: maxXValue, stacked: false, reverse: false }
            : { type: xScale, min: minXValue, max: maxXValue, constant: xScaleLogBase, base: xScaleLogBase }
        }
        xFormat={isTimeChart ? `time:${xAxisTimeFormat}` : xAxisFormat}
        margin={{ top: marginTop, right: marginRight, bottom: marginBottom, left: marginLeft }}
        yScale={
          yScale == 'linear'
            ? { type: yScale, min: minYValue, max: maxYValue, stacked: false, reverse: false }
            : { type: yScale, min: minYValue, max: maxYValue, constant: xScaleLogBase, base: yScaleLogBase }
        }
        enableGridX={showGrid}
        enableGridY={showGrid}
        axisTop={null}
        axisRight={null}
        indexBy={'y'}
        axisBottom={
          isTimeChart
            ? {
                tickValues: xTickTimeValues,
                tickSize: 5,
                tickPadding: 5,
                tickRotation: xTickRotationAngle,
                format: xAxisTimeFormat,
                legend: 'Time',
                legendOffset: 36,
                legendPosition: 'middle',
              }
            : {
                orient: 'bottom',
                tickSize: 6,
                tickValues: xTickValues,
                format: xAxisFormat,
                tickRotation: xTickRotationAngle,
                tickPadding: 12,
              }
        }
        axisLeft={{
          tickSize: 6,
          tickPadding: 12,
          tickRotation: yTickRotationAngle,
        }}
        nodeComponent={getCanvasNode}
        nodeSize={pointSize}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        tooltip={(node) => generateTooltip(node.node)}
        renderNode={renderNode}
      />
    </div>
  );

  const visualization = (
    <>
      {scatterplot}
      {showLegend && keepLegend ? generateColorLegend() : <></>}
    </>
  );

  return visualization;
};

export default NeoScatterPlot;
