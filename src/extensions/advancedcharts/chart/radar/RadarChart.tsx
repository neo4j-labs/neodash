import React from 'react';
import { ChartProps } from '../../../../chart/Chart';
import { ResponsiveRadar } from '@nivo/radar'
import { evaluateRulesOnDict, evaluateRulesOnNode } from '../../../styling/StyleRuleEvaluator';
import { NoDrawableDataErrorMessage } from '../../../../component/editor/CodeViewerComponent';

/**
 * Embeds a RadarChart (from Charts) into NeoDash.
 */
const NeoRadarChart = (props: ChartProps) => {
  if (
    !props.selection ||
    props.selection.values == undefined ||
    props.records == null ||
    props.records.length == 0 ||
    props.records[0].keys == null
  ) {
    return <NoDrawableDataErrorMessage />;
  }
  const { records } = props;
  const first = records[0] ? records[0] : undefined;
  const selection = props.selection ? props.selection : {};
  const settings = props.settings ? props.settings : {};
  const legendHeight = 20;
  const legendWidth = 20;
  const marginRight = settings.marginRight ? settings.marginRight : 24;
  const marginLeft = settings.marginLeft ? settings.marginLeft : 24;
  const marginTop = settings.marginTop ? settings.marginTop : 40;
  const marginBottom = settings.marginBottom ? settings.marginBottom : 40;
  const dotSize = settings.dotSize ? settings.dotSize : 10;
  const dotBorderWidth = settings.dotBorderWidth ? settings.dotBorderWidth : 2;
  const gridLabelOffset = settings.gridLabelOffset ? settings.gridLabelOffset : 16;
  const gridLevels = settings.gridLevels ? settings.gridLevels : 5;
  const interactive = settings.interactive !== undefined ? settings.interactive : true;
  const animate = settings.animate !== undefined ? settings.animate : true;
  const legend = settings.legend !== undefined ? settings.legend : false;
  const colorScheme = settings.colors ? settings.colors : 'set2';
  const blendMode = settings.blendMode ? settings.blendMode : 'normal';
  const motionConfig = settings.motionConfig ? settings.motionConfig : 'gentle';
  const curve = settings.curve ? settings.curve : 'linearClosed';
  const styleRules = settings && settings.styleRules ? settings.styleRules : [];
  const keys = selection.values;

  // Compute slice color based on rules - overrides default color scheme completely.
  const getCircleColor = (slice) => {
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

  let valid = true;
  const data = records.map((r) => {
    const entry = {};
    selection.values.concat([selection.index]).forEach((k) => {
      const fieldIndex = r._fieldLookup[k];
      if (k !== selection.index && isNaN(r._fields[fieldIndex])) {
        // eslint-disable-next-line no-console
        console.log(k, r._fields[fieldIndex]);
        valid = false;
      }
      entry[k] = `${r._fields[fieldIndex]}`;
    });
    return entry;
  });

    // If we find inconsitent data, return an error/
    if(!valid){
        return <NoDrawableDataErrorMessage/>;
    }
    return <ResponsiveRadar
        data={data}
        isInteractive={interactive}
        animate={animate}
        margin={{ top: (legend) ? legendHeight + marginTop : marginTop, right: (legend) ? legendWidth + marginRight : marginRight, bottom: marginBottom, left: (legend) ? legendHeight + marginLeft : marginLeft }}
        gridLevels={gridLevels}
        keys={keys}
        indexBy={selection['index']}
        valueFormat=">-.2f"
        borderColor={{ from: 'color' }}
        gridLabelOffset={gridLabelOffset}
        dotSize={dotSize}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={dotBorderWidth}
        //colors={styleRules.length >= 1 ? getCircleColor : { scheme: colorScheme }}
        colors={{ scheme: colorScheme }}
        blendMode={blendMode}
        motionConfig={motionConfig}
        curve={curve}
        legends={(legend) ? [
            {
                anchor: 'top-left',
                direction: 'column',
                translateX: 0,
                translateY: -40,
                itemWidth: 100,
                itemHeight: 14,
                itemTextColor: '#999',
                symbolSize: 14,
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
    />
  );
};

export default NeoRadarChart;
