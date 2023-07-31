import React from 'react';
import { Tooltip } from '@mui/material';
import NeoSaveModal from '../../modal/SaveModal';
import NeoLoadModal from '../../modal/LoadModal';
import NeoShareModal from '../../modal/ShareModal';
import { NeoReportExamplesModal } from '../../modal/ReportExamplesModal';
import {
  applicationGetConnection,
  applicationHasAboutModalOpen,
  applicationIsStandalone,
} from '../../application/ApplicationSelectors';
import { connect } from 'react-redux';
import { setAboutModalOpen, setConnected, setWelcomeScreenOpen } from '../../application/ApplicationActions';
import NeoSettingsModal from '../../settings/SettingsModal';
import { getDashboardExtensions, getDashboardSettings } from '../DashboardSelectors';
import { updateDashboardSetting } from '../../settings/SettingsActions';
import NeoExtensionsModal from '../../extensions/ExtensionsModal';
import { getExampleReports } from '../../extensions/ExtensionUtils';
import NodeSidebarDrawer from '../../extensions/sidebar/SidebarDrawer';
import { EXTENSIONS_DRAWER_BUTTONS } from '../../extensions/ExtensionConfig';
import { SideNavigation, SideNavigationList, SideNavigationItem, SideNavigationGroupHeader } from '@neo4j-ndl/react';
import { BookOpenIconOutline, InformationCircleIconOutline, HomeIconOutline } from '@neo4j-ndl/react/icons';

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
export const NeoDrawer = ({
  hidden,
  connection,
  dashboardSettings,
  extensions,
  updateDashboardSetting,
  onAboutModalOpen,
  resetApplication,
}) => {
  const navItemClass = 'n-w-full n-h-full';

  /**
   * Function to render dynamically the buttons in the drawer related to all the extension that
   * are enabled and present a button (EX: node-sidebar)
   * @returns JSX element containing all the buttons related to their enabled extensions
   */
  function renderDrawerExtensionsButtons() {
    const res = (
      <>
        {Object.keys(EXTENSIONS_DRAWER_BUTTONS).map((name, idx) => {
          const Component = extensions[name] ? EXTENSIONS_DRAWER_BUTTONS[name] : '';
          return Component ? (
            <Component key={`ext-${  idx}`} database={connection.database} navItemClass={navItemClass} />
          ) : (
            <></>
          );
        })}
      </>
    );
    return res;
  }
  const [expanded, setOnExpanded] = React.useState(false);

  // Override to hide the drawer when the application is in standalone mode.
  if (hidden) {
    return <></>;
  }

  const content = (
    <div
      className='n-z-30'
      style={{
        display: 'flex',
      }}
    >
      <SideNavigation iconMenu expanded={expanded} onExpandedChange={setOnExpanded} className='n-shadow-l4'>
        <SideNavigationList>
          <Tooltip title='Menu' aria-label='menu' disableInteractive>
            <SideNavigationItem onClick={resetApplication} icon={<HomeIconOutline className={navItemClass} />}>
              Menu
            </SideNavigationItem>
          </Tooltip>
          <SideNavigationGroupHeader>Manage</SideNavigationGroupHeader>
          <NeoSettingsModal
            dashboardSettings={dashboardSettings}
            updateDashboardSetting={updateDashboardSetting}
            navItemClass={navItemClass}
            extensions={extensions}
          ></NeoSettingsModal>

          <NeoSaveModal navItemClass={navItemClass}></NeoSaveModal>
          <NeoLoadModal navItemClass={navItemClass}></NeoLoadModal>
          <NeoShareModal navItemClass={navItemClass}></NeoShareModal>
          <NeoExtensionsModal navItemClass={navItemClass}></NeoExtensionsModal>
          {renderDrawerExtensionsButtons()}
          <SideNavigationGroupHeader>Learn</SideNavigationGroupHeader>
          <NeoReportExamplesModal
            extensions={extensions}
            examples={getExampleReports(extensions)}
            database={connection.database}
            navItemClass={navItemClass}
          ></NeoReportExamplesModal>
          <Tooltip title='Documentation' aria-label='documentation' disableInteractive>
            <SideNavigationItem
              href='https://neo4j.com/labs/neodash/2.3/user-guide/'
              target='_blank'
              icon={<BookOpenIconOutline className={navItemClass} aria-label={'side book'} />}
              aria-label={'side docs'}
            >
              Documentation
            </SideNavigationItem>
          </Tooltip>
          <Tooltip title='About' aria-label='about' disableInteractive>
            <SideNavigationItem
              onClick={onAboutModalOpen}
              icon={<InformationCircleIconOutline className={navItemClass} aria-label={'side info'} />}
              aria-label={'side about'}
            >
              About
            </SideNavigationItem>
          </Tooltip>
        </SideNavigationList>
      </SideNavigation>
    </div>
  );
  return (
    <>
      {content}
      {renderExtensionDrawers(connection.database)}
    </>
  );
};

const mapStateToProps = (state) => ({
  dashboardSettings: getDashboardSettings(state),
  hidden: applicationIsStandalone(state),
  extensions: getDashboardExtensions(state),
  aboutModalOpen: applicationHasAboutModalOpen(state),
  connection: applicationGetConnection(state),
});

const mapDispatchToProps = (dispatch) => ({
  onAboutModalOpen: () => dispatch(setAboutModalOpen(true)),
  updateDashboardSetting: (setting, value) => {
    dispatch(updateDashboardSetting(setting, value));
  },
  resetApplication: () => {
    dispatch(setWelcomeScreenOpen(true));
    dispatch(setConnected(false));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoDrawer);
