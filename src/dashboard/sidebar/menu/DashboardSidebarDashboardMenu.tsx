import React from 'react';
import { Menu, MenuItem, MenuItems } from '@neo4j-ndl/react';
import {
  CloudArrowUpIconOutline,
  DocumentDuplicateIconOutline,
  DocumentTextIconOutline,
  InformationCircleIconOutline,
  ShareIconOutline,
  TrashIconOutline,
} from '@neo4j-ndl/react/icons';
import { connect } from 'react-redux';
import { applicationIsStandalone } from '../../../application/ApplicationSelectors';

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
  handleDeleteClicked,
  handleClose,
  readonly,
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
        {!readonly ? (
          <MenuItem onClick={handleInfoClicked} icon={<InformationCircleIconOutline />} title='Info' />
        ) : (
          <></>
        )}
        {!readonly ? <MenuItem onClick={handleLoadClicked} icon={<CloudArrowUpIconOutline />} title='Load' /> : <></>}
        {/* <MenuItem onClick={() => {}} icon={<DocumentDuplicateIconOutline />} title='Clone' /> */}
        {!readonly ? (
          <MenuItem onClick={handleExportClicked} icon={<DocumentTextIconOutline />} title='Export' />
        ) : (
          <></>
        )}
        <MenuItem onClick={handleShareClicked} icon={<ShareIconOutline />} title='Share' />
        {!readonly ? <MenuItem onClick={handleDeleteClicked} icon={<TrashIconOutline />} title='Delete' /> : <></>}
      </MenuItems>
    </Menu>
  );
};

const mapStateToProps = (state) => ({
  readonly: applicationIsStandalone(state),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NeoDashboardSidebarDashboardMenu);
