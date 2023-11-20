import React, { useContext, useRef } from 'react';
import { TextareaAutosize, Tooltip } from '@mui/material';
import { connect } from 'react-redux';
import {
  loadDashboardFromNeo4jByUUIDThunk,
  loadDashboardListFromNeo4jThunk,
  loadDashboardThunk,
  loadDatabaseListFromNeo4jThunk,
} from '../dashboard/DashboardThunks';
import { DataGrid } from '@mui/x-data-grid';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { MenuItem, Button, Dialog, Dropdown, IconButton } from '@neo4j-ndl/react';
import {
  CloudArrowUpIconOutline,
  PlayIconSolid,
  DatabaseAddCircleIcon,
  DocumentPlusIconOutline,
} from '@neo4j-ndl/react/icons';
import { applicationGetStandaloneSettings, applicationIsStandalone } from '../application/ApplicationSelectors';

/**
 * A modal to save a dashboard as a JSON text string.
 * The button to open the modal is renderedd as:
 * - a ListItem to use in a drawer at the side of the page if the app is in Editor Mode.
 * - a Button to be diplayed by itself if the app is in Standalone Mode.
 */

export const NeoLoadModal = ({
  loadDashboard,
  loadDatabaseListFromNeo4j,
  loadDashboardFromNeo4j,
  loadDashboardListFromNeo4j,
  isStandalone,
  standaloneSettings
}) => {
  const [loadModalOpen, setLoadModalOpen] = React.useState(false);
  const [loadFromNeo4jModalOpen, setLoadFromNeo4jModalOpen] = React.useState(false);
  const [text, setText] = React.useState('');
  const [rows, setRows] = React.useState([]);
  const { driver } = useContext<Neo4jContextState>(Neo4jContext);
  //database values are initialized using standalone settings if the app is running in standalone mode
  const [dashboardDatabase, setDashboardDatabase] = React.useState(standaloneSettings.standalone ? standaloneSettings.standaloneDashboardDatabase : 'neo4j');
  const [databases, setDatabases] = React.useState([standaloneSettings.standalone? standaloneSettings.standaloneDatabase : 'neo4j']);
  const loadFromFile = useRef(null);

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
    { field: 'title', headerName: 'Title', width: 300 },
    { field: 'author', headerName: 'Author', width: 160 },
    { field: 'version', headerName: 'Version', width: 85 },
    {
      field: 'load',
      headerName: 'Select',
      renderCell: (c) => {
        return (
          <Button
            onClick={() => {
              loadDashboardFromNeo4j(driver, dashboardDatabase, c.id, handleDashboardLoadedFromNeo4j);
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
    <>
      {!isStandalone?
        (
          <MenuItem title='Load' onClick={handleClickOpen} icon={<CloudArrowUpIconOutline />} />
        ):(
          <Tooltip title={'Load Dashboard'}>
            <IconButton className='n-mx-1' aria-label='Extensions' onClick={handleClickOpen}>
              <CloudArrowUpIconOutline />
            </IconButton>
          </Tooltip>
        )
      }

      <Dialog size='large' open={loadModalOpen == true} onClose={handleClose} aria-labelledby='form-dialog-title'>
        <Dialog.Header id='form-dialog-title'>
          <CloudArrowUpIconOutline className='icon-base icon-inline text-r' />
          Load Dashboard
        </Dialog.Header>
        <Dialog.Content>
          <div style={{ marginBottom: '10px' }}>
            <Button
              onClick={() => {
                loadDashboardListFromNeo4j(driver, dashboardDatabase, (result) => {
                  setRows(result);
                });
                setLoadFromNeo4jModalOpen(true);
                loadDatabaseListFromNeo4j(driver, (result) => {
                  setDatabases(result);
                });
              }}
              fill='outlined'
              color='neutral'
              floating
            >
              Select from Neo4j
              <DatabaseAddCircleIcon className='btn-icon-base-r' />
            </Button>
            {!isStandalone ? 
            <Button
              onClick={() => {
                loadFromFile.current.click();
              }}
              fill='outlined'
              color='neutral'
              style={{ marginLeft: '10px' }}
              floating
            >
              <input type='file' ref={loadFromFile} onChange={(e) => uploadDashboard(e)} hidden />
              Select From File
              <DocumentPlusIconOutline className='btn-icon-base-r' />
            </Button> : <></>
            }
            <Button
              onClick={text.length > 0 ? handleCloseAndLoad : null}
              style={{
                float: 'right',
                color: text.length > 0 ? 'white' : 'lightgrey',
                backgroundColor: text.length > 0 ? 'green' : 'white',
              }}
              fill='outlined'
              floating
            >
              Load Dashboard
              <PlayIconSolid className='btn-icon-base-r' />
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
        <Dialog.Header id='form-dialog-title'>Select from Neo4j</Dialog.Header>
        <Dialog.Subtitle>If dashboards are saved in your current database, choose a dashboard below.</Dialog.Subtitle>
        <Dialog.Content style={{ width: '900px' }}>
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
              //if application is running standalone and standaloneLoadFromOtherDatabases is not enabled, we do not allow changing database
              isDisabled: standaloneSettings.standalone && !standaloneSettings.standaloneLoadFromOtherDatabases ? true : false, 
              options: databases.map((database) => ({ label: database, value: database })),
              value: { label: dashboardDatabase, value: dashboardDatabase },
              menuPlacement: 'auto',
            }}
            style={{ width: '150px', marginTop: '-65px' }}
          ></Dropdown>
        </Dialog.Content>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state) => ({
  isStandalone: applicationIsStandalone(state),
  standaloneSettings: applicationGetStandaloneSettings(state),
});

const mapDispatchToProps = (dispatch) => ({
  loadDashboard: (text) => dispatch(loadDashboardThunk(text)),
  loadDashboardFromNeo4j: (driver, database, uuid, callback) =>
    dispatch(loadDashboardFromNeo4jByUUIDThunk(driver, database, uuid, callback)),
  loadDashboardListFromNeo4j: (driver, database, callback) =>
    dispatch(loadDashboardListFromNeo4jThunk(driver, database, callback)),
  loadDatabaseListFromNeo4j: (driver, callback) => dispatch(loadDatabaseListFromNeo4jThunk(driver, callback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoLoadModal);
