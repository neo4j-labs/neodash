import React from 'react';
import { ChartProps } from '../Chart';
import { replaceDashboardParameters } from '../ChartUtils';

/**
 * Renders an iFrame of the URL provided by the user.
 */
const NeoIFrameChart = (props: ChartProps) => {
  // Records are overridden to be a single element array with a field called 'input'.
  const { records } = props;
  const parameters = props.parameters ? props.parameters : {};
  const passGlobalParameters =
    props.settings && props.settings.passGlobalParameters ? props.settings.passGlobalParameters : false;
  const replaceGlobalParameters =
    props.settings && props.settings.replaceGlobalParameters !== undefined
      ? props.settings.replaceGlobalParameters
      : true;
  const url = records[0].input.trim();
  const mapParameters = records[0].parameters || {};
  const queryString = Object.keys(mapParameters)
    .map((key) => `${key}=${mapParameters[key]}`)
    .join('&');
  const modifiedUrl =
    (replaceGlobalParameters ? replaceDashboardParameters(url, parameters) : url) +
    (passGlobalParameters ? `#${queryString}` : '');

  if (!modifiedUrl || !(modifiedUrl.startsWith('http://') || modifiedUrl.startsWith('https://'))) {
    return (
      <p style={{ margin: '15px' }}>
        Invalid iFrame URL. Make sure your url starts with <code>http://</code> or <code>https://</code>.
      </p>
    );
  }

  return (
    <iframe
      style={{ width: '100%', border: 'none', marginBottom: '-5px', height: '100%', overflow: 'hidden' }}
      src={modifiedUrl}
    />
  );
};

export default NeoIFrameChart;
