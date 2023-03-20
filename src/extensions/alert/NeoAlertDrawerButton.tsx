import ReportIcon from '@material-ui/icons/Report';
import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { connect } from 'react-redux';
import { setExtensionOpen } from './stateManagement/AlertActions';
import { getSidebarOpened } from './stateManagement/AlertSelectors';

// TODO - rename to 'Node Sidebar Extension button' to reflect better the functionality.
const NeoNodeSidebarModal = ({ isOpen, setNodeSidebarOpened }) => {
  const handleClick = () => {
    setNodeSidebarOpened(!isOpen);
  };

  return (
    <div>
      <ListItem button onClick={handleClick} id='alert-sidebar-button'>
        <ListItemIcon>
          <ReportIcon />
        </ListItemIcon>
        <ListItemText primary='Alerts' />
      </ListItem>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isOpen: getSidebarOpened(state),
});

const mapDispatchToProps = (dispatch) => ({
  setNodeSidebarOpened: (open) => dispatch(setExtensionOpen(open)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoNodeSidebarModal);
