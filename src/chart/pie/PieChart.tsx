import { ResponsivePie } from '@nivo/pie';
import React from 'react';
import { NoDrawableDataErrorMessage } from '../../component/editor/CodeViewerComponent';
import { evaluateRulesOnDict } from '../../extensions/styling/StyleRuleEvaluator';
import { ChartProps } from '../Chart';
import { convertRecordObjectToString, recordToNative } from '../ChartUtils';

/**
 * Embeds a PieChart (from Nivo) into NeoDash.
 */
const NeoPieChart = (props: ChartProps) => {
  const { records } = props;
  const { selection } = props;

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
          data.push({ id: index, label: index, value: value });
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
  const legendHeight = 20;
  const marginRight = settings.marginRight ? settings.marginRight : 24;
  const marginLeft = settings.marginLeft ? settings.marginLeft : 24;
  const marginTop = settings.marginTop ? settings.marginTop : 24;
  const marginBottom = settings.marginBottom ? settings.marginBottom : 40;
  const sortByValue = settings.sortByValue ? settings.sortByValue : false;
  const enableArcLabels = settings.enableArcLabels !== undefined ? settings.enableArcLabels : true;
  const enableArcLinkLabels = settings.enableArcLinkLabels !== undefined ? settings.enableArcLinkLabels : true;
  const interactive = settings.interactive ? settings.interactive : true;
  const innerRadius = settings.innerRadius ? settings.innerRadius : 0;
  const padAngle = settings.padAngle ? settings.padAngle : 0;
  const borderWidth = settings.borderWidth ? settings.borderWidth : 0;
  const activeOuterRadiusOffset = settings.activeOuterRadiusOffset ? settings.activeOuterRadiusOffset : 8;
  const arcLinkLabelsOffset = settings.arcLinkLabelsOffset ? settings.arcLinkLabelsOffset : 15;
  const arcLinkLabelsSkipAngle = settings.arcLinkLabelsSkipAngle ? settings.arcLinkLabelsSkipAngle : 1;
  const cornerRadius = settings.cornerRadius ? settings.cornerRadius : 1;
  const arcLabelsSkipAngle = settings.arcLabelsSkipAngle ? settings.arcLabelsSkipAngle : 10;

  const legend = settings.legend ? settings.legend : false;
  const colorScheme = settings.colors ? settings.colors : 'set2';
  const styleRules = settings && settings.styleRules ? settings.styleRules : [];

  // Compute slice color based on rules - overrides default color scheme completely.
  const getSliceColor = (slice) => {
    const data = {};
    if (!props.selection) {
      return 'grey';
    }
    data[props.selection.value] = slice.value;
    data[props.selection.index] = slice.id;
    const validRuleIndex = evaluateRulesOnDict(data, styleRules, ['slice color']);
    if (validRuleIndex !== -1) {
      return styleRules[validRuleIndex].customizationValue;
    }
    return 'grey';
  };

  const getArcLabel = (item) => {
    return `${((item.arc.angleDeg * 100) / 360).toFixed(2).toString()}%`;
  };

  if (data.length == 0) {
    return <NoDrawableDataErrorMessage />;
  }

  return (
    <ResponsivePie
      data={data}
      sortByValue={sortByValue}
      enableArcLabels={enableArcLabels}
      enableArcLinkLabels={enableArcLinkLabels}
      isInteractive={interactive}
      innerRadius={innerRadius}
      padAngle={padAngle}
      borderWidth={borderWidth}
      activeOuterRadiusOffset={activeOuterRadiusOffset}
      cornerRadius={cornerRadius}
      arcLinkLabelsSkipAngle={arcLinkLabelsSkipAngle}
      arcLinkLabelsOffset={arcLinkLabelsOffset}
      arcLabelsSkipAngle={arcLabelsSkipAngle}
      margin={{
        top: marginTop,
        right: marginRight,
        bottom: legend ? legendHeight + marginBottom : marginBottom,
        left: marginLeft,
      }}
      colors={styleRules.length >= 1 ? getSliceColor : { scheme: colorScheme }}
      legends={
        legend
          ? [
              {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 50,
                itemsSpacing: 0,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemTextColor: '#000',
                    },
                  },
                ],
              },
            ]
          : []
      }
      animate={true}
      // TODO : Needs to be set dynamic (default true on percentage)
      arcLabel={getArcLabel}
    />
  );
};

export default NeoPieChart;
