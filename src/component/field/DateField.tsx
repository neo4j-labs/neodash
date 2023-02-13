import React from 'react';
import TextField from '@material-ui/core/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, DesktopDatePicker } from '@mui/x-date-pickers';

const NeoDatePicker = ({ label, value, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        label={label}
        inputFormat='YYYY-MM-DD'
        value={value}
        onError={(error) => {
          console.log(error);
        }}
        onChange={(event) => {
          onChange(event);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            onKeyDown={() => {
              return false;
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default NeoDatePicker;
