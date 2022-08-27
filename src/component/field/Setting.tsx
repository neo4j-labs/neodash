import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { SELECTION_TYPES } from '../../config/ReportConfig';
import NeoField from './Field';
import { categoricalColorSchemes } from '../../config/ColorConfig';
import NeoColorPicker from './ColorPicker';

const generateListItem = (label, option) => {
    if ('boolean' === typeof option) {
        return (option ? 'on' : 'off')
    } else {
        if (label == "Color Scheme" || label == "Node Color Scheme") {
                const colorsFull = categoricalColorSchemes[option];
                const colors = Array.isArray(colorsFull) ? (Array.isArray(colorsFull.slice(-1)[0]) ? colorsFull.slice(-1)[0] : colorsFull) : colorsFull;
            return (<div>
                {Array.isArray(colors) ? colors.map(element => {
                    return <span key={element} style={{ display: "inline-block", background: element, width: "18px", height: "18px" }}></span>
                }) : ""+option
            }</div>)

        } else {
            return "" + option
        }

    }
}

/**
 * A setting is a generic React component that is rendered dynamically based on the 'type'.
 */
const NeoSetting = ({ name, value, choices, type, label, defaultValue, disabled = undefined,
    helperText = undefined, inverted = false, onChange, onClick=(val)=>{},
    style = { width: "100%", marginBottom: "10px", marginRight: "10px", marginLeft: "10px" } }) => {
    switch (type) {
        case SELECTION_TYPES.NUMBER:
            return <div key={label} style={{ width: "100%", paddingRight: "28px" }}>
                <NeoField
                    label={label} numeric={true}
                    key={label}
                    value={value}
                    disabled={disabled}
                    helperText={helperText}
                    defaultValue={""}
                    placeholder={"" + defaultValue}
                    style={style}
                    onClick={(val) => onClick(val)}
                    onChange={(val) => onChange(val)} />
            </div>;
        case SELECTION_TYPES.TEXT:
            return <div key={label} style={{ width: "100%", paddingRight: "28px" }}>
                <NeoField
                    label={label}
                    key={label}
                    disabled={disabled}
                    helperText={helperText}
                    value={value}
                    defaultValue={""}
                    placeholder={"" + defaultValue}
                    style={style}
                    onClick={(val) => onClick(val)}
                    onChange={(val) => onChange(val)} />
            </div>;
        case SELECTION_TYPES.DICTIONARY:
            return <div key={label} style={{ width: "100%", paddingRight: "28px" }}>
                <NeoField
                    label={label}
                    key={label}
                    disabled={disabled}
                    helperText={helperText}
                    value={JSON.stringify(value)}
                    defaultValue={""}
                    placeholder={defaultValue ? "" + JSON.stringify(defaultValue) : "{}"}
                    style={style}
                    onClick={(val) => onClick(val)}
                    onChange={(val) => onChange(val)} />
            </div>;
        case SELECTION_TYPES.LIST:
            return <div key={label} style={{ width: "100%", paddingRight: "28px" }}>
                <NeoField
                    select
                    label={label}
                    disabled={disabled}
                    helperText={helperText}
                    key={label}
                    value={value}
                    defaultValue={defaultValue}
                    style={style}
                    choices={choices.map((option) => (
                        <MenuItem key={option} value={option}>
                            {generateListItem(label, option)}
                        </MenuItem>
                    ))}
                    onClick={(val) => onClick(val)}
                    onChange={(val) => onChange(val)} />
            </div>
        case SELECTION_TYPES.COLOR:
            return <div key={label} style={{ width: "100%", paddingRight: "28px" }}>
                <NeoColorPicker
                    label={label}
                    key={label}
                    defaultValue={defaultValue}
                    value={value}
                    onClick={(val) => onClick(val)}
                    onChange={(val) => onChange(val)} 
                    style={style}></NeoColorPicker>
            </div>
    }
    return <div key={label}></div>;

};

export default NeoSetting;