import TextField from '@material-ui/core/TextField';
import React from 'react';

const textFieldStyle = { width: '155px', marginBottom: '10px', marginRight: '10px', marginLeft: '10px' };

const NeoField = ({
  label,
  value,
  style = textFieldStyle,
  choices = [<div key={0}></div>],
  onChange,
  onClick = () => {},
  numeric = false,
  select = false,
  disabled = undefined,
  variant = undefined,
  helperText = undefined,
  defaultValue = undefined,
  multiline = false,
  placeholder = '',
}) => {
  return (
    <TextField
      InputLabelProps={{
        shrink: true,
      }}
      select={select}
      style={style}
      key={label}
      variant={variant}
      label={label}
      helperText={helperText}
      disabled={disabled}
      value={value != null ? value : defaultValue}
      multiline={multiline}
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
    >
      {choices}
    </TextField>
  );
};

export default NeoField;
