import React, { useState } from 'react';
import { connect } from 'react-redux';
import { getDashboardIsEditable, getPageNumber } from '../../settings/SettingsSelectors';
import { getDashboardSettings } from '../DashboardSelectors';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { SideNavigation, SideNavigationGroupHeader, SideNavigationItem, SideNavigationList } from '@neo4j-ndl/react';
import { removeReportThunk } from '../../page/PageThunks';

const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * A component responsible for rendering the sidebar on the left of the screen.
 */
export const NeoDashboardSidebar = () => {
  const [expanded, setOnExpanded] = useState(true);
  const [selected, setSelected] = useState<string | null>('aura-db-instances');
  const handleClick = (item: string) => (e: any) => {
    e.preventDefault();
    setSelected(item);
  };
  return (
    <div
      style={{
        height: 'calc(40vh - 32px)',
        minHeight: '700px',
        display: 'flex',
      }}
    >
      <SideNavigation position='left' expanded={expanded} onExpandedChange={setOnExpanded}>
        <SideNavigationList>
          <SideNavigationGroupHeader>AuraDB</SideNavigationGroupHeader>
          <SideNavigationItem
            href='#'
            onClick={handleClick('aura-db-instances')}
            selected={selected === 'aura-db-instances'}
          >
            Instances
          </SideNavigationItem>
          <SideNavigationItem
            href='#'
            onClick={handleClick('aura-db-connect')}
            selected={selected === 'aura-db-connect'}
          >
            Connect
          </SideNavigationItem>
          <SideNavigationList>
            <SideNavigationItem
              href='#'
              onClick={handleClick('aura-db-python')}
              selected={selected === 'aura-db-python'}
            >
              Python
            </SideNavigationItem>
            <SideNavigationItem
              href='#'
              onClick={handleClick('aura-db-javascript')}
              selected={selected === 'aura-db-javascript'}
            >
              JavaScript
            </SideNavigationItem>
          </SideNavigationList>
          <SideNavigationGroupHeader>AuraDS</SideNavigationGroupHeader>
          <SideNavigationList>
            <SideNavigationItem
              href='#'
              onClick={handleClick('aura-ds-instances')}
              selected={selected === 'aura-ds-instances'}
            >
              Instances
            </SideNavigationItem>
            <SideNavigationItem
              href='#'
              onClick={handleClick('aura-ds-getting-started')}
              selected={selected === 'aura-ds-getting-started'}
            >
              Getting Started
            </SideNavigationItem>
          </SideNavigationList>
        </SideNavigationList>
      </SideNavigation>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isLoaded: true,
  pagenumber: getPageNumber(state),
  editable: getDashboardIsEditable(state),
  dashboardSettings: getDashboardSettings(state),
});

const mapDispatchToProps = (dispatch) => ({
  onRemovePressed: (id) => dispatch(removeReportThunk(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoDashboardSidebar);
