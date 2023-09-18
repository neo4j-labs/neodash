import React from 'react';
import { applicationGetConnection, applicationIsStandalone } from '../../application/ApplicationSelectors';
import { connect } from 'react-redux';
import NodeSidebarDrawer from '../../extensions/sidebar/SidebarDrawer';

/**
 * For each config in extensionConfig, if the extensionConfig is opened, render its component.
 * Right now it's just for the node sidebar, to abstract probably.
 * @returns
 */
// TODO: abstract logic to work with any new drawer
function renderExtensionDrawers(database) {
  return <NodeSidebarDrawer database={database}></NodeSidebarDrawer>;
}

// The sidebar that appears on the left side of the dashboard.
export const NeoDrawer = ({ hidden, connection }) => {
  return hidden ? <></> : <>{renderExtensionDrawers(connection.database)}</>;
};

const mapStateToProps = (state) => ({
  hidden: applicationIsStandalone(state),
  connection: applicationGetConnection(state),
});

export default connect(mapStateToProps, null)(NeoDrawer);
