import ExtensionIcon from '@material-ui/icons/Extension';

import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Badge from '@material-ui/core/Badge';
import { Checkbox, Chip, FormControlLabel, ListItem, ListItemIcon, ListItemText, Tooltip } from '@material-ui/core';
import { EXTENSIONS } from './ExtensionConfig';
import { connect } from 'react-redux';
import { createNotificationThunk } from '../page/PageThunks';
import { getPageNumber } from '../settings/SettingsSelectors';
import { getDashboardExtensions } from '../dashboard/DashboardSelectors';
import { setExtensionEnabled } from '../dashboard/DashboardActions';

const NeoExtensionsModal = ({
  extensions,
  setExtensionEnabled,
  onExtensionUnavailableTriggered, // Action to take when the user tries to enable a disabled extension.
}) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <ListItem button onClick={handleClickOpen} id='extensions-sidebar-button'>
        <ListItemIcon>
          <ExtensionIcon />
        </ListItemIcon>
        <ListItemText primary='Extensions' />
      </ListItem>

      {open ? (
        <Dialog maxWidth={'md'} open={open == true} onClose={handleClose} aria-labelledby='form-dialog-title'>
          <DialogTitle id='form-dialog-title'>
            <ExtensionIcon
              style={{
                height: '30px',
                paddingTop: '4px',
                marginBottom: '-8px',
                marginRight: '5px',
                paddingBottom: '5px',
              }}
            />
            Extensions
            <IconButton onClick={handleClose} style={{ padding: '3px', float: 'right' }}>
              <Badge badgeContent={''}>
                <CloseIcon id={'extensions-modal-close-button'} />
              </Badge>
            </IconButton>
          </DialogTitle>
          <div>
            <DialogContent>
              <a target='_blank' href='https://neo4j.com/labs/neodash/2.2/user-guide/extensions/'>
                Extensions
              </a>
              are a way of extending the core functionality of NeoDash with custom logic.
              <br />
              This can be a new visualization, extra styling options for an existing visualization, or even a completely
              new logic for the dashboarding engine.
              <br /> <br />
              <hr></hr>
              {Object.values(EXTENSIONS).map((e) => {
                return (
                  <div style={{ opacity: e.enabled ? 1.0 : 0.6 }}>
                    <table>
                      <tr>
                        <td>
                          <h3>
                            {e.label}
                            &nbsp; &nbsp;
                            {e.enabled ? (
                              ''
                            ) : (
                              <Chip label='Pro Feature' color='primary' size='small' variant='outlined' />
                            )}
                          </h3>
                        </td>
                        <td style={{ width: 50 }}></td>
                        <td style={{ float: 'right' }}>
                          <Tooltip title='Enable the extension' aria-label=''>
                            <FormControlLabel
                              onClick={() => {
                                if (e.enabled) {
                                  setExtensionEnabled(e.name, extensions[e.name] == undefined ? true : undefined);
                                } else {
                                  onExtensionUnavailableTriggered(e.label);
                                }
                              }}
                              control={
                                <Checkbox
                                  id={`checkbox-${e.name}`}
                                  disabled={!e.enabled}
                                  style={{ fontSize: 'small' }}
                                  checked={extensions[e.name]}
                                  name='enable'
                                />
                              }
                              label={<span color='green'>{extensions[e.name] ? 'Active  ' : 'Disabled'}</span>}
                            />
                          </Tooltip>
                        </td>
                      </tr>
                      <tr>
                        <td valign='top'>
                          <p>{e.description}</p>
                          <p>
                            Author: <a href={e.link}>{e.author}</a>
                          </p>
                        </td>
                        <td></td>
                        <td>
                          <br />
                          <img src={e.image} style={{ width: 400, border: '1px solid grey' }}></img>
                        </td>
                      </tr>
                    </table>
                    <hr></hr>
                  </div>
                );
              })}
            </DialogContent>
          </div>
        </Dialog>
      ) : (
        <></>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  extensions: getDashboardExtensions(state),
});

const mapDispatchToProps = (dispatch) => ({
  setExtensionEnabled: (name, enabled) => dispatch(setExtensionEnabled(name, enabled)),
  onExtensionUnavailableTriggered: (name) =>
    dispatch(
      createNotificationThunk(
        `Extension '${name}' Unavailable`,
        // eslint-disable-next-line no-multi-str
        'This extension is not available in the open-source version of NeoDash.\n  \
     To learn more about professional extensions, check out the project documentation.'
      )
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoExtensionsModal);
