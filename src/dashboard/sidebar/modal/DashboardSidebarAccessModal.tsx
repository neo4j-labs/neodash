import React, { useEffect, useState, useContext } from 'react';
import { IconButton, Button, Dialog } from '@neo4j-ndl/react';
import { Menu, MenuItem, Chip, TextField } from '@mui/material';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { PlusCircleIconOutline } from '@neo4j-ndl/react/icons';
import { QueryStatus, runCypherQuery } from '../../../report/ReportQueryRunner';
import { createNotificationThunk } from '../../../page/PageThunks';
import { useDispatch } from 'react-redux';

/**
 * Configures setting the current Neo4j database connection for the dashboard.
 * TODO: whenever you add a new label to a specific dashboard then it should not show up in the other dashboards.
 * Same if you remove a label it should not be removed in both dashboards.
 */
export const NeoDashboardSidebarAccessModal = ({ open, database, dashboard, handleClose }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [neo4jLabels, setNeo4jLabels] = useState([]);
  const [newLabel, setNewLabel] = useState('');
  const initialLabel = '_Neodash_Dashboard';
  const [feedback, setFeedback] = useState('');
  const { driver } = useContext<Neo4jContextState>(Neo4jContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!open) {
      return;
    }
    runCypherQuery(
      driver,
      database,
      'CALL db.labels()',
      {},
      1000,
      () => {},
      (records) => setNeo4jLabels(records.map((record) => record.get('label')))
    );
  }, [open]);

  useEffect(() => {
    setSelectedLabels([initialLabel]);
  }, []);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLabelSelect = (label) => {
    if (!selectedLabels.includes(label) && label !== initialLabel) {
      setSelectedLabels([...selectedLabels, label]);
    }
    handleCloseMenu();
  };

  const handleDeleteLabel = (label) => {
    if (label !== initialLabel) {
      const updatedLabels = selectedLabels.filter((selectedLabel) => selectedLabel !== label);
      setSelectedLabels(updatedLabels);
    }
  };

  const handleAddNewLabel = (e) => {
    if (e.key === 'Enter' && newLabel.trim() !== '') {
      if (selectedLabels.includes(newLabel)) {
        setFeedback('Label already exists. Please enter a unique label.');
      } else {
        setSelectedLabels([...selectedLabels, newLabel]);
        handleLabelSelect(newLabel);
        setNewLabel('');
        handleCloseMenu();
        setFeedback('');
      }
    }
  };

  const handleSave = () => {
    const query = `
    MATCH (d {uuid: "${dashboard.uuid}"})
    CALL apoc.create.setLabels( d, $selectedLabels)
    YIELD node
    return node
    `;

    runCypherQuery(
      driver,
      database,
      query,
      { selectedLabels: selectedLabels },
      1000,
      (status) => {
        if (status == QueryStatus.COMPLETE) {
          // Dispatch a success notification
          dispatch(
            createNotificationThunk(
              '🎉 Success!',
              'Selected Labels have successfully been added to the dashboard node.'
            )
          );
          // Close the modal after the labels are saved
          handleClose();
        } else {
          dispatch(
            createNotificationThunk(
              'Unable to save dashboard',
              `Do you have write access to the '${database}' database?`
            )
          );
        }
      },
      () => {}
    );
  };

  return (
    <Dialog size='small' open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
      <Dialog.Header id='form-dialog-title'>Dasboard Access Control - '{dashboard && dashboard.title}'</Dialog.Header>
      <Dialog.Content>
        Welcome to the Dashboard Access settings! This window empowers you to fine-tune
        <br />
        who can access your dashboards through the use of labels.
      </Dialog.Content>
      <div>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
          {/* Fetch labels dynamically from Neo4j and map to menu items */}
          {neo4jLabels
            .filter((e) => !selectedLabels.includes(e))
            .map((label) => (
              <MenuItem key={label} onClick={() => handleLabelSelect(label)}>
                {label}
              </MenuItem>
            ))}
          <MenuItem>
            <TextField
              label='Add New Label'
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={handleAddNewLabel}
              helperText={feedback}
              error={Boolean(feedback)}
            />
          </MenuItem>
        </Menu>
        <div style={{ marginTop: '10px' }}>
          {selectedLabels.map((label) => (
            <Chip
              key={label}
              label={label}
              onDelete={label === initialLabel ? undefined : () => handleDeleteLabel(label)}
              style={{ marginRight: '5px', marginBottom: '5px' }}
            />
          ))}
          <IconButton
            title='Add Label'
            clean
            onClick={handleOpenMenu}
            style={{ marginLeft: '5px', marginBottom: '5px' }}
          >
            <PlusCircleIconOutline />
          </IconButton>
        </div>
      </div>
      <Dialog.Actions>
        <Button onClick={handleClose} style={{ float: 'right' }} fill='outlined' floating>
          Cancel
        </Button>
        <Button onClick={handleSave} color='primary' style={{ float: 'right', marginRight: '10px' }} floating>
          Save
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default NeoDashboardSidebarAccessModal;
