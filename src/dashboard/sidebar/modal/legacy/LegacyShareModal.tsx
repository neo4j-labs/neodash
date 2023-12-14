import React, { useContext } from 'react';

import { connect } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import NeoSetting from '../../../../component/field/Setting';
import { applicationGetConnection } from '../../../../application/ApplicationSelectors';
import { SELECTION_TYPES } from '../../../../config/CardConfig';
import { MenuItem, Button, Dialog, Dropdown, TextLink } from '@neo4j-ndl/react';
import {
  ShareIconOutline,
  PlayIconSolid,
  DocumentCheckIconOutline,
  DatabaseAddCircleIcon,
} from '@neo4j-ndl/react/icons';

const shareBaseURL = 'http://neodash.graphapp.io';
const shareLocalURL = window.location.origin.startsWith('file') ? shareBaseURL : window.location.origin;

export const NeoShareModal = ({ open, handleClose, connection }) => {
  const [loadFromNeo4jModalOpen, setLoadFromNeo4jModalOpen] = React.useState(false);
  const [loadFromFileModalOpen, setLoadFromFileModalOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const { driver } = useContext<Neo4jContextState>(Neo4jContext);

  // One of [null, database, file]
  const shareType = 'url';
  const [shareID, setShareID] = React.useState(null);
  const [shareName, setShareName] = React.useState(null);
  const [shareConnectionDetails, setShareConnectionDetails] = React.useState('No');
  const [shareStandalone, setShareStandalone] = React.useState('No');
  const [selfHosted, setSelfHosted] = React.useState('No');
  const [shareLink, setShareLink] = React.useState(null);

  const [dashboardDatabase, setDashboardDatabase] = React.useState('neo4j');

  const columns = [
    { field: 'uuid', hide: true, headerName: 'ID', width: 150 },
    { field: 'date', headerName: 'Date', width: 200 },
    { field: 'title', headerName: 'Title', width: 370 },
    { field: 'author', headerName: 'Author', width: 160 },
    {
      field: 'load',
      headerName: ' ',
      renderCell: (c) => {
        return (
          <Button
            onClick={() => {
              setShareID(c.uuid);
              setShareName(c.row.title);
              setShareType('database');
              setLoadFromNeo4jModalOpen(false);
            }}
            style={{ float: 'right' }}
            fill='outlined'
            color='neutral'
            floating
          >
            Select
            <PlayIconSolid className='btn-icon-base-r' />
          </Button>
        );
      },
      width: 130,
    },
  ];

  return (
    <Dialog key={1} size='large' open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
      <Dialog.Header id='form-dialog-title'>
        <ShareIconOutline className='icon-base icon-inline text-r' />
        Share Dashboard File
      </Dialog.Header>
      <Dialog.Content>
        This window lets you create a temporary share link for your dashboard. Keep in mind that share links are not
        intended as a way to publish your dashboard for users, see the&nbsp;
        <TextLink externalLink href='https://neo4j.com/labs/neodash/2.4/user-guide/publishing/'>
          documentation
        </TextLink>{' '}
        for more on publishing.
        <br />
        <hr />
        <br />
        To share a dashboard file directly, make it accessible{' '}
        <TextLink externalLink target='_blank' href='https://gist.github.com/'>
          online
        </TextLink>
        .<br /> Then, paste the direct link here:
        <NeoSetting
          key={'url'}
          name={'url'}
          value={shareID}
          style={{ marginLeft: '0px', width: '100%', marginBottom: '10px' }}
          type={SELECTION_TYPES.TEXT}
          helperText={'Make sure the URL starts with http:// or https://.'}
          label={''}
          defaultValue='https://gist.githubusercontent.com/username/0a78d80567f23072f06e03005cf53bce/raw/f97cc...'
          onChange={(e) => {
            setShareLink(null);
            setShareID(e);
          }}
        />
        {shareID ? (
          <>
            <br />
            <NeoSetting
              key={'credentials'}
              name={'credentials'}
              value={shareConnectionDetails}
              type={SELECTION_TYPES.LIST}
              style={{ marginLeft: '0px', width: '100%', marginBottom: '10px' }}
              helperText={'Share the dashboard including your Neo4j credentials.'}
              label={'Include Connection Details'}
              defaultValue={'No'}
              choices={['Yes', 'No']}
              onChange={(e) => {
                if (e == 'No' && shareStandalone == 'Yes') {
                  return;
                }
                setShareLink(null);
                setShareConnectionDetails(e);
              }}
            />
            {shareLocalURL != shareBaseURL ? (
              <NeoSetting
                key={'standalone'}
                name={'standalone'}
                value={shareStandalone}
                style={{ marginLeft: '0px', width: '100%', marginBottom: '10px' }}
                type={SELECTION_TYPES.LIST}
                helperText={'Share the dashboard as a standalone webpage, without the NeoDash editor.'}
                label={'Standalone Dashboard'}
                defaultValue={'No'}
                choices={['Yes', 'No']}
                onChange={(e) => {
                  setShareLink(null);
                  setShareStandalone(e);
                  if (e == 'Yes') {
                    setShareConnectionDetails('Yes');
                  }
                }}
              />
            ) : (
              <></>
            )}
            <NeoSetting
              key={'selfHosted'}
              name={'selfHosted'}
              value={selfHosted}
              style={{ marginLeft: '0px', width: '100%', marginBottom: '10px' }}
              type={SELECTION_TYPES.LIST}
              helperText={'Share the dashboard using self Hosted Neodash, otherwise neodash.graphapp.io will be used'}
              label={'Self Hosted Dashboard'}
              defaultValue={'No'}
              choices={['Yes', 'No']}
              onChange={(e) => {
                setShareLink(null);
                setSelfHosted(e);
              }}
            />
            <Button
              onClick={() => {
                setShareLink(
                  `${
                    selfHosted == 'Yes' ? shareLocalURL : shareBaseURL
                  }/?share&type=${shareType}&id=${encodeURIComponent(shareID)}&dashboardDatabase=${encodeURIComponent(
                    dashboardDatabase
                  )}${
                    shareConnectionDetails == 'Yes'
                      ? `&credentials=${encodeURIComponent(
                          `${connection.protocol}://${connection.username}:${connection.password}@${connection.database}:${connection.url}:${connection.port}`
                        )}`
                      : ''
                  }${shareStandalone == 'Yes' ? `&standalone=${shareStandalone}` : ''}`
                );
              }}
              fill='outlined'
              color='neutral'
              floating
            >
              Generate Link
              <ShareIconOutline className='btn-icon-base-r' />
            </Button>
          </>
        ) : (
          <></>
        )}
        {shareLink ? (
          <>
            <br />
            Use the generated link to view the dashboard:
            <br />
            <TextLink externalLink href={shareLink} target='_blank'>
              {shareLink}
            </TextLink>
            <br />
          </>
        ) : (
          <></>
        )}
      </Dialog.Content>
    </Dialog>
  );
};

const mapStateToProps = (state) => ({
  connection: applicationGetConnection(state),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NeoShareModal);
