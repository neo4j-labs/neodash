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
import {
  Operation,
  retrieveAllowAndDenyLists,
  retrieveDatabaseList,
  retrieveLabelsList,
  retrieveNeo4jUsers,
  updatePriveleges,
  updateUsers,
} from './RBACUtils';
/**
 * Configures RBAC Access Control Management for a certain role on certain labels and attaches the roles to specific users.
 * @param open - Whether the modal is open or not.
 * @param currentRole - The currently selected role.
 * @param handleClose - The function to close the modal.
 */
export const RBACManagementModal = ({ open, handleClose, currentRole, createNotification }) => {
  const { driver } = useContext<Neo4jContextState>(Neo4jContext);
  const [neo4jUsers, setNeo4jUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [databases, setDatabases] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [labels, setLabels] = useState([]);
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
    retrieveDatabaseList(driver, setDatabases);
    retrieveNeo4jUsers(driver, setNeo4jUsers);
  }, [open]);

  const parseLabelsList = (database, records) => {
    const allLabels = records.map((record) => record._fields[0]).filter((l) => l !== '_Neodash_Dashboard');
    retrieveAllowAndDenyLists(
      driver,
      database,
      currentRole,
      allLabels,
      setLabels,
      setAllowList,
      setDenyList,
      setLoaded
    );
  };

  const handleDatabaseSelect = (selectedOption) => {
    setSelectedDatabase(selectedOption.value);
    retrieveLabelsList(driver, selectedOption, (records) => parseLabelsList(selectedOption.value, records));
  };

  const handleSave = () => {
    updatePriveleges(driver, selectedDatabase, currentRole, labels, denyList, Operation.DENY);
    updatePriveleges(driver, selectedDatabase, currentRole, labels, allowList, Operation.GRANT);
    updateUsers(driver, currentRole, selectedUsers);
    createNotification('Success', `Access for role ${currentRole} was successfully updated.`);
    handleClose();
  };

  return (
    <Dialog size='large' open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
      <Dialog.Header id='form-dialog-title'>Access Control - '{currentRole}'</Dialog.Header>
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
          label='Database'
          helpText='Choose a database for updating role privileges'
          errorText={!selectedDatabase && 'Please choose a database in order to proceed'}
          selectProps={{
            value: { value: selectedDatabase, label: selectedDatabase },
            placeholder: 'Select a database',
            options: databases
              .filter((database) => database !== 'system')
              .map((database) => ({ value: database, label: database })),
            onChange: handleDatabaseSelect,
          }}
        />
      </div>
      {selectedDatabase && loaded && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '45%' }}>
              <Dropdown
                type='select'
                label='Allow List'
                helpText={
                  allowList.find((i) => i == '*') &&
                  'Selecting (*) grants access to all labels, overriding other selections.'
                }
                selectProps={{
                  placeholder: 'Select labels',
                  isClearable: false,
                  value: allowList.map((nodelabel) => ({ value: nodelabel, label: nodelabel })),
                  options: labels.map((nodelabel) => ({ value: nodelabel, label: nodelabel })),
                  isMulti: true,
                  onChange: (val) => setAllowList(val.map((v) => v.value)),
                }}
              />
            </div>
            <div style={{ width: '45%' }}>
              <Dropdown
                type='select'
                label='Deny List'
                helpText={
                  denyList.find((i) => i == '*') &&
                  'Selecting (*) denies access to all labels, overriding other selections.'
                }
                selectProps={{
                  placeholder: 'Select labels',
                  isClearable: false,
                  value: denyList.map((nodelabel) => ({ value: nodelabel, label: nodelabel })),
                  options: labels.map((nodelabel) => ({ value: nodelabel, label: nodelabel })),
                  isMulti: true,
                  onChange: (val) => setDenyList(val.map((v) => v.value)),
                }}
              />
            </div>
          </div>
          <br />

          <div>
            <p>Manage the list of users for this role</p>
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
