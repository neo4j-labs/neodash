import React, { useEffect, useState, useContext } from 'react';
import { Menu, MenuItem, MenuItems } from '@neo4j-ndl/react';
import { UserIconOutline } from '@neo4j-ndl/react/icons';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { QueryStatus, runCypherQuery } from '../../report/ReportQueryRunner';

/**
 * Component for providing a menu of all the roles in the neo4j database to the user whenever they press on the
 * RBACManagementLabelButton.
 */
export const RBACManagementMenu = ({ anchorEl, open, handleRoleClicked, handleClose, database }) => {
  const { driver } = useContext<Neo4jContextState>(Neo4jContext);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const query = `SHOW ROLES YIELD role return role`;
    runCypherQuery(
      driver,
      database,
      query,
      {},
      1000,
      (error) => {
        console.error(error);
      },
      (records) => setRoles(records.map((record) => record._fields[0]))
    );
  }, [open]);
  console.log(roles);
  return (
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
      open={open}
      onClose={handleClose}
      size='small'
    >
      <MenuItems>
        {roles.map((role) => (
          <MenuItem key={role} onClick={handleRoleClicked} icon={<UserIconOutline />} title={role}>
            {role}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
};

export default RBACManagementMenu;
