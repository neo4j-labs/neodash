import { ResponsiveBar, ResponsiveBarCanvas } from '@nivo/bar';
import React, { useEffect } from 'react';
import { NoDrawableDataErrorMessage } from '../../component/editor/CodeViewerComponent';
import { getD3ColorsByScheme } from '../../config/ColorConfig';
import { evaluateRulesOnDict, useStyleRules } from '../../extensions/styling/StyleRuleEvaluator';
import { ChartProps } from '../Chart';
import { convertRecordObjectToString, recordToNative } from '../ChartUtils';
import { themeNivo, themeNivoCanvas } from '../Utils';
import { extensionEnabled } from '../../utils/ReportUtils';

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

  const { records, selection } = props;

  const [keys, setKeys] = React.useState<string[]>([]);
  const [data, setData] = React.useState<Record<string, any>[]>([]);

  useEffect(() => {
    let newKeys = {};
    let newData: Record<string, any>[] = records
      .reduce((data: Record<string, any>[], row: Record<string, any>) => {
        try {
          if (!selection || !selection.index || !selection.value) {
            return data;
          }
          const index = convertRecordObjectToString(row.get(selection.index));
          const idx = data.findIndex((item) => item.index === index);

          const key = selection.key !== '(none)' ? recordToNative(row.get(selection.key)) : selection.value;
          const rawValue = recordToNative(row.get(selection.value));
          const value = rawValue !== null ? rawValue : 0.0000001;
          if (isNaN(value)) {
            return data;
          }
          newKeys[key] = true;

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
        Object.keys(newKeys).forEach((key) => {
          // eslint-disable-next-line no-prototype-builtins
          if (!row.hasOwnProperty(key)) {
            row[key] = 0;
          }
        });
        return row;
      });

    setKeys(Object.keys(newKeys));
    setData(newData);
  }, [selection]);

  if (loading) {
    return <></>;
  }

  if (!selection || props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <NoDrawableDataErrorMessage />;
  }

  const settings = props.settings ? props.settings : {};
  const marginRight = settings.marginRight ? settings.marginRight : 24;
  const marginLeft = settings.marginLeft ? settings.marginLeft : 50;
  const marginTop = settings.marginTop ? settings.marginTop : 24;
  const marginBottom = settings.marginBottom ? settings.marginBottom : 40;
  const legend = settings.legend ? settings.legend : false;
  const labelRotation = settings.labelRotation != undefined ? settings.labelRotation : 45;
  const barWidth = settings.barWidth? settings.barWidth : 50;
  const padding = settings.padding ? settings.padding : 0.3;

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
  const styleRules = useStyleRules(
    extensionEnabled(props.extensions, 'styling'),
    settings.styleRules,
    props.getGlobalParameter
  );

  const chartColorsByScheme = getD3ColorsByScheme(colorScheme);
  // Compute bar color based on rules - overrides default color scheme completely.
  const getBarColor = (bar) => {
    let { id } = bar;
    let colorIndex = keys.indexOf(id);
    if (colorIndex >= chartColorsByScheme.length) {
      colorIndex %= chartColorsByScheme.length;
    }

    const dict = {};
    if (!props.selection) {
      return chartColorsByScheme[colorIndex];
    }
    dict[selection.index] = bar.indexValue;
    dict[selection.value] = bar.value;
    dict[selection.key] = bar.id;
    const validRuleIndex = evaluateRulesOnDict(dict, styleRules, ['bar color']);
    if (validRuleIndex !== -1) {
      return styleRules[validRuleIndex].customizationValue;
    }
    return chartColorsByScheme[colorIndex];
  };

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

  // Fixing canvas bug, from https://github.com/plouc/nivo/issues/2162
  HTMLCanvasElement.prototype.getBBox = function tooltipMapper() {
    return { width: this.offsetWidth, height: this.offsetHeight };
  };

  const extraProperties = positionLabel == 'off' ? {} : { barComponent: BarComponent };
  const canvas = data.length > 30;
  const BarChartComponent = canvas ? ResponsiveBarCanvas : ResponsiveBar;

  // For adaptable item length in the legend
  const maxKeyLength = Math.max(...keys.map((key) => key.length));
  const baseItemWidth = 40; // Some base width for color box and padding
  const charWidthEstimate = 5; // An estimate of how wide each character is, you might need to adjust this based on font size and type
  const itemWidthConst = baseItemWidth + maxKeyLength * charWidthEstimate;

  // Scrollable Wrapper

  const scrollableWrapperStyle: React.CSSProperties = {
    width: (barWidth*data.length)+itemWidthConst,
    height: (18*data.length)+(itemWidthConst*1.2)+marginBottom,
    whiteSpace: 'nowrap',
  };

  const barChartStyle: React.CSSProperties = {
    width: '100%',
    overflowX: 'auto',
    overflowY: 'auto',
    height: '100%'
  }

  const chart = (
    <div style={barChartStyle}>
      <div style={scrollableWrapperStyle}>
        <BarChartComponent
          theme={canvas ? themeNivoCanvas(props.theme) : themeNivo}
          data={data}
          key={`${selection.index}___${selection.value}`}
          layout={layout}
          groupMode={groupMode == 'stacked' ? 'stacked' : 'grouped'}
          // enableLabel={enableLabel}
          keys={keys}
          indexBy='index'
          margin={{
            top: marginTop,
            right: legend ? itemWidthConst + marginRight : marginRight,
            bottom: (itemWidthConst*0.3) +marginBottom,
            left: marginLeft,
          }}
          valueScale={{ type: valueScale }}
          padding={padding}
          minValue={minValue}
          maxValue={maxValue}
          colors={getBarColor}
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
                    justify: false,
                    translateX: itemWidthConst+10,
                    translateY: 0,
                    itemsSpacing: 1,
                    itemWidth: itemWidthConst,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 15,
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
      </div>
    </div>
  );

  return chart;
};

export default NeoBarChart;
