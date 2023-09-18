import React from 'react';
import NeoField from './Field';
import { categoricalColorSchemes } from '../../config/ColorConfig';
import NeoColorPicker from './ColorPicker';
import { SELECTION_TYPES } from '../../config/CardConfig';
import { Label } from '@neo4j-ndl/react';

const generateListItem = (label, option) => {
  if (typeof option === 'boolean') {
    return { label: option ? 'on' : 'off', value: Boolean(option) };
  }
  if (label == 'Color Scheme' || label == 'Node Color Scheme') {
    const colorsFull = categoricalColorSchemes[option];
    const colors = Array.isArray(colorsFull)
      ? Array.isArray(colorsFull.slice(-1)[0])
        ? colorsFull.slice(-1)[0]
        : colorsFull
      : colorsFull;
    return {
      label: Array.isArray(colors) ? (
        <>
          {colors.map((element) => {
            return (
              <span
                key={element}
                style={{
                  display: 'inline-block',
                  background: element,
                  width: '18px',
                  height: '18px',
                  position: 'relative',
                  top: '3px',
                }}
              ></span>
            );
          })}
          <Label color='info' fill='outlined' className='n-inline-block n-ml-2'>
            {option}
          </Label>
        </>
      ) : (
        `${option}`
      ),
      value: option,
    };
  }
  return { label: option, value: option };
};

const generateValueLabel = (option) => {
  if (typeof option === 'boolean') {
    return option ? 'on' : 'off';
  }
  return option;
};

const generateValue = (option) => {
  if (typeof option === 'boolean') {
    return Boolean(option);
  }
  return option;
};

/**
 * A setting is a generic React component that is rendered dynamically based on the 'type'.
 */
const NeoSetting = ({
  value,
  choices,
  type,
  label,
  defaultValue,
  disabled = undefined,
  helperText = undefined,
  onChange,
  onClick = () => {},
  style = { width: '100%', marginBottom: '10px', marginRight: '10px', marginLeft: '10px' },
}) => {
  switch (type) {
    case SELECTION_TYPES.NUMBER:
      return (
        <div key={label} style={{ width: '100%', paddingRight: '28px' }}>
          <NeoField
            label={label}
            numeric={true}
            key={label}
            value={value}
            disabled={disabled}
            helperText={helperText}
            defaultValue={''}
            placeholder={`${defaultValue}`}
            style={style}
            onClick={(val) => onClick(val)}
            onChange={(val) => onChange(val)}
          />
        </div>
      );
    case SELECTION_TYPES.TEXT:
      return (
        <div key={label} style={{ width: '100%', paddingRight: '28px' }}>
          <NeoField
            label={label}
            key={label}
            disabled={disabled}
            helperText={helperText}
            value={value}
            defaultValue={''}
            placeholder={`${defaultValue}`}
            style={style}
            onClick={(val) => onClick(val)}
            onChange={(val) => onChange(val)}
          />
        </div>
      );
    case SELECTION_TYPES.MULTILINE_TEXT:
      return (
        <div key={label} style={{ width: '100%', paddingRight: '28px' }}>
          <NeoField
            label={label}
            key={label}
            disabled={disabled}
            helperText={helperText}
            value={value}
            defaultValue={''}
            placeholder={`${defaultValue}`}
            multiline={true}
            style={style}
            onClick={(val) => onClick(val)}
            onChange={(val) => onChange(val)}
          />
        </div>
      );
    case SELECTION_TYPES.DICTIONARY:
      return (
        <div key={label} style={{ width: '100%', paddingRight: '28px' }}>
          <NeoField
            label={label}
            key={label}
            disabled={disabled}
            helperText={helperText}
            value={JSON.stringify(value)}
            defaultValue={''}
            placeholder={defaultValue ? `${JSON.stringify(defaultValue)}` : '{}'}
            style={style}
            onClick={(val) => onClick(val)}
            onChange={(val) => onChange(val)}
          />
        </div>
      );
    case SELECTION_TYPES.LIST:
      return (
        <div key={label} style={{ width: '100%', paddingRight: '28px' }}>
          <NeoField
            select
            label={label}
            disabled={disabled}
            helperText={helperText}
            key={label}
            valueLabel={generateValueLabel(value)}
            value={generateValue(value)}
            defaultValueLabel={generateValueLabel(defaultValue)}
            defaultValue={generateValue(defaultValue)}
            style={style}
            choices={choices.map((option) => generateListItem(label, option))}
            onClick={(val) => onClick(val)}
            onChange={(val) => onChange(val)}
          />
        </div>
      );
    case SELECTION_TYPES.COLOR:
      return (
        <div key={label} style={{ width: '100%', paddingRight: '28px' }}>
          <NeoColorPicker
            label={label}
            key={label}
            disabled={disabled}
            defaultValue={defaultValue}
            value={value}
            onClick={(val) => onClick(val)}
            onChange={(val) => onChange(val)}
            style={style}
          ></NeoColorPicker>
        </div>
      );
    default:
      return <div key={label}></div>;
  }
};

export default NeoSetting;
