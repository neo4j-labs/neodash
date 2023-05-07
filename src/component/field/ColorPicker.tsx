import React from 'react';
import { ColorPicker } from 'mui-color';

const NeoColorPicker = ({ value, onChange, defaultValue, label }) => {
  return (
    <ColorPicker
      key={label}
      defaultValue={defaultValue}
      value={value}
      onChange={(e) => onChange(e.css.backgroundColor)}
    />
  );
};

export default NeoColorPicker;
