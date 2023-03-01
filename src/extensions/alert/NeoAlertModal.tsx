import ReportIcon from '@material-ui/icons/Report';
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Badge from '@material-ui/core/Badge';
import { Checkbox, Chip, FormControlLabel, ListItem, ListItemIcon, ListItemText, Tooltip } from '@material-ui/core';
import { EXTENSIONS } from '../ExtensionConfig';
import { connect } from 'react-redux';
import { createNotificationThunk } from '../../page/PageThunks';
import { getPageNumber } from '../../settings/SettingsSelectors';
import { getDashboardExtensions } from '../../dashboard/DashboardSelectors';
import { setExtensionOpened } from '../../dashboard/DashboardActions';

const NeoAlertModal = ({ _extensions, setAlertDrawerOpened }) => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
    setAlertDrawerOpened(!open);
  };

  return (
    <div>
      <ListItem button onClick={handleClick} id='extensions-sidebar-button'>
        <ListItemIcon>
          <ReportIcon />
        </ListItemIcon>
        <ListItemText primary='Extensions' />
      </ListItem>
    </div>
  );
};

const mapStateToProps = (state) => ({
  extensions: getDashboardExtensions(state),
});

const mapDispatchToProps = (dispatch) => ({
  setAlertDrawerOpened: (opened) => dispatch(setExtensionOpened('alerts', opened)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoAlertModal);
