import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import PlayArrow from '@material-ui/icons/PlayArrow';
import {
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
import {
  loadDashboardFromNeo4jByUUIDThunk,
  loadDashboardListFromNeo4jThunk,
  loadDashboardThunk,
  loadDatabaseListFromNeo4jThunk,
} from '../dashboard/DashboardThunks';
import { DataGrid } from '@mui/x-data-grid';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';

/**
 * A modal to save a dashboard as a JSON text string.
 * The button to open the modal is intended to use in a drawer at the side of the page.
 */

const styles = {};

export const NeoLoadModal = ({
  loadDashboard,
  loadDatabaseListFromNeo4j,
  loadDashboardFromNeo4j,
  loadDashboardListFromNeo4j,
}) => {
  const [loadModalOpen, setLoadModalOpen] = React.useState(false);
  const [loadFromNeo4jModalOpen, setLoadFromNeo4jModalOpen] = React.useState(false);
  const [text, setText] = React.useState('');
  const [rows, setRows] = React.useState([]);
  const { driver } = useContext<Neo4jContextState>(Neo4jContext);
  const [dashboardDatabase, setDashboardDatabase] = React.useState('neo4j');
  const [databases, setDatabases] = React.useState(['neo4j']);

  const handleClickOpen = () => {
    setLoadModalOpen(true);
  };

  const handleClose = () => {
    setLoadModalOpen(false);
  };

  const handleCloseAndLoad = () => {
    setLoadModalOpen(false);
    loadDashboard(text);
    setText('');
  };

  function handleDashboardLoadedFromNeo4j(result) {
    setText(result);
    setLoadFromNeo4jModalOpen(false);
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    setText(e.target.result);
  };

  const uploadDashboard = (e) => {
    e.preventDefault();
    reader.readAsText(e.target.files[0]);
  };

  const columns = [
    { field: 'id', hide: true, headerName: 'ID', width: 150 },
    { field: 'date', headerName: 'Date', width: 200 },
    { field: 'title', headerName: 'Title', width: 270 },
    { field: 'author', headerName: 'Author', width: 160 },
    { field: 'version', headerName: 'Version', width: 95 },
    {
      field: 'load',
      headerName: 'Select',
      renderCell: (c) => {
        return (
          <Button
            onClick={() => {
              loadDashboardFromNeo4j(driver, dashboardDatabase, c.id, handleDashboardLoadedFromNeo4j);
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
            <SystemUpdateAltIcon />
          </IconButton>
        </ListItemIcon>
        <ListItemText primary='Load' />
      </ListItem>

      <Dialog maxWidth={'lg'} open={loadModalOpen == true} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <DialogTitle id='form-dialog-title'>
          <SystemUpdateAltIcon
            style={{
              height: '30px',
              paddingTop: '4px',
              marginBottom: '-8px',
              marginRight: '5px',
              paddingBottom: '5px',
            }}
          />
          Load Dashboard
          <IconButton onClick={handleClose} style={{ padding: '3px', float: 'right' }}>
            <Badge badgeContent={''}>
              <CloseIcon />
            </Badge>
          </IconButton>
        </DialogTitle>
        <DialogContent style={{ width: '1000px' }}>
          {/* <DialogContentText> Paste your dashboard file here to load it into NeoDash.</DialogContentText> */}
          <div>
            <Button
              component='label'
              onClick={() => {
                loadDashboardListFromNeo4j(driver, dashboardDatabase, (result) => {
                  setRows(result);
                });
                setLoadFromNeo4jModalOpen(true);
                loadDatabaseListFromNeo4j(driver, (result) => {
                  setDatabases(result);
                });
              }}
              style={{ marginBottom: '10px', backgroundColor: 'white' }}
              color='default'
              variant='contained'
              size='medium'
              endIcon={<StorageIcon />}
            >
              Select From Neo4j
            </Button>
            <Button
              component='label'
              // onClick={(e)=>uploadDashboard(e)}
              style={{ marginLeft: '10px', backgroundColor: 'white', marginBottom: '10px' }}
              color='default'
              variant='contained'
              size='medium'
              endIcon={<PostAddIcon />}
            >
              <input type='file' onChange={(e) => uploadDashboard(e)} hidden />
              Select From File
            </Button>

            <Button
              onClick={text.length > 0 ? handleCloseAndLoad : null}
              style={{
                color: text.length > 0 ? 'white' : 'lightgrey',
                float: 'right',
                marginLeft: '10px',
                marginBottom: '10px',
                backgroundColor: text.length > 0 ? 'green' : 'white',
              }}
              color='default'
              variant='contained'
              size='medium'
              endIcon={<PlayArrow />}
            >
              Load Dashboard
            </Button>
          </div>

          <TextareaAutosize
            style={{ minHeight: '500px', width: '100%', border: '1px solid lightgray' }}
            className={'textinput-linenumbers'}
            onChange={(e) => setText(e.target.value)}
            value={text}
            aria-label=''
            placeholder='Select a dashboard first, then preview it here...'
          />
        </DialogContent>
        {/* <DialogActions> */}
        {/* </DialogActions> */}
      </Dialog>
      <Dialog
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
        <DialogContent style={{ width: '900px' }}>
          <DialogContentText>
            If dashboards are saved in your current database, choose a dashboard below.
          </DialogContentText>

          <div style={{ height: '380px', borderBottom: '1px solid lightgrey' }}>
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
    </div>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  loadDashboard: (text) => dispatch(loadDashboardThunk(text)),
  loadDashboardFromNeo4j: (driver, database, uuid, callback) =>
    dispatch(loadDashboardFromNeo4jByUUIDThunk(driver, database, uuid, callback)),
  loadDashboardListFromNeo4j: (driver, database, callback) =>
    dispatch(loadDashboardListFromNeo4jThunk(driver, database, callback)),
  loadDatabaseListFromNeo4j: (driver, callback) => dispatch(loadDatabaseListFromNeo4jThunk(driver, callback)),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(NeoLoadModal));
