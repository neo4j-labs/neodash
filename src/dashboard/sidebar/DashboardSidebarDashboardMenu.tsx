import React from 'react';
import { Menu, MenuItem, MenuItems } from '@neo4j-ndl/react';
import {
  CloudArrowUpIconOutline,
  InformationCircleIconOutline,
  ShareIconOutline,
  TrashIconOutline,
} from '@neo4j-ndl/react/icons';

/**
 * Configures setting the current Neo4j database connection for the dashboard.
 */
export const NeoDashboardSidebarDashboardMenu = ({ anchorEl, open, handleClose }) => {
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
        <MenuItem onClick={() => {}} icon={<InformationCircleIconOutline />} title='Info' />
        <MenuItem onClick={() => {}} icon={<CloudArrowUpIconOutline />} title='Load' />
        <MenuItem onClick={() => {}} icon={<ShareIconOutline />} title='Share' />
        <MenuItem onClick={() => {}} icon={<TrashIconOutline />} title='Delete' />
      </MenuItems>
    </Menu>
  );
};

export default NeoDashboardSidebarDashboardMenu;
