import React from 'react';
import ColorPicker from 'material-ui-color-picker';

const NeoColorPicker = ({ label, style, value, onChange, key, defaultValue, placeholder = '' }) => {
  return (
    <ColorPicker
      floatingLabelText={label}
      name={label}
      style={style}
      key={key}
      placeholder={placeholder}
      defaultValue={defaultValue}
      internalValue={value}
      InputProps={{
        value: value ? value : '',
        placeholder: defaultValue,
        color: value ? value : 'black',
      }}
      InputLabelProps={{
        shrink: true,
      }}
      value={value}
      onChange={onChange}
    />
  );
};

export default NeoColorPicker;
