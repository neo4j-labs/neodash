import React, { useEffect, useState, useContext } from 'react';
import { IconButton, Button, Dialog, TextInput, Dropdown } from '@neo4j-ndl/react';
import { Menu, MenuItem, Chip } from '@mui/material';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { PlusCircleIconOutline } from '@neo4j-ndl/react/icons';
import { QueryStatus, runCypherQuery } from '../../report/ReportQueryRunner';
import { createNotificationThunk } from '../../page/PageThunks';
import { useDispatch } from 'react-redux';
import { DndContext } from '@dnd-kit/core';
import { set } from 'yaml/dist/schema/yaml-1.1/set';
/**
 * Configures RBAC Access Control Management for a certain role on certain labels and attaches the roles to specific users.
 * @param open - Whether the modal is open or not.
 * @param currentRole - The currently selected role.
 * @param handleClose - The function to close the modal.
 */
export const RBACManagementModal = ({ open, handleClose, currentRole }) => {
  const { driver } = useContext<Neo4jContextState>(Neo4jContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [neo4jUsers, setNeo4jUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [databases, setDatabases] = useState([]);
  const [allowList, setAllowList] = useState([]);
  const [denyList, setDenyList] = useState([]);

  useEffect(() => {
    if (!open) {
      setSelectedUsers([]);
      setAllowList([]);
      setDenyList([]);
      setSelectedDatabase('');
      return;
    }
    runCypherQuery(
      driver,
      'system',
      'SHOW DATABASES',
      {},
      1000,
      () => {},
      (records) => {
        setDatabases(records.map((record) => record.get('name')));
      }
    );

    runCypherQuery(
      driver,
      selectedDatabase,
      'SHOW DATABASES',
      {},
      1000,
      () => {},
      (records) => {
        setDatabases(records.map((record) => record.get('name')));
      }
    );
  }, [open]);

  const handleDatabaseSelect = (selectedOption) => {
    setSelectedDatabase(selectedOption.value);
  };

  const handleSave = () => {
    runCypherQuery(
      driver,
      selectedDatabase,
      `GRANT MATCH {*} ON GRAPH ${selectedDatabase} NODES ${allowList.join(',')} TO ${currentRole}`
    );

    runCypherQuery(
      driver,
      selectedDatabase,
      `DENY MATCH ON GRAPH ${selectedDatabase} NODES ${denyList.join(',')} TO ${currentRole}`
    );
    handleClose();
  };

  return (
    <Dialog size='small' open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
      <Dialog.Header id='form-dialog-title'> RBAC Access Control Management - '{currentRole}'</Dialog.Header>
      <Dialog.Content>
        Welcome to the Dashboard Access settings!
        <br />
        In this modal, you can select the labels that you want to add to the current dashboard node.
        <br />
        For more information, please refer to the{' '}
        <a
          href='https://neo4j.com/labs/neodash/2.4/user-guide/access-control/'
          target='_blank'
          rel='noopener noreferrer'
          style={{ color: 'blue', textDecoration: 'underline' }}
        >
          documentation
        </a>
        .
      </Dialog.Content>
      <div>
        <Dropdown
          type='select'
          label='Database List'
          helpText='Choose a database for updating role privileges'
          errorText='Please choose a database in order to proceed'
          selectProps={{
            placeholder: 'Select a database',
            options: databases
              .filter((database) => database !== 'system')
              .map((database) => ({ value: database, label: database })),
            onChange: handleDatabaseSelect,
          }}
        />
      </div>
      {selectedDatabase && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '45%' }}>
              <Dropdown
                type='select'
                label='Allow List'
                selectProps={{
                  placeholder: 'Select labels',
                  options: allowList.map((label) => ({ value: label, label })),
                  isMulti: true,
                  onChange: setAllowList,
                }}
              />
            </div>
            <div style={{ width: '45%' }}>
              <Dropdown
                type='select'
                label='Deny List'
                selectProps={{
                  placeholder: 'Select labels',
                  options: denyList.map((label) => ({ value: label, label })),
                  isMulti: true,
                  onChange: setDenyList,
                }}
              />
            </div>
          </div>
          <div>
            <Dropdown
              type='select'
              label='Users'
              selectProps={{
                placeholder: 'Select users to add the current role.',
                options: neo4jUsers.map((user) => ({ value: user, label: user })),
                isMulti: true,
                onChange: setSelectedUsers,
              }}
            />
          </div>
        </>
      )}

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

export default RBACManagementModal;
