import { ResponsiveBar, ResponsiveBarCanvas } from '@nivo/bar';
import React, { useEffect } from 'react';
import { NoDrawableDataErrorMessage } from '../../component/editor/CodeViewerComponent';
import { getD3ColorsByScheme } from '../../config/ColorConfig';
import { evaluateRulesOnDict, useStyleRules } from '../../extensions/styling/StyleRuleEvaluator';
import { ChartProps } from '../Chart';
import { convertRecordObjectToString, recordToNative } from '../ChartUtils';
import { themeNivo, themeNivoCanvas } from '../Utils';
import { extensionEnabled } from '../../utils/ReportUtils';
import { getPageNumbersAndNamesList, getRule, performActionOnElement } from '../../extensions/advancedcharts/Utils';
import { getOriginalRecordForNivoClickEvent } from './util';

const NeoBarChart = (props: ChartProps) => {
  const { records, selection } = props;

  const [keys, setKeys] = React.useState<string[]>([]);
  const [data, setData] = React.useState<Record<string, any>[]>([]);
  const settings = props.settings ? props.settings : {};
  const marginRight = settings.marginRight ? settings.marginRight : 24;
  const marginLeft = settings.marginLeft ? settings.marginLeft : 50;
  const customDimensions = settings.customDimensions ? settings.customDimensions : false;
  const legendWidth = settings.legendWidth ? settings.legendWidth : 128;
  const marginTop = settings.marginTop ? settings.marginTop : 24;
  const marginBottom = settings.marginBottom ? settings.marginBottom : 30;
  const legend = settings.legend ? settings.legend : false;
  const labelRotation = settings.labelRotation != undefined ? settings.labelRotation : 45;
  const barWidth = settings.barWidth ? settings.barWidth : 10;
  const padding = settings.padding ? settings.padding : 0.25;
  const innerPadding = settings.innerPadding ? settings.innerPadding : 0;
  const expandHeightForLegend = settings.expandHeightForLegend ? settings.expandHeightForLegend : false;
  const displayYAxis = settings.displayYAxis ?? true;
  const displayYGridLines = settings.displayYGridLines ?? true;

  const actionsRules =
    extensionEnabled(props.extensions, 'actions') && props.settings && props.settings.actionsRules
      ? props.settings.actionsRules
      : [];
  const pageNames = getPageNumbersAndNamesList();

  const legendPosition = settings.legendPosition ? settings.legendPosition : 'Vertical';

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
  // For adaptable item length in the legend

  // Populates data with record information
  useEffect(() => {
    let newKeys = {};
    let newData: Record<string, unknown>[] = records
      .reduce((data: Record<string, unknown>[], row: Record<string, any>) => {
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

  if (!selection || props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <NoDrawableDataErrorMessage />;
  }

  // Function to calculate the conditional margin bottom
  function calculateMarginBottom(legendPosition, showLegend, legendWidth, marginBottom) {
    // Check if legendPosition is 'Horizontal'
    if (legendPosition === 'Horizontal') {
      // Calculate margin based on whether the legend is shown
      return showLegend ? legendWidth * 0.3 + marginBottom + 50 : legendWidth * 0.3 + marginBottom;
    }
    // Return the default marginBottom if legendPosition is not 'Horizontal'
    return marginBottom;
  }

  // Using the function in your code
  const conditionalMarginBottom = calculateMarginBottom(legendPosition, settings.legend, legendWidth, marginBottom);

  // Function to call from BarComponent. Conducts necessary logic for Report Action.
  const handleBarClick = (e) => {
    // Get the original record that was used to draw this bar (or a group in a bar).
    const record = getOriginalRecordForNivoClickEvent(e, records, selection);

    // If there's a record, check if there are any rules assigned to each of the fields (columns).
    if (record) {
      Object.keys(record).forEach((key) => {
        let rules = getRule({ field: key, value: record[key] }, actionsRules, 'Click');
        // If there is a rule assigned, run the rule with the specified field and value retrieved from the record.
        rules?.forEach((rule) => {
          const ruleField = rule.field;
          const ruleValue = record[rule.value];
          performActionOnElement(
            { field: ruleField, value: ruleValue },
            actionsRules,
            { ...props, pageNames: pageNames },
            'Click',
            'bar'
          );
        });
      });
    }
  };

  // Function to calculate the right margin
  function calculateRightMargin(legendPosition, legend, legendWidth, marginRight) {
    if (legendPosition === 'Vertical') {
      return legend ? legendWidth + marginRight : marginRight;
    }
    return marginRight;
  }

  // Original margin function, refactored
  const margin = () => {
    return {
      top: marginTop,
      right: calculateRightMargin(legendPosition, legend, legendWidth, marginRight),
      bottom: conditionalMarginBottom,
      left: marginLeft,
    };
  };

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

  function calculateLabelPosition(bar, positionLabel, layout) {
    let x = bar.width ? bar.width / 2 : 0;
    let y = bar.height ? bar.height / 2 : 0;

    if (positionLabel === 'top') {
      if (layout === 'vertical') {
        y = -10;
      } else {
        x = bar.width + 10;
      }
    } else if (positionLabel === 'bottom') {
      if (layout === 'vertical') {
        y = bar.height + 10;
      } else {
        x = -10;
      }
    }

    return { x, y };
  }

  // Used instead of BarChartComponent when Position Label !== 'off'
  const BarComponent = ({ bar, borderColor, onClick }) => {
    let shade = false;
    let darkTop = false;
    let includeIndex = false;
    let textAnchor = 'middle';
    const { x, y } = calculateLabelPosition(bar, positionLabel, layout);

    return (
      <g
        transform={`translate(${bar.x},${bar.y})`}
        // onClick event to trigger event to pass value with report action
        onClick={(event) => onClick(bar.data, event)}
        style={{ cursor: 'pointer' }}
      >
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
              fontSize: 30,
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
              fontWeight: 100,
              fontSize: 10,
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
  // SVGGraphicsElement.getBBox
  HTMLCanvasElement.prototype.getBBox = function tooltipMapper() {
    return { width: this.offsetWidth, height: this.offsetHeight };
  };

  const extraProperties = positionLabel !== 'off' ? { barComponent: BarComponent } : {};
  const canvas = data.length > 30;
  const BarChartComponent = canvas ? ResponsiveBarCanvas : ResponsiveBar;

  // Creates enough width to ensure chart doesn't get cut off
  const adaptableWidth =
    marginLeft +
    marginRight +
    data.length * barWidth * 4 +
    (data.length - 1) * 4 +
    (data.length - 1) * innerPadding * 4;

  // Legend F
  const calculateLegendConfig = () => {
    if (!legend) {
      return []; // No legend required
    }

    if (legendPosition === 'Horizontal') {
      return [
        {
          dataFrom: 'keys',
          anchor: 'bottom',
          direction: 'row',
          justify: false,
          translateX: 0,
          translateY: legendWidth,
          itemsSpacing: 2,
          itemWidth: legendWidth,
          itemHeight: 20,
          itemDirection: 'left-to-right',
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
      ];
    }
    // Vertical legend
    return [
      {
        dataFrom: 'keys',
        anchor: 'bottom-right',
        direction: 'column',
        justify: false,
        translateX: legendWidth + 10,
        translateY: 0,
        itemsSpacing: 1,
        itemWidth: legendWidth,
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
    ];
  };

  // Height of each legend item
  const itemHeight = 24.5;

  // Function to handle width logic, including scrollbar logic
  function calculateWidth(customDimensions, legendPosition, adaptableWidth, legendWidth, data, barWidth) {
    if (!customDimensions) {
      return '100%';
    }

    if (legendPosition === 'Horizontal') {
      const horizontalLegendWidth = legendWidth * data.length + 200;
      return adaptableWidth > horizontalLegendWidth ? adaptableWidth : horizontalLegendWidth;
    }

    return barWidth * 5 * data.length + legendWidth;
  }

  // Container to make the chart scroll horizontally
  const scrollableWrapperStyle: React.CSSProperties = {
    width: calculateWidth(customDimensions, legendPosition, adaptableWidth, legendWidth, data, barWidth),
    height: expandHeightForLegend ? itemHeight * data.length + conditionalMarginBottom : '100%',
    whiteSpace: 'nowrap',
  };

  // Container for scrolling container to scroll in
  const barChartStyle: React.CSSProperties = customDimensions
    ? {
        width: '100%',
        overflowX: 'auto',
        overflowY: 'auto',
        height: '100%',
      }
    : {
        width: '100%',
        height: '100%',
        overflowY: 'auto',
      };

  const chart = (
    <div style={barChartStyle}>
      <div style={scrollableWrapperStyle}>
        <BarChartComponent
          theme={canvas ? themeNivoCanvas(props.theme) : themeNivo}
          data={data}
          key={`${selection.index}___${selection.value}`}
          layout={layout}
          groupMode={groupMode == 'stacked' ? 'stacked' : 'grouped'}
          enableLabel={enableLabel}
          onClick={handleBarClick}
          keys={keys}
          indexBy='index'
          margin={margin()}
          valueScale={{ type: valueScale }}
          padding={padding}
          innerPadding={innerPadding}
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
          axisLeft={
            displayYAxis
              ? {
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                }
              : null
          }
          enableGridY={displayYGridLines}
          labelSkipWidth={labelSkipWidth}
          labelSkipHeight={labelSkipHeight}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          {...extraProperties}
          legends={calculateLegendConfig()}
          animate={false}
        />
      </div>
    </div>
  );

  return chart;
};

export default NeoBarChart;
