import React from 'react';
import GaugeComponent from 'react-gauge-component';
import { ChartProps } from '../../../../chart/Chart';
import { NoDrawableDataErrorMessage } from '../../../../component/editor/CodeViewerComponent';
import { createUUID } from '../../../../dashboard/DashboardThunks';

interface SubArc {
  limit: number;
  color: string;
  // Other subArc properties...
}

const NeoGaugeChart = (props: ChartProps) => {
  const { records } = props;
  const { selection } = props;
  const settings = props.settings ? props.settings : {};

  if (!selection || props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <NoDrawableDataErrorMessage />;
  }

  const maxValue = settings.maxValue ? settings.maxValue : 100;
  const nrOfLevels = settings.nrOfLevels ? settings.nrOfLevels : 3;
  const arcsLength = settings.arcsLength ? settings.arcsLength : '1, 2, 1';
  const colorArrayString = settings.colorArray ? settings.colorArray : '#EA4228, #5BE12C'; // Example default color array

  let arcsLengthN = arcsLength.split(',').map((e) => parseFloat(e.trim()));
  const sumArcs = arcsLengthN.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  arcsLengthN = arcsLengthN.map((value) => ({ limit: (value / sumArcs) * 100 }));
  for (let i = 1; i < arcsLengthN.length; i++) {
    arcsLengthN[i].limit += arcsLengthN[i - 1].limit;
  }

  const chartId = createUUID();

  let score = records && records[0] && records[0]._fields && records[0]._fields[0] ? records[0]._fields[0] : '';

  if (isNaN(score)) {
    return <NoDrawableDataErrorMessage />;
  }
  if (score.low != undefined) {
    score = score.low;
  }

  const colorArray = colorArrayString.split(',').map((color) => color.trim());

  if (colorArray.length !== arcsLengthN.length) {
    colorArray.splice(1, colorArray.length - 2); // Keep only the first and last colors
  }

  // Dynamically generate subArcs based on arcsLengthN
  const subArcs: SubArc[] = arcsLengthN.map((arc, index) => ({
    limit: arc.limit,
    color: colorArray[index % colorArray.length], // Rotate colors based on index
    // Other subArc properties...
  }));

  return (
    <div style={{ position: 'relative', top: '40%', transform: 'translateY(-50%)' }}>
      {typeof score == 'number' ? (
        <GaugeComponent
          id={chartId}
          type="semicircle"
          value={score}
          minValue={0}
          maxValue={maxValue}
          arc={{
            cornerRadius: 7,
            padding: 0.05,
            width: 0.25,
            // nbSubArcs: nrOfLevels,
            colorArray: colorArray,
            subArcs: subArcs,
          }}
          pointer={{
            color: '#345243',
            length: 0.80,
            width: 15
          }}
          labels={{
            valueLabel: {
              matchColorWithArc: true,
              maxDecimalDigits: 2,
            },
            markLabel: {
              type: 'outer',
              marks: [
                { value: 0 },
                { value: maxValue / 4 },
                { value: maxValue / 2 },
                { value: (maxValue * 3) / 4 },
                { value: maxValue },
              ],
              valueConfig: {
                maxDecimalDigits: 2,
              },
              markerConfig: {
                char: '_',
              },
            },
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default NeoGaugeChart;
