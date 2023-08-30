import React from 'react';
import { Menu, MenuItem, MenuItems } from '@neo4j-ndl/react';
import { DocumentTextIconOutline, PlusCircleIconOutline } from '@neo4j-ndl/react/icons';

/**
 * Configures setting the current Neo4j database connection for the dashboard.
 */
export const NeoDashboardSidebarCreateMenu = ({
  anchorEl,
  open,
  handleNewClicked,
  handleImportClicked,
  handleClose,
}) => {
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
        <MenuItem onClick={handleNewClicked} title='New' />
        <MenuItem onClick={handleImportClicked} title='Import' />
      </MenuItems>
    </Menu>
  );
};

export default NeoDashboardSidebarCreateMenu;
