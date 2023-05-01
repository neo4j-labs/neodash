import ReportIcon from '@material-ui/icons/Report';
import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { connect } from 'react-redux';
import { setExtensionSidebarOpen } from './state/SidebarActions';
import { getSidebarOpened } from './state/SidebarSelectors';

// TODO - rename to 'Node Sidebar Extension button' to reflect better the functionality.
const NeoNodeSidebarButton = ({ isOpen, setNodeSidebarOpened }) => {
  const handleClick = () => {
    setNodeSidebarOpened(!isOpen);
  };

  return (
    <div>
      <ListItem button onClick={handleClick} id='sidebar-button'>
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
  setNodeSidebarOpened: (open) => dispatch(setExtensionSidebarOpen(open)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoNodeSidebarButton);
