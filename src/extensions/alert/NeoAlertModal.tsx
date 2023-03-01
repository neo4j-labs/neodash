import ReportIcon from '@material-ui/icons/Report';
import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { connect } from 'react-redux';
import { setExtensionOpened } from '../../dashboard/DashboardActions';

const NeoAlertModal = ({ setAlertDrawerOpened }) => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
    setAlertDrawerOpened(!open);
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

const mapStateToProps = (_state) => ({});

const mapDispatchToProps = (dispatch) => ({
  setAlertDrawerOpened: (opened) => dispatch(setExtensionOpened('alerts', opened)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoAlertModal);
