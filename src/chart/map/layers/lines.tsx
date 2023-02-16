import React from 'react';
import { Polyline, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export function createLines(data) {
  function createPopupFromRelProperties(value) {
    return (
      <Popup className={'leaflet-custom-rel-popup'}>
        <h3>
          <b>{value.type}</b>
        </h3>
        <table>
          <tbody>
            {Object.keys(value.properties).length == 0 ? (
              <tr>
                <td>(No properties)</td>
              </tr>
            ) : (
              Object.keys(value.properties).map((k, i) => (
                <tr key={i}>
                  <td style={{ marginRight: '10px' }} key={0}>
                    {k.toString()}:
                  </td>
                  <td key={1}>{value.properties[k].toString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Popup>
    );
  }

  // Create lines to plot on the map.
  return data.links
    .filter((link) => link)
    .map((rel, i) => {
      if (rel.start && rel.end) {
        return (
          <Polyline weight={rel.width} key={i} positions={[rel.start, rel.end]} color={rel.color}>
            {createPopupFromRelProperties(rel)}
          </Polyline>
        );
      }
    });
}
