import React, { useContext } from 'react';
import { DialogContentText, Divider, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import NeoSetting from '../component/field/Setting';
import { loadDashboardListFromNeo4jThunk, loadDatabaseListFromNeo4jThunk } from '../dashboard/DashboardThunks';
import { applicationGetConnection } from '../application/ApplicationSelectors';
import { SELECTION_TYPES } from '../config/CardConfig';
import { SideNavigationItem, Button, Dialog, Dropdown } from '@neo4j-ndl/react';
import {
  ShareIconOutline,
  PlayIconSolid,
  DocumentCheckIconOutline,
  DatabaseAddCircleIcon,
} from '@neo4j-ndl/react/icons';

const shareBaseURL = 'http://neodash.graphapp.io';
const shareLocalURL = window.location.origin.startsWith('file') ? shareBaseURL : window.location.origin;
const styles = {};

export const NeoShareModal = ({ connection, loadDashboardListFromNeo4j, loadDatabaseListFromNeo4j, navItemClass }) => {
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const [loadFromNeo4jModalOpen, setLoadFromNeo4jModalOpen] = React.useState(false);
  const [loadFromFileModalOpen, setLoadFromFileModalOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const { driver } = useContext<Neo4jContextState>(Neo4jContext);

  // One of [null, database, file]
  const [shareType, setShareType] = React.useState('database');
  const [shareID, setShareID] = React.useState(null);
  const [shareName, setShareName] = React.useState(null);
  const [shareFileURL, setShareFileURL] = React.useState('');
  const [shareConnectionDetails, setShareConnectionDetails] = React.useState('No');
  const [shareStandalone, setShareStandalone] = React.useState('No');
  const [selfHosted, setSelfHosted] = React.useState('No');

  const [shareLink, setShareLink] = React.useState(null);

  const [dashboardDatabase, setDashboardDatabase] = React.useState('neo4j');
  const [databases, setDatabases] = React.useState(['neo4j']);

  const handleClickOpen = () => {
    setShareID(null);
    setShareLink(null);
    setShareModalOpen(true);
    loadDatabaseListFromNeo4j(driver, (result) => {
      setDatabases(result);
    });
  };

  const handleClose = () => {
    setShareModalOpen(false);
  };

  const columns = [
    { field: 'id', hide: true, headerName: 'ID', width: 150 },
    { field: 'date', headerName: 'Date', width: 200 },
    { field: 'title', headerName: 'Title', width: 270 },
    { field: 'author', headerName: 'Author', width: 160 },
    {
      field: 'load',
      headerName: ' ',
      renderCell: (c) => {
        return (
          <Button
            onClick={() => {
              setShareID(c.id);
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
            <PlayIconSolid className='n-w-6 n-h-6' />
          </Button>
        );
      },
      width: 130,
    },
  ];

  return (
    <div>
      <SideNavigationItem onClick={handleClickOpen} icon={<ShareIconOutline className={navItemClass} />}>
        Share
      </SideNavigationItem>

      <Dialog
        key={1}
        size='large'
        open={shareModalOpen == true}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <Dialog.Header id='form-dialog-title'>
          <ShareIconOutline
            className='n-w-6 n-h-6'
            style={{ display: 'inline', marginRight: '5px', marginBottom: '5px' }}
          />
          Share Dashboard
        </Dialog.Header>
        <Dialog.Content>
          This window lets you create a temporary share link for your dashboard. Keep in mind that share links are not
          intended as a way to publish your dashboard for users, see the&nbsp;
          <a href='https://neo4j.com/labs/neodash/2.2/user-guide/publishing/'>documentation</a> for more on publishing.
          <br />
          <hr />
          <br />
          Step 1: Select a dashboard to share.
          <br />
          <br />
          <div style={{ marginBottom: '10px' }}>
            <Button
              onClick={() => {
                loadDashboardListFromNeo4j(driver, dashboardDatabase, (result) => {
                  setShareLink(null);
                  setRows(result);
                });
                setLoadFromNeo4jModalOpen(true);
              }}
              fill='outlined'
              color='neutral'
              floating
            >
              Share from Neo4j
              <DatabaseAddCircleIcon className='n-w-6 n-h-6' />
            </Button>
            <Button
              onClick={() => {
                setLoadFromFileModalOpen(true);
              }}
              fill='outlined'
              color='neutral'
              style={{ marginLeft: '10px' }}
              floating
            >
              Share a file
              <DocumentCheckIconOutline className='n-w-6 n-h-6' />
            </Button>
          </div>
          <b>{shareID ? `Selected dashboard: ${  shareName}` : ''}</b>
          <hr />
          {shareID ? (
            <>
              {' '}
              (
              <br />
              Step 2: Configure sharing settings.
              <br />
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
                  if ((e == 'No') & (shareStandalone == 'Yes')) {
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
                <ShareIconOutline className='n-w-6 n-h-6' />
              </Button>
              <hr />
            </>
          ) : (
            <></>
          )}
          {shareLink ? (
            <>
              <br />
              Step 3: Use the generated link to view the dashboard:
              <br />
              <a href={shareLink} target='_blank'>
                {shareLink}
              </a>
              <br />
            </>
          ) : (
            <></>
          )}
        </Dialog.Content>
      </Dialog>
      <Dialog
        size='large'
        open={loadFromNeo4jModalOpen == true}
        onClose={() => {
          setLoadFromNeo4jModalOpen(false);
        }}
        aria-labelledby='form-dialog-title'
      >
        <Dialog.Header id='form-dialog-title'>Select From Neo4j</Dialog.Header>
        <Dialog.Content style={{ width: '800px' }}>
          Choose a dashboard to share below.
          <div style={{ height: '380px' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              disableSelectionOnClick
              components={{
                ColumnSortedDescendingIcon: () => <></>,
                ColumnSortedAscendingIcon: () => <></>,
              }}
            />
          </div>
          <Dropdown
            id='database'
            label='Database'
            type='select'
            selectProps={{
              onChange: (newValue) => {
                setRows([]);
                setDashboardDatabase(newValue.value);
                loadDashboardListFromNeo4j(driver, newValue.value, (result) => {
                  setRows(result);
                });
              },
              options: databases.map((database) => ({ label: database, value: database })),
              value: { label: dashboardDatabase, value: dashboardDatabase },
            }}
            style={{ width: '150px' }}
          ></Dropdown>
        </Dialog.Content>
      </Dialog>
      <Dialog
        size='large'
        open={loadFromFileModalOpen == true}
        onClose={() => {
          setLoadFromFileModalOpen(false);
        }}
        aria-labelledby='form-dialog-title'
      >
        <Dialog.Header id='form-dialog-title'>Select from URL</Dialog.Header>
        <Dialog.Content>
          To share a dashboard file directly, make it accessible{' '}
          <a target='_blank' href='https://gist.github.com/'>
            online
          </a>
          . Then, paste the direct link here:
          <NeoSetting
            key={'url'}
            name={'url'}
            value={shareFileURL}
            style={{ marginLeft: '0px', width: '100%', marginBottom: '10px' }}
            type={SELECTION_TYPES.TEXT}
            helperText={'Make sure the URL starts with http:// or https://.'}
            label={''}
            defaultValue='https://gist.githubusercontent.com/username/0a78d80567f23072f06e03005cf53bce/raw/f97cc...'
            onChange={(e) => {
              setShareFileURL(e);
            }}
          />
          <div style={{ marginBottom: '10px' }}>
            <Button
              onClick={() => {
                setShareID(shareFileURL);
                setShareName(`${shareFileURL.substring(0, 100)}...`);
                setShareType('file');
                setShareLink(null);
                setShareFileURL('');
                setLoadFromFileModalOpen(false);
              }}
              style={{ marginBottom: '10px' }}
              color='success'
            >
              Confirm URL
              <PlayIconSolid className='n-w-6 n-h-6' />
            </Button>
          </div>
        </Dialog.Content>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  connection: applicationGetConnection(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadDashboardListFromNeo4j: (driver, database, callback) =>
    dispatch(loadDashboardListFromNeo4jThunk(driver, database, callback)),
  loadDatabaseListFromNeo4j: (driver, callback) => dispatch(loadDatabaseListFromNeo4jThunk(driver, callback)),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NeoShareModal));
