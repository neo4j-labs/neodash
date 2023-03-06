import ReportIcon from '@material-ui/icons/Report';
import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { connect } from 'react-redux';
import { setExtensionOpened } from '../ExtensionsActions';
import { getExtensionOpened } from '../ExtensionsSelectors';

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
        <ListItemText primary='Extensions' />
      </ListItem>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isOpen: getExtensionOpened(state, 'alerts'),
});

const mapDispatchToProps = (dispatch) => ({
  setAlertDrawerOpened: (opened) => dispatch(setExtensionOpened('alerts', opened)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoAlertModal);
