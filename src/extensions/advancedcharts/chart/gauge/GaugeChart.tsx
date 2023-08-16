import React from 'react';
import GaugeComponent from 'react-gauge-component';
import { ChartProps } from '../../../../chart/Chart';
import { NoDrawableDataErrorMessage } from '../../../../component/editor/CodeViewerComponent';
import { createUUID } from '../../../../dashboard/DashboardThunks';

interface SubArc {
  limit: number;
  color: string;
}

const NeoGaugeChart = (props: ChartProps) => {
  const { records } = props;
  const { selection } = props;
  const settings = props.settings ? props.settings : {};

  if (!selection || props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <NoDrawableDataErrorMessage />;
  }

  const maxValue = settings.maxValue ? settings.maxValue : 100;
  const arcsLength = settings.arcsLength ? settings.arcsLength : '1, 1, 1';
  let arcsLengthN = arcsLength.split(',').map((e) => parseFloat(e.trim()));
  const arcPadding = settings.arcPadding ? settings.arcPadding : 0.02
  const nbOfLevels = settings.nrOfLevels ? settings.nrOfLevels : (arcsLength ? arcsLengthN.length : 3);
  const colorArrayString = settings.colorArray ? settings.colorArray : '#EA4228, #5BE12C';
  const textColor = settings.textColor ? settings.textColor : 'black'


  if (arcsLengthN.length === nbOfLevels) {
    const sumArcs = arcsLengthN.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    arcsLengthN = arcsLengthN.map((value) => ({ limit: (value / sumArcs) * 100 }));
    for (let i = 1; i < arcsLengthN.length; i++) {
      arcsLengthN[i].limit += arcsLengthN[i - 1].limit;
    }
  }
  while (arcsLengthN.length < nbOfLevels) {
    arcsLengthN.push(1);
  }
  while (arcsLengthN.length > nbOfLevels) {
    arcsLengthN.pop();
  }

  const chartId = createUUID();

  let score = records && records[0] && records[0]._fields && records[0]._fields[0] ? records[0]._fields[0] : '';

  if (isNaN(score)) {
    return <NoDrawableDataErrorMessage />;
  }
  score = score.toNumber();

  const colorArray = colorArrayString.split(',').map((color) => color.trim());

  if (colorArray.length !== arcsLengthN.length) {
    colorArray.splice(1, colorArray.length - 2);
  }

  const subArcs: SubArc[] = arcsLengthN.map((arc, index) => ({
    limit: arc.limit,
    color: colorArray[index % colorArray.length],
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
            padding: arcPadding,
            cornerRadius: 7,
            width: 0.25,
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
              style: {textShadow: "none"},
            },
            markLabel: {
              type: 'inner',
              marks: [
                { value: 0 },
                { value: maxValue / 4 },
                { value: maxValue / 2 },
                { value: (maxValue * 3) / 4 },
                { value: maxValue },
              ],
              valueConfig: {
                maxDecimalDigits: 2,
                style: {fill: textColor, textShadow: "none"},
              },
              markerConfig: {
                char: '_',
                style: {textShadow: "none"},
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

