import React, { useState } from 'react';
import { connect } from 'react-redux';
import { getDashboardIsEditable, getPageNumber } from '../../settings/SettingsSelectors';
import { getDashboardSettings, getDashboardTitle } from '../DashboardSelectors';
import { Responsive, WidthProvider } from 'react-grid-layout';
import {
  Button,
  IconButton,
  SideNavigation,
  SideNavigationGroupHeader,
  SideNavigationItem,
  SideNavigationList,
  TextInput,
} from '@neo4j-ndl/react';
import { removeReportThunk } from '../../page/PageThunks';
import {
  PlusIconOutline,
  MagnifyingGlassIconOutline,
  DocumentChartBarIconOutline,
  InformationCircleIconOutline,
  EllipsisVerticalIconOutline,
  Cog6ToothIconOutline,
} from '@neo4j-ndl/react/icons';
import Tooltip from '@mui/material/Tooltip';
import { DashboardSidebarListItem } from './DashboardSidebarListItem';
import { dashboardIsDraft } from '../../application/ApplicationSelectors';
import { setDraft } from '../../application/ApplicationActions';
import NeoDashboardSidebarLoadModal from './DashboardSidebarLoadModal';
import { resetDashboardState } from '../DashboardActions';
import NeoDashboardSidebarCreateModal from './DashboardSidebarCreateModal';

/**
 * A component responsible for rendering the sidebar on the left of the screen.
 */
export const NeoDashboardSidebar = ({ title, draft, setDraft, resetLocalDashboard }) => {
  const [expanded, setOnExpanded] = useState(false);
  const [selectedDashboardIndex, setSelectedDashboardIndex] = React.useState(-1);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loadModelOpen, setLoadModalOpen] = useState(false);
  const [dashboards, setDashboards] = React.useState([
    {
      uuid: '123',
      title: 'asdfasjiod aosifmklasl kfdmklsa  dmlkals',
    },
    {
      uuid: '456',
      title: 'sdflk asldakmsd axassv',
    },
  ]);

  const getDashboardListFromNeo4j = (database: string) => {
    // Retrieves list of all dashboards stored in a given database.
    return [{ uuid: database }];
  };

  function loadDashboard(uuid) {
    // Trigger dashboard load.
    // TODO - call Neo4j to get the dashboard.

    // Re-retrieve list of dashboards.
    const loadedDashboards: object[] = getDashboardListFromNeo4j('neo4j');
    // Set `selectedDashboardIndex` to the one that was just created.
    const selectedDashboardIndex = loadedDashboards.find((o) => o.uuid === uuid);
    setDashboards(loadedDashboards);
  }

  function createDashboard() {
    // Creates new dashboard in draft state (not yet saved to Neo4j)
    resetLocalDashboard();
    setDraft(true);
  }

  return (
    <div>
      <NeoDashboardSidebarLoadModal
        open={loadModelOpen}
        onConfirm={() => {
          setLoadModalOpen(true);
          // TODO - load
          setDraft(false);
        }}
        handleClose={() => setLoadModalOpen(false)}
      />

      <NeoDashboardSidebarCreateModal
        open={createModalOpen}
        onConfirm={() => {
          setCreateModalOpen(false);
          createDashboard();
        }}
        handleClose={() => setCreateModalOpen(false)}
      />

      <SideNavigation
        position='left'
        type='overlay'
        expanded={expanded}
        onExpandedChange={(open) => {
          setOnExpanded(open);
          // Wait until the sidebar has fully opened. Then trigger a resize event to align the grid layout.
          const timeout = setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
          }, 300);
        }}
      >
        <SideNavigationList>
          <SideNavigationGroupHeader>
            <div style={{ display: 'inline-block', width: '100%' }}>
              <span style={{ lineHeight: '28px' }}>Dashboards</span>
              <Tooltip title='Settings' aria-label='settings' disableInteractive>
                <Button
                  aria-label={'new dashboard'}
                  fill='text'
                  size='small'
                  color='neutral'
                  style={{
                    float: 'right',
                    marginLeft: '0px',
                    marginRight: '12px',
                    paddingLeft: 0,
                    paddingRight: '3px',
                  }}
                  onClick={() => {}}
                >
                  <Cog6ToothIconOutline className='btn-icon-base-r' />
                </Button>
              </Tooltip>
              <Tooltip title='Create' aria-label='create' disableInteractive>
                <Button
                  aria-label={'new dashboard'}
                  fill='text'
                  size='small'
                  color='neutral'
                  style={{ float: 'right', marginLeft: '0px', marginRight: '5px', paddingLeft: 0, paddingRight: '3px' }}
                  onClick={() => {
                    if (draft) {
                      setCreateModalOpen(true);
                    } else {
                      createDashboard();
                    }
                  }}
                >
                  <PlusIconOutline className='btn-icon-base-r' />
                </Button>
              </Tooltip>
            </div>
          </SideNavigationGroupHeader>
        </SideNavigationList>
        <SideNavigationList>
          <SideNavigationGroupHeader>
            <TextInput
              fluid
              // label="Dashboards"
              size='small'
              leftIcon={<MagnifyingGlassIconOutline style={{ height: 16, marginTop: '2px' }} />}
              className='n-w-full n-mr-2'
              placeholder='Search...'
            />
          </SideNavigationGroupHeader>

          {draft ? (
            <DashboardSidebarListItem
              selected={draft}
              title={title}
              saved={false}
              onSelect={() => {}}
              onSave={() => setDraft(false)}
            />
          ) : (
            <></>
          )}
          {dashboards.map((d, index) => {
            return (
              <DashboardSidebarListItem
                selected={!draft && selectedDashboardIndex == index}
                title={d.title}
                saved={true}
                onSelect={() => {
                  setSelectedDashboardIndex(index);
                  if (draft) {
                    setLoadModalOpen(true);
                  } else {
                    // TODO - trigger load
                  }
                }}
                onSave={() => {}}
              />
            );
          })}
        </SideNavigationList>
      </SideNavigation>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isLoaded: true,
  pagenumber: getPageNumber(state),
  title: getDashboardTitle(state),
  editable: getDashboardIsEditable(state),
  draft: dashboardIsDraft(state),
  dashboardSettings: getDashboardSettings(state),
});

const mapDispatchToProps = (dispatch) => ({
  onRemovePressed: (id) => dispatch(removeReportThunk(id)),
  resetLocalDashboard: () => dispatch(resetDashboardState()),
  setDraft: (draft) => dispatch(setDraft(draft)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoDashboardSidebar);
