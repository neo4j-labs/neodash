import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Dialog, IconButton } from '@neo4j-ndl/react';
import { useSchema } from 'use-neo4j';
import { getQueryBuilderQueries } from '../state/QueryBuilderSelectors';
import QueryEditorForm from './index';
import { PlusIconOutline } from '@neo4j-ndl/react/icons';
// import Button from '../forms/button';
import Button from '@mui/material/Button';
import Modal from '../modal';
// import Card from '../card';
import { Card, CardActions, CardContent, TextField } from '@mui/material';
import Column from '../grid/Column';
import { addQuery, deleteQuery, loadQueryById } from '../state/QueryBuilderActions';
import { Badge } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import useDimensions from 'react-cool-dimensions';
import RGL, { WidthProvider } from 'react-grid-layout';
import QueryEditor from './QueryEditor';

const ReactGridLayout = WidthProvider(RGL);
export const QueryBuilderModal = ({ open, setOpen, queries }) => {
  const dispatch = useDispatch();

  const handleCloseWithoutSave = () => {
    setOpen(false);
  };

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [selectedQueryId, setSelectedQueryId] = useState<string>('');

  const handleNameChange = (e) => setName(e.target.value);

  const handleAddQuery = () => {
    if (name !== '') {
      dispatch(addQuery(name));
      setName('');
      setShowAddForm(false);
    }
  };

  const handleSetQuery = (selectedQueryId) => {
    setSelectedQueryId(selectedQueryId);
    dispatch(loadQueryById(selectedQueryId));
  };

  const handleShowAddFormClick = () => setShowAddForm(true);
  const handleHideAddFormClick = () => setShowAddForm(false);

  const handleDeleteQueryClick = (id) => {
    if (confirm('Are you sure you want to delete this query and all subsequent reports?')) {
      dispatch(deleteQuery(id));
    }
  };

  return (
    <Dialog className='dialog-xxl' open={open} onClose={handleCloseWithoutSave} aria-labelledby='form-dialog-title'>
      <Dialog.Header id='form-dialog-title'>
        Query Builder
        <IconButton onClick={handleShowAddFormClick} style={{ marginLeft: '40px', padding: '3px', float: 'right' }}>
          <Badge overlap='rectangular' badgeContent={''}>
            <AddIcon />
          </Badge>
        </IconButton>
      </Dialog.Header>
      <Dialog.Content>
        {selectedQueryId ? (
          <QueryEditor queryId={selectedQueryId} />
        ) : (
          <div>
            <ReactGridLayout
              className='layout'
              cols={4}
              isResizable={false}
              isDraggable={false}
              style={{ width: '100%', overflow: 'auto' }}
              rowHeight={150}
              compactType={'vertical'}
            >
              {queries.map((query, i) => (
                <div
                  key={i}
                  style={{
                    background: 'grey',
                    backgroundColor: 'white',
                    display: 'inline-block',
                    padding: 0,
                    margin: 0,
                  }}
                >
                  <Card variant='outlined' title={query.name}>
                    <CardContent>{query.name}</CardContent>
                    <CardActions>
                      <Button size='small' onClick={() => handleDeleteQueryClick(query.id)}>
                        Delete
                      </Button>
                      <Button size='small' onClick={() => handleSetQuery(query.id)}>
                        View Query
                      </Button>
                    </CardActions>
                  </Card>
                </div>
              ))}
              {showAddForm && (
                <div
                  key={'add'}
                  style={{
                    background: 'grey',
                    backgroundColor: 'white',
                    display: 'inline-block',
                    padding: 0,
                    margin: 0,
                  }}
                >
                  <Card title='Add Query'>
                    <CardContent>
                      <TextField
                        id='filled-basic'
                        label='queryName'
                        variant='filled'
                        value={name}
                        onChange={handleNameChange}
                      />
                    </CardContent>
                    <CardActions>
                      <Button size='small' onClick={handleHideAddFormClick}>
                        Cancel
                      </Button>
                      <Button size='small' onClick={handleAddQuery}>
                        Add
                      </Button>
                    </CardActions>
                  </Card>
                </div>
              )}
            </ReactGridLayout>
          </div>
        )}
      </Dialog.Content>
    </Dialog>
  );
};
const mapStateToProps = (state) => ({
  queries: getQueryBuilderQueries(state),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(QueryBuilderModal);
