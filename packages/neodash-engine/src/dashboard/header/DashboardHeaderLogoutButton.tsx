import React from 'react';
import { connect } from 'react-redux';
import { IconButton } from '@neo4j-ndl/react';
import { Tooltip } from '@mui/material';

import { DASHBOARD_HEADER_BUTTON_COLOR } from '../../config/ApplicationConfig';
import { ArrowRightOnRectangleIconOutline } from '@neo4j-ndl/react/icons';

export const NeoLogoutButton = ({ standalone, onConnectionModalOpen }) => {
  return (
    <Tooltip title={'Log out'} disableInteractive>
      <IconButton
        className='logo-btn n-p-1'
        aria-label={'connection '}
        style={DASHBOARD_HEADER_BUTTON_COLOR ? { color: DASHBOARD_HEADER_BUTTON_COLOR } : {}}
        onClick={() => {
          if (!standalone) {
            onConnectionModalOpen();
          }
        }}
        size='large'
        clean
      >
        <ArrowRightOnRectangleIconOutline className='header-icon' type='outline' />
      </IconButton>
    </Tooltip>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NeoLogoutButton);
