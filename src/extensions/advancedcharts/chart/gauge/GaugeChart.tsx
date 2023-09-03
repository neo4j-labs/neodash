import React from 'react';
import GaugeComponent from 'react-gauge-component';
import { ChartProps } from '../../../../chart/Chart';
import { NoDrawableDataErrorMessage } from '../../../../component/editor/CodeViewerComponent';
import { createUUID } from '../../../../utils/uuid';

interface SubArc {
  limit: number;
  color: string;
}

interface nrMarkers {
  value: number;
}

const NeoGaugeChart = (props: ChartProps) => {
  const { records } = props;
  const { selection } = props;
  const settings = props.settings ? props.settings : {};

  if (!selection || props.records == null || props.records.length == 0 || props.records[0].keys == null) {
    return <NoDrawableDataErrorMessage />;
  }

  let maxValue = settings.maxValue ? settings.maxValue : 100;
  let minValue = settings.minValue ? settings.minValue : 0;
  const arcsLength = settings.arcsLength ? settings.arcsLength : '1, 1, 1';
  let arcsLengthN = arcsLength.split(',').map((e) => parseFloat(e.trim()));
  const arcPadding = settings.arcPadding ? settings.arcPadding : 0.02;
  const nbOfLevels = settings.nrOfLevels ? settings.nrOfLevels : (arcsLength ? arcsLengthN.length : 3);
  const colorArrayString = settings.colorArray ? settings.colorArray : '#EA4228, #5BE12C';
  const textColor = settings.textColor ? settings.textColor : '#000000';
  const valueLabelColor = settings.valueLabelColor ? settings.valueLabelColor : 'arc color';
  const arrowColor = settings.pointerColor ? settings.pointerColor : '#000000';
  let matchColorWithArc = false;
  const markerPosition = settings.markerPosition ? settings.markerPosition : "outer";
  const graphStyle = settings.graphStyle ? settings.graphStyle : 'grafana';
  const nrMarkers = settings.numberOfMarkers ? settings.numberOfMarkers : 5;
  const marginSides = settings.marginSides || settings.marginSides === 0 ? settings.marginSides: 30;
  const pointerType = settings.pointerType ? settings.pointerType : 'needle';
  const animationDuration = settings.animateDuration ? settings.animateDuration : 2000;
  const animationDelay = settings.animDelay ? settings.animDelay : 0;


  function colorTranslater(colorName): any {
    switch(colorName) {
      case 'arc color':
        return null;
      case 'black':
        return '#000000';
      case 'dark grey':
        return '#242424';
      case 'grey':
        return '#9c9c9c';
        default:
          null;
    }
  }

  const chartId = createUUID();

  let score = records && records[0] && records[0]._fields && records[0]._fields[0] ? records[0]._fields[0] : '';

  if (isNaN(score)) {
    return <NoDrawableDataErrorMessage />;
  }
  score = score.toNumber();
  
  if (score>maxValue) {
    maxValue = score;
  }
  if (score<minValue) {
    minValue = score;
  }

  const colorArray = colorArrayString.split(',').map((color) => color.trim());

  if (colorArray.length !== arcsLengthN.length) {
    colorArray.splice(1, colorArray.length - 2);
  }

  if (arcsLengthN.length === nbOfLevels) {
    const sumArcs = arcsLengthN.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    arcsLengthN = arcsLengthN.map((value) => ({ limit: ((value / sumArcs) * (maxValue - minValue)+minValue) }));
    for (let i = 1; i < arcsLengthN.length; i++) {
      arcsLengthN[i].limit += arcsLengthN[i - 1].limit;
    }
  }

  if (arcsLengthN.length !== nbOfLevels) {
    const totalRange = maxValue - minValue;
    const subArcRange = totalRange / nbOfLevels;
  
    arcsLengthN = Array.from({ length: nbOfLevels }, (_, index) => ({
      limit: minValue + subArcRange * (index + 1),
    }));
  }
  
  
  while (arcsLengthN.length < nbOfLevels) {
    arcsLengthN.push(1);
  }
  while (arcsLengthN.length > nbOfLevels) {
    arcsLengthN.pop();
  }

  const subArcs: SubArc[] = arcsLengthN.map((arc, index) => ({
    limit: arc.limit,
    color: colorArray[index % colorArray.length],
  }));

  const markers: nrMarkers[] = [];
  const step = maxValue / (nrMarkers - 1);

  for (let i = 0; i < nrMarkers; i++) {
    markers.push({ value: step * i });
  }

  if (colorTranslater(valueLabelColor) === null) {
    matchColorWithArc = true;
  } else {
    matchColorWithArc = false;
  }
  let adjustedMarginSides = (marginSides/100 * 0.49)-0.14;

  return (
    <div style={{ position: 'relative', top: '40%', transform: 'translateY(-50%)' }}>
      {typeof score == 'number' ? (
        <GaugeComponent
          id={chartId}
          type={graphStyle}
          value={score}
          minValue={minValue}
          maxValue={maxValue}
          marginInPercent={{ top: 0.12, bottom: 0, left: adjustedMarginSides, right: adjustedMarginSides }}
          arc={{
            padding: arcPadding,
            cornerRadius: 7,
            width: 0.25,
            colorArray: colorArray,
            subArcs: subArcs,
          }}
          pointer={{
            animationDuration: animationDuration,
            animationDelay: animationDelay,
            color: arrowColor,
            length: 0.80,
            width: 15,
            type: pointerType,
          }}
          labels={{
            valueLabel: {
              matchColorWithArc: matchColorWithArc,
              maxDecimalDigits: 2,
              style: {textShadow: "none", fill: colorTranslater(valueLabelColor)},
            },
            markLabel: {
              type: markerPosition,
              marks: markers,
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

