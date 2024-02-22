import React from 'react';
import { connect } from 'react-redux';
import { IconButton, MenuItem } from '@neo4j-ndl/react';
import { UserCircleIconOutline } from '@neo4j-ndl/react/icons';
import { RBACManagementMenu } from './RBACManagementMenu';

import Tooltip from '@mui/material/Tooltip/Tooltip';
import { createNotificationThunk } from '../../page/PageThunks';

const RBACManagementLabelButton = ({ createNotification }) => {
  const [MenuOpen, setMenuOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleButtonClick = (event) => {
    setMenuOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setMenuOpen(false);
  };

  const button = (
    <Tooltip title='Access Control' aria-label='Access Control' disableInteractive>
      <IconButton className='n-mx-1' aria-label='Access Control' onClick={handleButtonClick}>
        <UserCircleIconOutline />
      </IconButton>
    </Tooltip>
  );

  return (
    <div style={{ display: 'inline' }}>
      {button}
      <RBACManagementMenu
        anchorEl={anchorEl}
        MenuOpen={MenuOpen}
        handleClose={handleClose}
        createNotification={createNotification}
      />
    </div>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  createNotification: (title: any, message: any) => {
    dispatch(createNotificationThunk(title, message));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(RBACManagementLabelButton);
