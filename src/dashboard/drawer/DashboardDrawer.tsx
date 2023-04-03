import React from 'react';
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
import { SideNavigation, SideNavigationList, SideNavigationItem, SideNavigationGroupHeader } from '@neo4j-ndl/react';
import { BookOpenIconOutline, InformationCircleIconOutline, HomeIconOutline } from '@neo4j-ndl/react/icons';

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
  const [expanded, setOnExpanded] = React.useState(false);

  // Override to hide the drawer when the application is in standalone mode.
  if (hidden) {
    return <></>;
  }

  const navItemClass = 'n-w-full n-h-full';
  const content = (
    <div
      style={{
        display: 'flex',
        zIndex: 1001,
      }}
    >
      <SideNavigation iconMenu expanded={expanded} onExpandedChange={setOnExpanded}>
        <SideNavigationList>
          <SideNavigationItem onClick={resetApplication} icon={<HomeIconOutline className={navItemClass} />}>
            Menu
          </SideNavigationItem>
          <SideNavigationGroupHeader>Manage</SideNavigationGroupHeader>
          <NeoSettingsModal
            dashboardSettings={dashboardSettings}
            updateDashboardSetting={updateDashboardSetting}
            navItemClass={navItemClass}
          ></NeoSettingsModal>
          <NeoSaveModal navItemClass={navItemClass}></NeoSaveModal>
          <NeoLoadModal navItemClass={navItemClass}></NeoLoadModal>
          <NeoShareModal navItemClass={navItemClass}></NeoShareModal>
          <NeoExtensionsModal navItemClass={navItemClass}></NeoExtensionsModal>
          <SideNavigationGroupHeader>Learn</SideNavigationGroupHeader>
          <NeoReportExamplesModal
            extensions={extensions}
            examples={getExampleReports(extensions)}
            database={connection.database}
            navItemClass={navItemClass}
          ></NeoReportExamplesModal>
          <SideNavigationItem
            href='https://neo4j.com/labs/neodash/2.2/user-guide/'
            target='_blank'
            icon={<BookOpenIconOutline className={navItemClass} />}
          >
            Documentation
          </SideNavigationItem>
          <SideNavigationItem
            onClick={onAboutModalOpen}
            icon={<InformationCircleIconOutline className={navItemClass} />}
          >
            About
          </SideNavigationItem>
        </SideNavigationList>
      </SideNavigation>
    </div>
  );
  return content;
};

const mapStateToProps = (state) => ({
  dashboardSettings: getDashboardSettings(state),
  hidden: applicationIsStandalone(state),
  extensions: getDashboardExtensions(state),
  aboutModalOpen: applicationHasAboutModalOpen(state),
  connection: applicationGetConnection(state),
});

const mapDispatchToProps = (dispatch) => ({
  onAboutModalOpen: (_) => dispatch(setAboutModalOpen(true)),
  updateDashboardSetting: (setting, value) => {
    dispatch(updateDashboardSetting(setting, value));
  },
  resetApplication: (_) => {
    dispatch(setWelcomeScreenOpen(true));
    dispatch(setConnected(false));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoDrawer);
