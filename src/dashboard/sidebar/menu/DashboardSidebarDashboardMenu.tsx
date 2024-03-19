import React from 'react';
import { Menu, MenuItem, MenuItems } from '@neo4j-ndl/react';
import {
  ArchiveBoxIconOutline,
  ArrowUturnLeftIconOutline,
  CloudArrowUpIconOutline,
  DocumentDuplicateIconOutline,
  DocumentTextIconOutline,
  InformationCircleIconOutline,
  ShareIconOutline,
  FingerPrintIconOutline,
  TrashIconOutline,
  XMarkIconOutline,
} from '@neo4j-ndl/react/icons';
import { getConnectionModule } from '../../../connection/utils';

const { connectionModule } = getConnectionModule();

/**
 * Configures setting the current Neo4j database connection for the dashboard.
 */
export const NeoDashboardSidebarDashboardMenu = ({
  anchorEl,
  draft,
  open,
  handleInfoClicked,
  handleSaveClicked,
  handleDiscardClicked,
  handleLoadClicked,
  handleExportClicked,
  handleShareClicked,
  handleAccessClicked,
  handleDeleteClicked,
  handleClose,
  handleCustomPublish,
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
      {!draft ? (
        <MenuItems>
          <MenuItem onClick={handleInfoClicked} icon={<InformationCircleIconOutline />} title='Info' />
          <MenuItem onClick={handleLoadClicked} icon={<CloudArrowUpIconOutline />} title='Load' />
          {/* <MenuItem onClick={() => {}} icon={<DocumentDuplicateIconOutline />} title='Clone' /> */}
          <MenuItem onClick={handleExportClicked} icon={<DocumentTextIconOutline />} title='Export' />
          {connectionModule.hasCustomPublishUI() && (
            <MenuItem
              onClick={handleCustomPublish}
              icon={<CloudArrowUpIconOutline />}
              title={connectionModule.getPublishMenuText()}
            />
          )}
          <MenuItem onClick={handleAccessClicked} icon={<FingerPrintIconOutline />} title='Access' />
          <MenuItem onClick={handleShareClicked} icon={<ShareIconOutline />} title='Share' />
          <MenuItem onClick={handleDeleteClicked} icon={<TrashIconOutline />} title='Delete' />
        </MenuItems>
      ) : (
        <MenuItems>
          <MenuItem onClick={handleSaveClicked} icon={<CloudArrowUpIconOutline />} title='Save' />
          <MenuItem onClick={handleDiscardClicked} icon={<ArrowUturnLeftIconOutline />} title='Discard Draft' />
        </MenuItems>
      )}
    </Menu>
  );
};

export default NeoDashboardSidebarDashboardMenu;
