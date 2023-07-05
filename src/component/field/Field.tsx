import React from 'react';
import { Dropdown, TextInput, Textarea } from '@neo4j-ndl/react';
import _uniqueId from 'lodash/uniqueId';

const defaultClassName = 'n-mx-2 n-mb-2 n-w-40';

const NeoField = ({
  label,
  valueLabel,
  value,
  style = {},
  choices = [],
  onChange,
  onClick = () => {},
  id = undefined,
  numeric = false,
  select = false,
  fluid = false,
  disabled = undefined,
  variant = undefined,
  helperText = undefined,
  defaultValueLabel = undefined,
  defaultValue = undefined,
  multiline = false,
  placeholder = '',
  size = 'small',
  menuPortalTarget = undefined,
  className = defaultClassName,
}) => {
  return select === true ? (
    <Dropdown
      id={id}
      className={className}
      label={label}
      helpText={helperText}
      type='select'
      selectProps={{
        options: choices,
        onChange: (newValue) => onChange(newValue),
        value: value != null ? { label: valueLabel, value: value } : { label: defaultValueLabel, value: defaultValue },
        menuPlacement: 'auto',
        isDisabled: disabled,
        menuPortalTarget: menuPortalTarget,
      }}
      placeholder={placeholder}
      style={style}
      fluid={fluid}
    ></Dropdown>
  ) : multiline === true ? (
    <div style={style}>
      <Textarea
        key={label}
        variant={variant}
        label={label}
        helpText={helperText}
        disabled={disabled}
        value={value != null ? value : defaultValue}
        fluid
        onClick={(e) => {
          onClick(e.target.textContent);
        }}
        onChange={(event) => {
          if (!numeric) {
            onChange(event.target.value);
          } else if (
            event.target.value.toString().length == 0 ||
            event.target.value.endsWith('.') ||
            event.target.value.startsWith('-')
          ) {
            onChange(event.target.value);
          } else if (!isNaN(event.target.value)) {
            onChange(Number(event.target.value));
          }
        }}
        placeholder={placeholder}
        size={size}
      ></Textarea>
    </div>
  ) : (
    <div style={style}>
      <TextInput
        key={label}
        variant={variant}
        label={label}
        helpText={helperText}
        disabled={disabled}
        value={value != null ? value : defaultValue}
        fluid
        onClick={(e) => {
          onClick(e.target.textContent);
        }}
        onChange={(event) => {
          if (!numeric) {
            onChange(event.target.value);
          } else if (
            event.target.value.toString().length == 0 ||
            event.target.value.endsWith('.') ||
            event.target.value.startsWith('-')
          ) {
            onChange(event.target.value);
          } else if (!isNaN(event.target.value)) {
            onChange(Number(event.target.value));
          }
        }}
        placeholder={placeholder}
        size={size}
      ></TextInput>
    </div>
  );
};

export default NeoField;
