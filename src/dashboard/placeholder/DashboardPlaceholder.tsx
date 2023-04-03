import { AppBar, Toolbar, InputBase } from '@material-ui/core';
import React from 'react';
import { LoadingSpinner } from '@neo4j-ndl/react';

export const NeoDashboardPlaceholder = ({ connected }) => {
  const content = (
    <div style={{ zIndex: -99 }}>
      <AppBar
        position='absolute'
        style={{
          zIndex: 'auto',
          boxShadow: 'none',
          transition: 'width 125ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
        }}
      >
        <Toolbar style={{ paddingRight: 24, minHeight: '64px', zIndex: 1201 }} className='n-bg-primary-70'>
          <InputBase
            disabled
            id='center-aligned'
            label='placeholder'
            style={{ textAlign: 'center', fontSize: '22px', flexGrow: 1, color: 'white' }}
            placeholder='Dashboard Name...'
            fullWidth
            maxRows={4}
            value={'NeoDash ⚡'}
          />
        </Toolbar>
        <Toolbar
          style={{ zIndex: 10, minHeight: '50px', paddingLeft: '0px', paddingRight: '0px', background: 'white' }}
        >
          <div
            style={{
              width: '100%',
              zIndex: -112,
              height: '48px',
              overflowX: 'hidden',
              overflowY: 'auto',
              background: 'rgba(240,240,240)',
              boxShadow: '2px 1px 10px 0px rgb(0 0 0 / 12%)',
              borderBottom: '1px solid lightgrey',
            }}
          ></div>
        </Toolbar>
      </AppBar>
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      >
        {!connected ? <LoadingSpinner size='large' className='centered' /> : <></>}
      </div>
    </div>
  );
  return content;
};

export default NeoDashboardPlaceholder;
