import React from 'react';
import GaugeComponent from 'react-gauge-component';
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

  const maxValue = settings.maxValue ? settings.maxValue : 100;
  const nrOfLevels = settings.nrOfLevels ? settings.nrOfLevels : 3;
  const arcsLength = settings.arcsLength ? settings.arcsLength : '0.15, 0.55, 0.3';
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

// Add this part to use the new "GaugeComponent"
return (
  <div style={{ position: 'relative', top: '40%', transform: 'translateY(-50%)' }}>
    {typeof score == 'number' ? (
      <GaugeComponent
        id={chartId}
        type="grafana"
        value={score}
        minValue={0}
        maxValue={maxValue}
        arc={{
          cornerRadius: 7,
          padding: 0.05,
          width: 0.25,
        }}
        pointer={{
          type: "needle",
          color: "#464A4F",
          baseColor: "#464A4F",
          length: 0.70,
          animate: true,
          elastic: false,
          animationDuration: 3000,
          animationDelay: 100,
          width: 20,
        }}
        labels={{
          valueLabel: {
            matchColorWithArc: true,
            maxDecimalDigits: 2,
          },
          markLabel: {
            type: "outer",
            marks: [
              { value: 0 },
              { value: maxValue
          /4 },
              { value: maxValue
          /2 },
              { value: maxValue
          *3/4 },
              { value: maxValue
         },
            ],
            valueConfig: {
              maxDecimalDigits: 2,
            },
            markerConfig: {
              char: '_',
            },
          },
        }}
        style={{ marginTop: marginTop, marginRight: marginRight, marginBottom: marginBottom, marginLeft: marginLeft }}
      />
    ) : (
      <></>
    )}
  </div>
);
    };
export default NeoGaugeChart;
