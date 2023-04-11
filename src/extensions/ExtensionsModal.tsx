import React from 'react';
import { Tooltip } from '@material-ui/core';
import { EXTENSIONS } from './ExtensionConfig';
import { connect } from 'react-redux';
import { createNotificationThunk } from '../page/PageThunks';
import { getDashboardExtensions } from '../dashboard/DashboardSelectors';
import { setExtensionEnabled } from '../dashboard/DashboardActions';
import { Dialog, Label, SideNavigationItem, TextLink, Typography, Checkbox } from '@neo4j-ndl/react';
import { PuzzlePieceIconSolid } from '@neo4j-ndl/react/icons';
import { Section, SectionTitle, SectionContent } from '../modal/ModalUtils';

const NeoExtensionsModal = ({
  extensions,
  setExtensionEnabled,
  onExtensionUnavailableTriggered,
  navItemClass, // Action to take when the user tries to enable a disabled extension.
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
      <Tooltip title='Extensions' aria-label='extensions'>
        <SideNavigationItem
          id='extensions-sidebar-button'
          onClick={handleClickOpen}
          icon={<PuzzlePieceIconSolid className={navItemClass} />}
        >
          Extensions
        </SideNavigationItem>
      </Tooltip>

      {open ? (
        <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
          <Dialog.Header id='form-dialog-title'>
            <PuzzlePieceIconSolid className='icon-base icon-inline text-r' />
            Extensions
          </Dialog.Header>
          <Dialog.Content>
            <div className='n-flex n-flex-col n-gap-token-4 n-divide-y n-divide-light-neutral-border-strong'>
              <Section>
                <SectionTitle>
                  <TextLink
                    externalLink
                    target='_blank'
                    href='https://neo4j.com/labs/neodash/2.2/user-guide/extensions/'
                  >
                    Extensions
                  </TextLink>
                  &nbsp;are a way of extending the core functionality of NeoDash with custom logic.
                </SectionTitle>
                <SectionContent>
                  This can be a new visualization, extra styling options for an existing visualization, or even a
                  completely new logic for the dashboarding engine.
                </SectionContent>
              </Section>

              {Object.values(EXTENSIONS).map((e, key) => {
                return (
                  <Section key={key}>
                    <SectionContent>
                      <div style={{ opacity: e.enabled ? 1.0 : 0.6 }}>
                        <table>
                          <tr>
                            <td>
                              <div className='n-flex n-flex-row n-gap-token-4 n-items-center'>
                                <Typography variant='h4'>{e.label}</Typography>
                                {e.enabled && (
                                  <Label color='info' fill='outlined'>
                                    Pro Feature
                                  </Label>
                                )}
                              </div>
                            </td>
                            <td style={{ width: 50 }}></td>
                            <td style={{ float: 'right' }}>
                              <Tooltip title='Enable the extension' aria-label=''>
                                <Checkbox
                                  id={`checkbox-${e.name}`}
                                  label='Active'
                                  disabled={!e.enabled}
                                  style={{ fontSize: 'small' }}
                                  checked={extensions[e.name]}
                                  name='enable'
                                  onClick={() => {
                                    if (e.enabled) {
                                      setExtensionEnabled(e.name, extensions[e.name] == undefined ? true : undefined);
                                    } else {
                                      onExtensionUnavailableTriggered(e.label);
                                    }
                                  }}
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
                      </div>
                    </SectionContent>
                  </Section>
                );
              })}
            </div>
          </Dialog.Content>
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
