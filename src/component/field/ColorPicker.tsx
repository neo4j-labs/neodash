import React from 'react';
import { ColorPicker } from 'mui-color';

const NeoColorPicker = ({ value, onChange, key, defaultValue }) => {
  return (
    <ColorPicker
      key={key}
      defaultValue={defaultValue}
      value={value}
      onChange={(e) => onChange(e.css.backgroundColor)}
    />
  );
};

export default NeoColorPicker;
