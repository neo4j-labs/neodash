import React from 'react';
import { connect } from 'react-redux';
import { IconButton, MenuItem } from '@neo4j-ndl/react';
import { UserCircleIconOutline } from '@neo4j-ndl/react/icons';
import { RBACManagementMenu } from './RBACManagementMenu';

import Tooltip from '@mui/material/Tooltip/Tooltip';

const RBACManagementLabelButton = () => {
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
    <Tooltip title='RBAC Label Management' aria-label='RBAC Label Management' disableInteractive>
      <IconButton className='n-mx-1' aria-label='RBAC Label Management' onClick={handleButtonClick}>
        <UserCircleIconOutline />
      </IconButton>
    </Tooltip>
  );

  return (
    <div style={{ display: 'inline' }}>
      {button}
      <RBACManagementMenu anchorEl={anchorEl} MenuOpen={MenuOpen} handleClose={handleClose} />
    </div>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (_dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(RBACManagementLabelButton);
