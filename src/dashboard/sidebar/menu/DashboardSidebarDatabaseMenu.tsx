import React from 'react';
import { Button, Dialog, Menu, MenuItem, MenuItems } from '@neo4j-ndl/react';

/**
 * Configures setting the current Neo4j database connection for the dashboard.
 */
export const NeoDashboardSidebarDatabaseMenu = ({ anchorEl, open, handleClose, databases, selected, setSelected }) => {
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
        {databases.map((d) => {
          return (
            <MenuItem
              onClick={() => {
                setSelected(d);
              }}
              title={d}
              style={
                d == selected
                  ? {
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      color: 'rgb(var(--palette-primary-bg-strong))',
                      borderColor: 'rgb(var(--palette-primary-bg-strong))',
                      borderRadius: '8px',
                    }
                  : {}
              }
            />
          );
        })}
      </MenuItems>
    </Menu>
  );
};

export default NeoDashboardSidebarDatabaseMenu;
