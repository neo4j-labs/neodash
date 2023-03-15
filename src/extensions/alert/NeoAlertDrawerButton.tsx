import ReportIcon from '@material-ui/icons/Report';
import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { connect } from 'react-redux';
import { setExtensionOpen } from '../ExtensionsActions';
import { getExtensionOpened } from '../ExtensionsSelectors';

// TODO - rename to 'Node Sidebar Extension button' to reflect better the functionality.
const NeoAlertModal = ({ isOpen, setAlertDrawerOpened }) => {
  const handleClick = () => {
    setAlertDrawerOpened(!isOpen);
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
  isOpen: getExtensionOpened(state, 'alerts'),
});

const mapDispatchToProps = (dispatch) => ({
  setAlertDrawerOpened: (open) => dispatch(setExtensionOpen('alerts', open)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoAlertModal);
