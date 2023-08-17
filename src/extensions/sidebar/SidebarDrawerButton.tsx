import React from 'react';
import { connect } from 'react-redux';
import { setExtensionSidebarOpen } from './state/SidebarActions';
import { getSidebarOpened } from './state/SidebarSelectors';
import { MenuItem } from '@neo4j-ndl/react';
import { ExternalLinkIcon } from '@neo4j-ndl/react/icons';

// TODO - rename to 'Node Sidebar Extension button' to reflect better the functionality.
const NeoNodeSidebarButton = ({ isOpen, setNodeSidebarOpened }) => {
  const handleClick = () => {
    setNodeSidebarOpened(!isOpen);
  };

  return (
    <MenuItem
      title='Alerts'
      onClick={() => handleClick()}
      icon={
        <>
          <ExternalLinkIcon />
        </>
      }
    />
  );
};

const mapStateToProps = (state) => ({
  isOpen: getSidebarOpened(state),
});

const mapDispatchToProps = (dispatch) => ({
  setNodeSidebarOpened: (open) => dispatch(setExtensionSidebarOpen(open)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoNodeSidebarButton);
