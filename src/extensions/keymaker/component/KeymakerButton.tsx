import React from 'react';
import { connect } from 'react-redux';
import { IconButton, MenuItem } from '@neo4j-ndl/react';
import KeymakerSettingsModal from './KeymakerSettingsModal';
import { KeyIconOutline } from '@neo4j-ndl/react/icons';

<KeyIconOutline className='n-size-token-7' />;
import Tooltip from '@mui/material/Tooltip/Tooltip';

const KeymakerButton = () => {
  const [open, setOpen] = React.useState(false);
  const button = (
    <Tooltip title='InvokeKeymaker' aria-label='InvokeKeymaker' disableInteractive>
      <IconButton className='n-mx-1' aria-label='InvokeKeymaker' onClick={() => setOpen(true)}>
        <KeyIconOutline />
      </IconButton>
    </Tooltip>
  );

  const component = (
    <div style={{ display: 'inline' }}>
      {button}
      {open ? <KeymakerSettingsModal open={open} setOpen={setOpen} /> : <></>}
    </div>
  );

  return component;
};

const mapStateToProps = () => ({
  // active: getModelProvider(state),
});

const mapDispatchToProps = (_dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(KeymakerButton);
