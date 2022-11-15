import { ResponsiveBar } from '@nivo/bar';
import React, { useEffect } from 'react';
import { NoDrawableDataErrorMessage } from '../../component/editor/CodeViewerComponent';
import { extensionEnabled } from '../../extensions/ExtensionUtils';
import { evaluateRulesOnDict } from '../../extensions/styling/StyleRuleEvaluator';
import { ChartProps } from '../Chart';
import { convertRecordObjectToString, recordToNative } from '../ChartUtils';

/**
 * Embeds a BarReport (from Nivo) into NeoDash.
 *  This visualization was extracted from https://github.com/neo4j-labs/charts.
 * TODO: There is a regression here with nivo > 0.73 causing the bar chart to have a very slow re-render.
 */
const NeoBarChart = (props: ChartProps) => {
  /**
   * The code fragment below is a workaround for a bug in nivo > 0.73 causing bar charts to re-render very slowly.
   */
  const [loading, setLoading] = React.useState(false);
  useEffect(() => {
    setLoading(true);
    const timeOutId = setTimeout(() => {
      setLoading(false);
    }, 1);
    return () => clearTimeout(timeOutId);
  }, [props.selection]);
  if (loading) {
    return <></>;
  }

  const { records, selection } = props;

  if (!selection || props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <NoDrawableDataErrorMessage />;
  }

  const keys = {};
  const data: Record<string, any>[] = records
    .reduce((data: Record<string, any>[], row: Record<string, any>) => {
      try {
        if (!selection || !selection.index || !selection.value) {
          return data;
        }
        const index = convertRecordObjectToString(row.get(selection.index));
        const idx = data.findIndex((item) => item.index === index);

        const key = selection.key !== '(none)' ? recordToNative(row.get(selection.key)) : selection.value;
        const value = recordToNative(row.get(selection.value));

        if (isNaN(value)) {
          return data;
        }
        keys[key] = true;

        if (idx > -1) {
          data[idx][key] = value;
        } else {
          data.push({ index, [key]: value });
        }
        return data;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        return [];
      }
    }, [])
    .map((row) => {
      Object.keys(keys).forEach((key) => {
        // eslint-disable-next-line no-prototype-builtins
        if (!row.hasOwnProperty(key)) {
          row[key] = 0;
        }
      });
      return row;
    });

  const settings = props.settings ? props.settings : {};
  const legendWidth = settings.legendWidth ? settings.legendWidth : 128;
  const marginRight = settings.marginRight ? settings.marginRight : 24;
  const marginLeft = settings.marginLeft ? settings.marginLeft : 50;
  const marginTop = settings.marginTop ? settings.marginTop : 24;
  const marginBottom = settings.marginBottom ? settings.marginBottom : 40;
  const legend = settings.legend ? settings.legend : false;
  const labelRotation = settings.labelRotation != undefined ? settings.labelRotation : 45;

  const labelSkipWidth = settings.labelSkipWidth ? settings.labelSkipWidth : 0;
  const labelSkipHeight = settings.labelSkipHeight ? settings.labelSkipHeight : 0;
  const enableLabel = settings.barValues ? settings.barValues : false;
  const positionLabel = settings.positionLabel ? settings.positionLabel : 'off';

  // TODO: we should make all these defaults be loaded from the config file.
  const layout = settings.layout ? settings.layout : 'vertical';
  const colorScheme = settings.colors ? settings.colors : 'set2';
  const groupMode = settings.groupMode ? settings.groupMode : 'stacked';
  const valueScale = settings.valueScale ? settings.valueScale : 'linear';
  const minValue = settings.minValue ? settings.minValue : 'auto';
  const maxValue = settings.maxValue ? settings.maxValue : 'auto';
  const styleRules =
    extensionEnabled(props.extensions, 'styling') && props.settings && props.settings.styleRules
      ? props.settings.styleRules
      : [];

  // Compute bar color based on rules - overrides default color scheme completely.
  const getBarColor = (bar) => {
    const data = {};
    if (!selection || !selection.index || !selection.value) {
      return 'grey';
    }
    data[selection.index] = bar.indexValue;
    data[selection.value] = bar.value;
    data[selection.key] = bar.id;
    const validRuleIndex = evaluateRulesOnDict(data, styleRules, ['bar color']);
    if (validRuleIndex !== -1) {
      return styleRules[validRuleIndex].customizationValue;
    }
    return 'grey';
  };
  if (data.length == 0) {
    return <NoDrawableDataErrorMessage />;
  }

  const BarComponent = ({ bar, borderColor }) => {
    let shade = false;
    let darkTop = false;
    let includeIndex = false;
    let x = bar.width / 2;
    let y = bar.height / 2;
    let textAnchor = 'middle';
    if (positionLabel == 'top') {
      if (layout == 'vertical') {
        y = -10;
      } else {
        x = bar.width + 10;
      }
    } else if (positionLabel == 'bottom') {
      if (layout == 'vertical') {
        y = bar.height + 10;
      } else {
        x = -10;
      }
    }

    return (
      <g transform={`translate(${bar.x},${bar.y})`}>
        {shade ? <rect x={-3} y={7} width={bar.width} height={bar.height} fill='rgba(0, 0, 0, .07)' /> : <></>}
        <rect width={bar.width} height={bar.height} fill={bar.color} />
        {darkTop ? (
          <rect x={bar.width - 5} width={5} height={bar.height} fill={borderColor} fillOpacity={0.2} />
        ) : (
          <></>
        )}
        {includeIndex ? (
          <text
            x={bar.width - 16}
            y={bar.height / 2}
            textAnchor='end'
            dominantBaseline='central'
            fill='black'
            style={{
              fontWeight: 900,
              fontSize: 15,
            }}
          >
            {bar.data.indexValue}
          </text>
        ) : (
          <></>
        )}
        {enableLabel ? (
          <text
            x={x}
            y={y}
            textAnchor={textAnchor}
            dominantBaseline='central'
            fill={borderColor}
            style={{
              fontWeight: 400,
              fontSize: 13,
            }}
          >
            {bar.data.value}
          </text>
        ) : (
          <></>
        )}
      </g>
    );
  };
  // TODO: Get rid of duplicate pie slice names...

  const extraProperties = positionLabel == 'off' ? {} : { barComponent: BarComponent };
  return (
    <ResponsiveBar
      layout={layout}
      groupMode={groupMode == 'stacked' ? 'stacked' : 'grouped'}
      enableLabel={enableLabel}
      data={data}
      keys={Object.keys(keys)}
      indexBy='index'
      margin={{
        top: marginTop,
        right: legend ? legendWidth + marginRight : marginRight,
        bottom: marginBottom,
        left: marginLeft,
      }}
      valueScale={{ type: valueScale }}
      padding={0.3}
      minValue={minValue}
      maxValue={maxValue}
      colors={styleRules.length >= 1 ? getBarColor : { scheme: colorScheme }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: labelRotation,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
      }}
      labelSkipWidth={labelSkipWidth}
      labelSkipHeight={labelSkipHeight}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      {...extraProperties}
      legends={
        legend
          ? [
              {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: true,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: legendWidth - 28,
                itemHeight: 20,
                itemDirection: 'right-to-left',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]
          : []
      }
      animate={false}
    />
  );
};

export default NeoBarChart;
