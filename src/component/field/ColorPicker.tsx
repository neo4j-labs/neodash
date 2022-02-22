import React from 'react';
import ColorPicker from 'material-ui-color-picker';



const NeoColorPicker = ({ label, style, value, onChange, key, defaultValue }) => {
    return (
        <ColorPicker
            floatingLabelText={label}
            name={label}
            style={style}
            key={key}
            defaultValue={defaultValue}
            internalValue={value}
            InputProps={{ value: value ? value : "", color: value ? value : "black" }}
            value={value}
            onChange={onChange}

        />
    );
};


export default NeoColorPicker;