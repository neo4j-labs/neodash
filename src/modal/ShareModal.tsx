import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import PlayArrow from '@material-ui/icons/PlayArrow';
import {
  DialogContentText,
  Divider,
  FormControl,
  InputLabel,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextareaAutosize,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import PostAddIcon from '@material-ui/icons/PostAdd';
import StorageIcon from '@material-ui/icons/Storage';
import { DataGrid } from '@mui/x-data-grid';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import ShareIcon from '@material-ui/icons/Share';
import NeoSetting from '../component/field/Setting';
import { loadDashboardListFromNeo4jThunk, loadDatabaseListFromNeo4jThunk } from '../dashboard/DashboardThunks';
import { applicationGetConnection } from '../application/ApplicationSelectors';
import { SELECTION_TYPES } from '../config/CardConfig';

// const shareBaseURL = "http://localhost:3000";
const shareBaseURL = 'http://neodash.graphapp.io';
const shareLocalURL = window.location.origin.startsWith('file') ? shareBaseURL : window.location.origin;
const styles = {};

export const NeoShareModal = ({ connection, loadDashboardListFromNeo4j, loadDatabaseListFromNeo4j }) => {
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
            style={{ float: 'right', backgroundColor: 'white' }}
            variant='contained'
            size='medium'
            endIcon={<PlayArrow />}
          >
            Select
          </Button>
        );
      },
      width: 120,
    },
  ];

  return (
    <div>
      <ListItem button onClick={handleClickOpen}>
        <ListItemIcon>
          <IconButton style={{ padding: '0px' }}>
            <ShareIcon />
          </IconButton>
        </ListItemIcon>
        <ListItemText primary='Share' />
      </ListItem>

      <Dialog
        key={1}
        maxWidth={'lg'}
        open={shareModalOpen == true}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>
          <ShareIcon
            style={{
              height: '30px',
              paddingTop: '4px',
              marginBottom: '-8px',
              marginRight: '5px',
              paddingBottom: '5px',
            }}
          />
          Share Dashboard
          <IconButton onClick={handleClose} style={{ padding: '3px', float: 'right' }}>
            <Badge badgeContent={''}>
              <CloseIcon />
            </Badge>
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ width: '1000px' }}>
          <DialogContentText>
            This window lets you create a temporary share link for your dashboard. Keep in mind that share links are not
            intended as a way to publish your dashboard for users, see the
            <a href='https://neo4j.com/labs/neodash/2.2/user-guide/publishing/'>documentation</a> for more on
            publishing.
            <br />
            <hr />
            <br />
            Step 1: Select a dashboard to share.
            <br />
            <br />
            <Button
              component='label'
              onClick={() => {
                loadDashboardListFromNeo4j(driver, dashboardDatabase, (result) => {
                  setShareLink(null);
                  setRows(result);
                });
                setLoadFromNeo4jModalOpen(true);
              }}
              style={{ marginBottom: '10px', backgroundColor: 'white' }}
              color='default'
              variant='contained'
              size='medium'
              endIcon={<StorageIcon />}
            >
              Share From Neo4j
            </Button>
            <Button
              component='label'
              onClick={() => {
                setLoadFromFileModalOpen(true);
              }}
              style={{ marginBottom: '10px', marginLeft: '10px', backgroundColor: 'white' }}
              color='default'
              variant='contained'
              size='medium'
              endIcon={<PostAddIcon />}
            >
              Share a File
            </Button>
            <br />
            <b>{shareID ? `Selected dashboard: ${shareName}` : ''}</b>
          </DialogContentText>
          <Divider />
          {shareID ? (
            <>
              <DialogContentText>
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
                  helperText={
                    'Share the dashboard using self Hosted Neodash, otherwise neodash.graphapp.io will be used'
                  }
                  label={'Self Hosted Dashboard'}
                  defaultValue={'No'}
                  choices={['Yes', 'No']}
                  onChange={(e) => {
                    setShareLink(null);
                    setSelfHosted(e);
                  }}
                />
                <Button
                  component='label'
                  onClick={() => {
                    setShareLink(
                      `${
                        selfHosted == 'Yes' ? shareLocalURL : shareBaseURL
                      }/?share&type=${shareType}&id=${encodeURIComponent(
                        shareID
                      )}&dashboardDatabase=${encodeURIComponent(dashboardDatabase)}${
                        shareConnectionDetails == 'Yes'
                          ? `&credentials=${encodeURIComponent(
                              `${connection.protocol}://${connection.username}:${connection.password}@${connection.database}:${connection.url}:${connection.port}`
                            )}`
                          : ''
                      }${shareStandalone == 'Yes' ? `&standalone=${shareStandalone}` : ''}`
                    );
                  }}
                  style={{ marginBottom: '10px', backgroundColor: 'white' }}
                  color='default'
                  variant='contained'
                  size='medium'
                >
                  Generate Link
                </Button>
              </DialogContentText>
              <Divider />
            </>
          ) : (
            <></>
          )}
          {shareLink ? (
            <DialogContentText>
              <br />
              Step 3: Use the generated link to view the dashboard:
              <br />
              <a href={shareLink} target='_blank'>
                {shareLink}
              </a>
              <br />
            </DialogContentText>
          ) : (
            <></>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        key={2}
        maxWidth={'lg'}
        open={loadFromNeo4jModalOpen == true}
        onClose={() => {
          setLoadFromNeo4jModalOpen(false);
        }}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>
          Select From Neo4j
          <IconButton
            onClick={() => {
              setLoadFromNeo4jModalOpen(false);
            }}
            style={{ padding: '3px', float: 'right' }}
          >
            <Badge badgeContent={''}>
              <CloseIcon />
            </Badge>
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ width: '800px' }}>
          <DialogContentText>Choose a dashboard to share below.</DialogContentText>

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
          <FormControl style={{ marginTop: '-58px', marginLeft: '10px' }}>
            <InputLabel id='demo-simple-select-label'>Database</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              style={{ width: '150px' }}
              value={dashboardDatabase}
              onChange={(e) => {
                setRows([]);
                setDashboardDatabase(e.target.value);
                loadDashboardListFromNeo4j(driver, e.target.value, (result) => {
                  setRows(result);
                });
              }}
            >
              {databases.map((database) => {
                return <MenuItem value={database}>{database}</MenuItem>;
              })}
            </Select>
          </FormControl>
        </DialogContent>
      </Dialog>
      <Dialog
        key={3}
        maxWidth={'lg'}
        open={loadFromFileModalOpen == true}
        onClose={() => {
          setLoadFromFileModalOpen(false);
        }}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>
          Select from URL
          <IconButton
            onClick={() => {
              setLoadFromFileModalOpen(false);
            }}
            style={{ padding: '3px', float: 'right' }}
          >
            <Badge badgeContent={''}>
              <CloseIcon />
            </Badge>
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ width: '1000px' }}>
          <DialogContentText>
            To share a dashboard file directly, make it accessible
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
            <Button
              component='label'
              onClick={() => {
                setShareID(shareFileURL);
                setShareName(`${shareFileURL.substring(0, 100)}...`);
                setShareType('file');
                setShareLink(null);
                setShareFileURL('');
                setLoadFromFileModalOpen(false);
              }}
              style={{ marginBottom: '10px', backgroundColor: 'white' }}
              color='default'
              variant='contained'
              size='medium'
            >
              Confirm URL
            </Button>
          </DialogContentText>
        </DialogContent>
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
