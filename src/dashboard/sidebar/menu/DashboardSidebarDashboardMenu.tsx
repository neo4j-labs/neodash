import React from 'react';
import { Menu, MenuItem, MenuItems } from '@neo4j-ndl/react';
import {
  CloudArrowUpIconOutline,
  DocumentDuplicateIconOutline,
  DocumentTextIconOutline,
  InformationCircleIconOutline,
  ShareIconOutline,
  FingerPrintIconOutline,
  TrashIconOutline,
} from '@neo4j-ndl/react/icons';

/**
 * Configures setting the current Neo4j database connection for the dashboard.
 */
export const NeoDashboardSidebarDashboardMenu = ({
  anchorEl,
  open,
  handleInfoClicked,
  handleLoadClicked,
  handleExportClicked,
  handleShareClicked,
  handleAccessClicked,
  handleDeleteClicked,
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
        <MenuItem onClick={handleInfoClicked} icon={<InformationCircleIconOutline />} title='Info' />
        <MenuItem onClick={handleLoadClicked} icon={<CloudArrowUpIconOutline />} title='Load' />
        {/* <MenuItem onClick={() => {}} icon={<DocumentDuplicateIconOutline />} title='Clone' /> */}
        <MenuItem onClick={handleExportClicked} icon={<DocumentTextIconOutline />} title='Export' />
        <MenuItem onClick={handleShareClicked} icon={<ShareIconOutline />} title='Share' />
        <MenuItem onClick={handleAccessClicked} icon={<FingerPrintIconOutline />} title='Access' />
        <MenuItem onClick={handleDeleteClicked} icon={<TrashIconOutline />} title='Delete' />
      </MenuItems>
    </Menu>
  );
};

export default NeoDashboardSidebarDashboardMenu;
