import React from 'react';
import { connect } from 'react-redux';
import { IconButton, MenuItem } from '@neo4j-ndl/react';
import { ExclamationTriangleIconSolid, LanguageIconSolid, UserCircleIconOutline } from '@neo4j-ndl/react/icons';

import Tooltip from '@mui/material/Tooltip/Tooltip';

const RBACLabelButton = () => {
  const [open, setOpen] = React.useState(false);
  const button = (
    <Tooltip title='RBAC Label Management' aria-label='RBAC Label Management' disableInteractive>
      <IconButton className='n-mx-1' aria-label='RBAC Label Management' onClick={() => setOpen(true)}>
        <UserCircleIconOutline />
      </IconButton>
    </Tooltip>
  );

  const component = (
    <div style={{ display: 'inline' }}>
      {button}
      {/* {open ? <QueryTranslatorSettingsModal open={open} setOpen={setOpen} /> : <></>} */}
    </div>
  );

  return component;
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (_dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(RBACLabelButton);
