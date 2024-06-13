import React from 'react';
import { connect } from 'react-redux';
import { IconButton, MenuItem } from '@neo4j-ndl/react';
import GraphQLSettingsModal from './GraphQLSettingsModal';
import { ExclamationTriangleIconSolid, LanguageIconSolid, QueryBrowserIcon } from '@neo4j-ndl/react/icons';
import Tooltip from '@mui/material/Tooltip/Tooltip';

const GraphQLButton = () => {
  const [open, setOpen] = React.useState(false);
  const button = (
    <Tooltip title='InvokeGraphQL' aria-label='InvokeGraphQL' disableInteractive>
      <IconButton className='n-mx-1' aria-label='InvokeGraphQL' onClick={() => setOpen(true)}>
        <QueryBrowserIcon />
      </IconButton>
    </Tooltip>
  );

  const component = (
    <div style={{ display: 'inline' }}>
      {button}
      {open ? <GraphQLSettingsModal open={open} setOpen={setOpen} /> : <></>}
    </div>
  );

  return component;
};

const mapStateToProps = () => ({
  // active: getModelProvider(state),
});

const mapDispatchToProps = (_dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(GraphQLButton);
