import React, { useEffect } from 'react';
import { NoDrawableDataErrorMessage } from '../../component/editor/CodeViewerComponent';
import { ChartProps } from '../Chart';
import { recordToNative } from '../ChartUtils';
import { ResponsiveScatterPlot, ScatterPlot } from '@nivo/scatterplot';
import { animated } from '@react-spring/web';
import chroma from 'chroma-js';

/**
 * Embeds a LineReport (from Charts) into NeoDash.
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

  const [isTimeChart, setIsTimeChart] = React.useState(false);
  const [parseFormat, setParseFormat] = React.useState('%Y-%m-%dT%H:%M:%SZ');
  const legendRange = { min: 0, max: 0 };

  const settings = props.settings ? props.settings : {};
  const colorScheme = settings.colors ? settings.colors : 'set2';

  const pointSize = settings.pointSize ? settings.pointSize : 10;
  const showGrid = settings.showGrid != undefined ? settings.showGrid : true;

  const xScale = settings.xScale ? settings.xScale : 'linear';
  const yScale = settings.yScale ? settings.yScale : 'linear';

  const xScaleLogBase = settings.xScaleLogBase ? settings.xScaleLogBase : 10;
  const yScaleLogBase = settings.yScaleLogBase ? settings.yScaleLogBase : 10;

  const minXValue = settings.minXValue ? settings.minXValue : 'auto';
  const maxXValue = settings.maxXValue ? settings.maxXValue : 'auto';
  const minYValue = settings.minYValue ? settings.minYValue : 'auto';
  const maxYValue = settings.maxYValue ? settings.maxYValue : 'auto';

  const legend = settings.legend != undefined ? settings.legend : false;
  const legendWidth = settings.legendWidth ? settings.legendWidth : 70;
  const marginRight = settings.marginRight ? settings.marginRight : 24;
  const marginLeft = settings.marginLeft ? settings.marginLeft : 36;
  const marginTop = settings.marginTop ? settings.marginTop : 24;
  const marginBottom = settings.marginBottom ? settings.marginBottom : 40;

  const colorIntensityProp = settings.colorIntensityProp != undefined ? settings.colorIntensityProp : 'intensity';

  const xTickValues = settings.xTickValues != undefined ? settings.xTickValues : undefined;
  const xTickTimeValues = settings.xTickTimeValues != undefined ? settings.xTickTimeValues : 'every 1 years';
  const xAxisTimeFormat = settings.xAxisTimeFormat != undefined ? settings.xAxisTimeFormat : '%Y-%m-%dT%H:%M:%SZ';
  const xAxisFormat = settings.xAxisFormat != undefined ? settings.xAxisFormat : undefined;
  const xTickRotationAngle = settings.xTickRotationAngle != undefined ? settings.xTickRotationAngle : 0;
  const yTickRotationAngle = settings.yTickRotationAngle != undefined ? settings.yTickRotationAngle : 0;
  const colorPicker = chroma.scale(['green', 'yellow', 'red']);

  // Compute line color based on rules - overrides default color scheme completely.
  // For line charts, the line color is overridden if at least one value meets the criteria.
  // TODO: define color gradient with min and max intensity and work on Legend
  const getNodeColors = (point) => {
    let { intensity } = point.node.data;

    let value = isNaN(intensity) ? 'black' : (intensity - legendRange.min) / (legendRange.max - legendRange.min);
    return colorPicker(value).toString();
  };

  if (!selection.value.length) {
    return <p></p>;
  }

  const data = selection.value.map((key) => ({
    id: key as string,
    data: [],
  }));

  const isDate = (x) => {
    return x.__isDate__;
  };

  const isDateTime = (x) => {
    return x.__isDateTime__;
  };

  const isDateTimeOrDate = (x) => {
    return isDate(x) || isDateTime(x) || x instanceof Date;
  };

  const intensityList: any[] = [];
  console.log('adnawondowa');

  // TODO: ideally we want this running only when we load new records and not every resize
  records.forEach((row) => {
    const intensity: any = row.keys.includes(colorIntensityProp)
      ? recordToNative(row.get(colorIntensityProp))
      : undefined;

    if (intensity) {
      intensityList.push(intensity);
    }

    selection.value.forEach((key) => {
      const index = data.findIndex((item) => (item as Record<string, any>).id === key);
      let x: any = row.get(selection.x) || 0;
      let y: any = recordToNative(row.get(key)) || 0;
      if (data[index] && !isNaN(y)) {
        if (isDateTime(x)) {
          x = new Date(x.toString());
        }
        data[index].data.push({ x, y, intensity });
      }
    });
  });

  // Sorting to get the min and max from list of intesities
  intensityList.sort((a, b) => {
    return a - b;
  });

  legendRange.min = intensityList[0];
  legendRange.max = intensityList.slice(-1)[0];

  // Post-processing validation on the data --> confirm only numeric data was selected by the user.
  let validSelection = true;
  data.forEach((selected) => {
    if (selected.data.length == 0) {
      validSelection = false;
    }
  });

  if (!validSelection) {
    return <NoDrawableDataErrorMessage />;
  }

  // TODO - Nivo has a bug that, when we switch from a time-axis to a number axis, the visualization breaks.
  // Therefore, we now require a manual refresh.

  const chartIsTimeChart =
    data[0] !== undefined &&
    data[0].data[0] !== undefined &&
    data[0].data[0].x !== undefined &&
    isDateTimeOrDate(data[0].data[0].x);

  if (isTimeChart !== chartIsTimeChart) {
    // doesn't seem true from testing mmmmmmm
    if (!chartIsTimeChart) {
      return (
        <div style={{ margin: '15px' }}>
          Line chart switched from time-axis to number-axis. Please re-run the report to see your changes.
        </div>
      );
    }
    const p = chartIsTimeChart ? (isDateTime(data[0].data[0].x) ? '%Y-%m-%dT%H:%M:%SZ' : '%Y-%m-%d') : '';

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
   * Component to render a custom node (necessary to bind colors to each node)
   * @param node
   * @returns Custom circle representing a node
   */
  const MyCustomNode = (node) => (
    <animated.circle
      cx={node.style.x}
      cy={node.style.y}
      r={node.style.size.to((size) => size / 2)}
      fill={getNodeColors(node)}
      style={{ mixBlendMode: node.blendMode }}
    />
  );

  const scatterPlotViz = (
    <div className='h-full w-full overflow-hidden' style={{ height: '100%' }}>
      <ResponsiveScatterPlot
        data={data}
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
        nodeComponent={MyCustomNode}
        pointSize={pointSize}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
      />
    </div>
  );
  return scatterPlotViz;
};

export default NeoScatterPlot;
