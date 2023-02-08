import React from 'react';
import GaugeChart from 'react-gauge-chart';
import { ChartProps } from '../../../../chart/Chart';
import { NoDrawableDataErrorMessage } from '../../../../component/editor/CodeViewerComponent';
import { createUUID } from '../../../../dashboard/DashboardThunks';

/**
 * Based on https://github.com/dekelpaz PR https://github.com/neo4j-labs/neodash/pull/191
 */
const NeoGaugeChart = (props: ChartProps) => {
  const { records } = props;
  const { selection } = props;
  const settings = props.settings ? props.settings : {};

  if (!selection || props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <NoDrawableDataErrorMessage />;
  }
  /**
   * This visualization was extracted from https://github.com/Martin36/react-gauge-chart.
   */

  const nrOfLevels = settings.nrOfLevels ? settings.nrOfLevels : 3;
  const arcsLength = settings.arcsLength ? settings.arcsLength : '0.15, 0.55, 0.3';
  const arcPadding = settings.arcPadding ? settings.arcPadding : 0.02;
  const colors = settings.colors ? settings.colors : '#5BE12C, #F5CD19, #EA4228';
  const textColor = settings.textColor ? settings.textColor : 'black';
  const animDelay = settings.animDelay ? settings.animDelay : 0;
  const animateDuration = settings.animateDuration ? settings.animateDuration : 2000;
  const marginRight = settings.marginRight ? settings.marginRight : 24;
  const marginLeft = settings.marginLeft ? settings.marginLeft : 24;
  const marginTop = settings.marginTop ? settings.marginTop : 40;
  const marginBottom = settings.marginBottom ? settings.marginBottom : 40;

  let arcsLengthN = arcsLength.split(',').map((e) => parseFloat(e.trim()));

  if (arcsLengthN.filter((e) => isNaN(e)).length > 0 || arcsLengthN.length != nrOfLevels) {
    arcsLengthN = Array(nrOfLevels).fill(1);
  }
  const sumArcs = arcsLengthN.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  arcsLengthN = arcsLengthN.map((e) => e / sumArcs);

  const chartId = createUUID();
  let score = records && records[0] && records[0]._fields && records[0]._fields[0] ? records[0]._fields[0] : '';

  if (isNaN(score)) {
    return <NoDrawableDataErrorMessage />;
  }
  if (score.low != undefined) {
    score = score.low;
  }
  if (score >= 0) {
    score /= 100;
  } // supporting older versions of Neo4j which don't support round to 2 decimal points

  return (
    <div style={{ position: 'relative', top: '40%', transform: 'translateY(-50%)' }}>
      {typeof score == 'number' ? (
        <GaugeChart
          id={chartId}
          nrOfLevels={nrOfLevels}
          percent={score}
          arcsLength={arcsLengthN}
          arcPadding={arcPadding}
          colors={colors.split(', ')}
          textColor={textColor}
          style={{ marginTop: marginTop, marginRight: marginRight, marginBottom: marginBottom, marginLeft: marginLeft }}
          animDelay={animDelay}
          animateDuration={animateDuration}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default NeoGaugeChart;
