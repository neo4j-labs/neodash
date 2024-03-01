import React, { useEffect, useState, useContext } from 'react';
import { Button, Dialog, Dropdown } from '@neo4j-ndl/react';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import {
  Operation,
  retrieveAllowAndDenyLists,
  retrieveDatabaseList,
  retrieveLabelsList,
  retrieveNeo4jUsers,
  updatePrivileges,
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
    retrieveNeo4jUsers(driver, currentRole, setNeo4jUsers, setSelectedUsers);
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
    retrieveLabelsList(driver, selectedOption.value, (records) => parseLabelsList(selectedOption.value, records));
  };

  const handleSave = async () => {
    await updateUsers(driver, currentRole, neo4jUsers, selectedUsers);
    if (selectedDatabase) {
      createNotification('Updating', `Access for role '${currentRole}' is being updated, please wait...`);
      updatePrivileges(
        driver,
        selectedDatabase,
        currentRole,
        labels,
        denyList,
        Operation.DENY,
        createNotification
      ).then(() =>
        updatePrivileges(driver, selectedDatabase, currentRole, labels, allowList, Operation.GRANT, createNotification)
      );
    } else {
      createNotification('Success', `Users have been updated for role '${currentRole}'.`);
    }

    handleClose();
  };

  return (
    <Dialog size='large' open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
      <Dialog.Header id='form-dialog-title'>Access Control - '{currentRole}'</Dialog.Header>
      <Dialog.Content>
        This screen lets you handle user assignment and access control for a specific role.
        <br />
        For more information, please refer to the{' '}
        <a
          href='https://neo4j.com/labs/neodash/2.4/user-guide/extensions/access-control-management/'
          target='_blank'
          rel='noopener noreferrer'
          style={{ color: 'blue', textDecoration: 'underline' }}
        >
          documentation
        </a>
        .
        <br />
        <div>
          <br />
          <h5>Manage Users</h5>
          <p>Select a list of users to assign to the current role.</p>
          <Dropdown
            type='select'
            selectProps={{
              value: selectedUsers.map((user) => ({ value: user, label: user })),
              options: neo4jUsers.map((user) => ({ value: user, label: user })),
              isMulti: true,
              onChange: (val) => setSelectedUsers(val.map((v) => v.value)),
            }}
          />
        </div>
        <div>
          <br />
          <h5>Label Access</h5>
          <p>For a given database, control what labels the role is or is not allowed to see.</p>
          <Dropdown
            type='select'
            label='Database'
            // errorText={!selectedDatabase && 'Please choose a database in order to proceed'}
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
            <br />
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
          </>
        )}
      </Dialog.Content>
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
