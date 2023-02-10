import React from 'react';
import TextField from '@material-ui/core/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

const dateFieldStyle = { width: '155px', marginBottom: '10px', marginRight: '10px', marginLeft: '10px' };

const NeoDatePicker = ({ value, style = dateFieldStyle, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} style={style}>
      <DesktopDatePicker
        label='Date desktop'
        inputFormat='YYYY-MM-DD'
        value={value}
        onChange={(event) => {
          onChange(event);
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};

export default NeoDatePicker;
