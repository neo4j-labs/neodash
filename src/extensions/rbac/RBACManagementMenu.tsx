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
export const RBACManagementMenu = ({ anchorEl, MenuOpen, handleClose, handleError }) => {
  const { driver } = useContext<Neo4jContextState>(Neo4jContext);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!MenuOpen) {
      return;
    }
    const query = `SHOW ROLES YIELD role WHERE role <> "PUBLIC" return role`;
    runCypherQuery(
      driver,
      'system',
      query,
      {},
      1000,
      (error) => {
        console.error(error);
      },
      (records) => {
        if (records[0].error) {
          handleError('Unable to retrieve roles', records[0].error);
          return;
        }
        setRoles(records.map((record) => record._fields[0]));
      }
    );
  }, [MenuOpen]);

  if (roles.length == 0) {
    return <></>;
  }

  const handleRoleClicked = (role) => {
    console.log(role);
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  return (
    <>
      <Menu
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom',
        }}
        transformOrigin={{
          horizontal: 'left',
          vertical: 'top',
        }}
        anchorEl={anchorEl}
        open={MenuOpen}
        onClose={handleClose}
        size='small'
      >
        <MenuItems>
          {roles.map((role) => (
            <MenuItem key={role} onClick={() => handleRoleClicked(role)} icon={<UserIconOutline />} title={role} />
          ))}
        </MenuItems>
      </Menu>

      <RBACManagementModal
        open={isModalOpen == true}
        handleClose={() => {
          setIsModalOpen(false);
        }}
        currentRole={selectedRole}
      />
    </>
  );
};

export default RBACManagementMenu;
