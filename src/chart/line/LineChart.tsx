import { ResponsiveLine } from '@nivo/line';
import React, { useEffect } from 'react';
import { NoDrawableDataErrorMessage } from '../../component/editor/CodeViewerComponent';
import { evaluateRulesOnDict, useStyleRules } from '../../extensions/styling/StyleRuleEvaluator';
import { ChartProps } from '../Chart';
import { recordToNative, toNumber } from '../ChartUtils';
import { themeNivo } from '../Utils';
import { extensionEnabled } from '../../utils/ReportUtils';

interface LineChartData {
  id: string;
  data: Record<any, any>[];
}

/**
 * Embeds a LineReport (from Charts) into NeoDash.
 */
const NeoLineChart = (props: ChartProps) => {
  const POSSIBLE_TIME_FORMATS = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'];

  if (props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <>No data, re-run the report.</>;
  }
  const { records, selection } = props;

  if (!selection || !selection.value || selection.value.length == 0) {
    return <div style={{ margin: '15px' }}>No y-axis selected. To view the report, select a value below. </div>;
  }

  const [isTimeChart, setIsTimeChart] = React.useState(false);
  const [validSelection, setValidSelection] = React.useState(true);

  const [parseFormat, setParseFormat] = React.useState('%Y-%m-%dT%H:%M:%SZ');
  const [data, setData] = React.useState([]);

  const settings = props.settings ? props.settings : {};

  const colorScheme = settings.colors ? settings.colors : 'set2';
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
  const curve = settings.curve ? settings.curve : 'linear';
  const marginRight = settings.marginRight ? settings.marginRight : 24;
  const marginLeft = settings.marginLeft ? settings.marginLeft : 36;
  const marginTop = settings.marginTop ? settings.marginTop : 24;
  const marginBottom = settings.marginBottom ? settings.marginBottom : 40;
  const lineWidth = settings.type == 'scatter' ? 0 : settings.lineWidth || 2;
  const pointSize = settings.pointSize ? settings.pointSize : 10;
  const showGrid = settings.showGrid != undefined ? settings.showGrid : true;
  const xTickValues = settings.xTickValues != undefined ? settings.xTickValues : undefined;
  const xTickTimeValues = settings.xTickTimeValues != undefined ? settings.xTickTimeValues : 'every 1 years';
  const xAxisTimeFormat = settings.xAxisTimeFormat != undefined ? settings.xAxisTimeFormat : '%Y-%m-%dT%H:%M:%SZ';
  const xAxisFormat = settings.xAxisFormat != undefined ? settings.xAxisFormat : undefined;

  const xTickRotationAngle = settings.xTickRotationAngle != undefined ? settings.xTickRotationAngle : 0;
  const yTickRotationAngle = settings.yTickRotationAngle != undefined ? settings.yTickRotationAngle : 0;
  const styleRules = useStyleRules(
    extensionEnabled(props.extensions, 'styling'),
    props.settings.styleRules,
    props.getGlobalParameter
  );

  // Compute line color based on rules - overrides default color scheme completely.
  // For line charts, the line color is overridden if at least one value meets the criteria.
  const getLineColors = (line) => {
    const xFieldName = props.selection && props.selection.x;
    const yFieldName = line.id;
    let color = 'black';
    for (const entry of line.data) {
      const data = {};
      data[xFieldName] = entry.x;
      data[yFieldName] = entry.y;
      const validRuleIndex = evaluateRulesOnDict(data, styleRules, ['line color']);
      if (validRuleIndex !== -1) {
        color = styleRules[validRuleIndex].customizationValue;
        break;
      }
    }
    return color;
  };

  if (!selection.value.length) {
    return <p></p>;
  }

  const isDate = (x) => {
    return x.__isDate__;
  };

  const isDateTime = (x) => {
    return x.__isDateTime__;
  };

  const isDateTimeOrDate = (x) => {
    return isDate(x) || isDateTime(x) || x instanceof Date;
  };

  useEffect(() => {
    const dataRaw: LineChartData[] = selection.value.map((key) => ({
      id: key as string,
      data: [],
    }));

    records.forEach((row) => {
      selection.value.forEach((key) => {
        const index = dataRaw.findIndex((item) => (item as Record<string, any>).id === key);
        let x: any = row.get(selection.x) || 0;
        const y: any = recordToNative(row.get(key)) || 0;
        if (dataRaw[index] && !isNaN(y)) {
          if (isDate(x)) {
            dataRaw[index].data.push({ x, y });
          } else if (isDateTime(x)) {
            x = new Date(x.toString());
            dataRaw[index].data.push({ x, y });
          } else {
            dataRaw[index].data.push({ x, y });
          }
        }
      });
    });

    setData(dataRaw);
  }, [records, selection]);

  useEffect(() => {
    let validSelectionRaw = true;
    data.forEach((selected) => {
      if (selected.data.length == 0) {
        validSelectionRaw = false;
      }
    });
    setValidSelection(validSelectionRaw);

    let timeRef = data[0]?.data[0]?.x || undefined;
    timeRef = !isNaN(toNumber(timeRef)) ? toNumber(timeRef) : timeRef;
    const chartIsTimeChart = timeRef !== undefined && isDateTimeOrDate(timeRef);
    if (isTimeChart !== chartIsTimeChart) {
      const p = chartIsTimeChart ? (isDateTime(timeRef) ? '%Y-%m-%dT%H:%M:%SZ' : '%Y-%m-%d') : '';

      setParseFormat(p);
      setIsTimeChart(chartIsTimeChart);
    }
  }, [data]);

  // TODO - Nivo has a bug that, when we switch from a time-axis to a number axis, the visualization breaks.
  // Therefore, we now require a manual refresh.
  let timeRef = data[0]?.data[0]?.x || undefined;
  const chartIsTimeChart = timeRef !== undefined && isDateTimeOrDate(timeRef);
  if (isTimeChart !== chartIsTimeChart) {
    if (!chartIsTimeChart) {
      return (
        <div style={{ margin: '15px' }}>
          Line chart switched from time-axis to number-axis. Please re-run the report to see your changes.
        </div>
      );
    }
  }

  if (!validSelection) {
    return <NoDrawableDataErrorMessage />;
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

  // T18:40:32.142+0100
  // %Y-%m-%dT%H:%M:%SZ
  const lineViz = (
    <div className='n-h-full n-w-full overflow-hidden'>
      <ResponsiveLine
        theme={themeNivo}
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
        curve={curve}
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
        pointSize={pointSize}
        lineWidth={lineWidth}
        lineColor='black'
        pointColor='white'
        colors={styleRules.length >= 1 ? getLineColors : { scheme: colorScheme }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={
          legend
            ? [
                {
                  anchor: 'top-right',
                  direction: 'row',
                  justify: false,
                  translateX: -10,
                  translateY: -20,
                  itemsSpacing: 0,
                  itemDirection: 'right-to-left',
                  itemWidth: legendWidth,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 6,
                  symbolShape: 'circle',
                  symbolBorderColor: 'rgba(0, 0, 0, .5)',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemBackground: 'rgba(0, 0, 0, .03)',
                        itemOpacity: 1,
                      },
                    },
                  ],
                },
              ]
            : []
        }
      />
    </div>
  );
  return lineViz;
};

export default NeoLineChart;
