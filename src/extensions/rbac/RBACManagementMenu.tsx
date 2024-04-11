import React, { useEffect, useState, useContext } from 'react';
import { Menu, MenuItem, MenuItems } from '@neo4j-ndl/react';
import { UserIconOutline } from '@neo4j-ndl/react/icons';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { QueryStatus, runCypherQuery } from '../../report/ReportQueryRunner';
import RBACManagementModal from './RBACManagementModal';

/**
 * Component for providing a menu of all the roles in the neo4j database to the user whenever they press on the
 * RBACManagementLabelButton.
 */
export const RBACManagementMenu = ({ anchorEl, MenuOpen, handleClose, createNotification }) => {
  const { driver } = useContext<Neo4jContextState>(Neo4jContext);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!MenuOpen) {
      return;
    }
    const query = `SHOW PRIVILEGES YIELD role, action WHERE role <> "PUBLIC" RETURN role, 'dbms_actions' in collect(action)`;
    runCypherQuery(
      driver,
      'system',
      query,
      {},
      1000,
      () => {},
      (records) => {
        if (records[0].error) {
          createNotification('Unable to retrieve roles', records[0].error);
          return;
        }
        // Only display roles which are not able to do 'dbms_actions', i.e. they are not admins.
        setRoles(records.filter((r) => r._fields[1] == false).map((record) => record._fields[0]));
      }
    );
  }, [MenuOpen]);

  if (roles.length == 0) {
    return <></>;
  }

  const handleRoleClicked = (role) => {
    handleClose();
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  return (
    <>
      <Menu
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        anchorEl={anchorEl}
        open={MenuOpen}
        onClose={handleClose}
        size='small'
      >
        <MenuItems className='n-overflow-y-scroll n-h-44'>
          {roles.map((role) => (
            <MenuItem key={role} onClick={() => handleRoleClicked(role)} icon={<UserIconOutline />} title={role} />
          ))}
        </MenuItems>
      </Menu>

      <RBACManagementModal
        open={isModalOpen}
        handleClose={() => {
          setIsModalOpen(false);
        }}
        currentRole={selectedRole}
        createNotification={createNotification}
      />
    </>
  );
};

export default RBACManagementMenu;
