import { AppBar, Toolbar, InputBase } from '@mui/material';
import React from 'react';
import { LoadingSpinner } from '@neo4j-ndl/react';
import { DASHBOARD_HEADER_BRAND_LOGO, DASHBOARD_HEADER_COLOR } from '../../config/ApplicationConfig';

export const NeoDashboardPlaceholder = () => {
  const defaultToolbarContent = (
    <InputBase
      id='center-aligned'
      label='placeholder'
      className='white-text'
      style={{ textAlign: 'center', fontSize: '22px', flexGrow: 1 }}
      placeholder='Dashboard Name...'
      fullWidth
      maxRows={4}
      value={'NeoDash ⚡'}
    />
  );

  const brandedToolbarContent = (
    <img style={{ height: '54px', marginLeft: 'auto', marginRight: 'auto' }} src={DASHBOARD_HEADER_BRAND_LOGO} />
  );

  const content = (
    <div className='-n-z-60'>
      <AppBar
        position='absolute'
        className='n-z-auto'
        style={{
          boxShadow: 'none',
        }}
      >
        <Toolbar className='n-z-20 n-pr-6' style={{ background: DASHBOARD_HEADER_COLOR, color: 'white !important' }}>
          {/* {APPLY_CUSTOM_BRAND_LOGO ? brandedToolbarContent : defaultToolbarContent} */}
        </Toolbar>
        <Toolbar
          className='n-z-10 n-px-0 n-bg-danger-10'
          style={{ minHeight: '50px', paddingLeft: '0px', paddingRight: '0px' }}
        >
          <div
            className='-n-z-50 n-w-full'
            style={{
              height: '48px',
              background: 'rgba(240,240,240)',
              boxShadow: '2px 1px 10px 0px rgb(0 0 0 / 12%)',
            }}
          ></div>
        </Toolbar>
      </AppBar>
      <div className='n-absolute n-w-full n-h-full'>
        <LoadingSpinner size='large' className='centered' />
      </div>
    </div>
  );
  return content;
};

export default NeoDashboardPlaceholder;
