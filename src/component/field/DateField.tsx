import React from 'react';
import TextField from '@material-ui/core/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers';

const NeoDatePicker = ({ label, value, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        label={label}
        inputFormat='YYYY-MM-DD'
        value={value}
        onChange={(event) => {
          onChange(event);
        }}
        maxDate={new Date('9999-12-31')}
        renderInput={(params) => (
          <TextField
            variant='outlined'
            style={{ width: 'calc(100% - 30px)', marginLeft: '15px', marginTop: '5px' }}
            {...params}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default NeoDatePicker;
