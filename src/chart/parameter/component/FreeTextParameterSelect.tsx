import CircularProgress from '@mui/material/CircularProgress';
import React, { useCallback, useEffect } from 'react';
import NeoField from '../../../component/field/Field';

const FreeTextParameterSelectComponent = ({
  helperText,
  label,
  property,
  defaultValue,
  value,
  clearParameterOnFieldClear,
  setValue,
  currentValue,
}) => {
  return (
    <div style={{ width: '100%' }}>
      <NeoField
        key={'freetext'}
        label={helperText ? helperText : `${label} ${property}`}
        defaultValue={defaultValue}
        value={value}
        variant='outlined'
        placeholder={'Enter text here...'}
        style={{ marginLeft: '15px', width: 'calc(100% - 80px)' }}
        onChange={(newValue) => {
          // TODO: i want this to be a proper wait instead of triggering on the first character.
          if (newValue == null && clearParameterOnFieldClear) {
            setValue(defaultValue);
          } else {
            setValue(newValue);
          }
        }}
      />
      {value !== currentValue ? <CircularProgress size={26} style={{ marginTop: '20px', marginLeft: '5px' }} /> : <></>}
    </div>
  );
};

export default FreeTextParameterSelectComponent;
