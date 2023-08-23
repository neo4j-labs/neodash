import React, { useContext, useState } from 'react';
import { connect } from 'react-redux';
import { getDashboardIsEditable, getPageNumber } from '../../settings/SettingsSelectors';
import { getDashboardSettings, getDashboardTitle } from '../DashboardSelectors';
import { Button, SideNavigation, SideNavigationGroupHeader, SideNavigationList, TextInput } from '@neo4j-ndl/react';
import { removeReportThunk } from '../../page/PageThunks';
import { PlusIconOutline, MagnifyingGlassIconOutline, CircleStackIconOutline } from '@neo4j-ndl/react/icons';
import Tooltip from '@mui/material/Tooltip';
import { DashboardSidebarListItem } from './DashboardSidebarListItem';
import { applicationGetConnectionDatabase, dashboardIsDraft } from '../../application/ApplicationSelectors';
import { setDraft } from '../../application/ApplicationActions';
import NeoDashboardSidebarLoadModal from './DashboardSidebarLoadModal';
import { resetDashboardState } from '../DashboardActions';
import NeoDashboardSidebarCreateModal from './DashboardSidebarCreateModal';
import NeoDashboardSidebarDatabaseMenu from './DashboardSidebarDatabaseMenu';
import NeoDashboardSidebarDashboardMenu from './DashboardSidebarDashboardMenu';
import { loadDatabaseListFromNeo4jThunk } from '../DashboardThunks';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';

enum Menu {
  DASHBOARD,
  DATABASE,
  NONE,
}

/**
 * A component responsible for rendering the sidebar on the left of the screen.
 */
export const NeoDashboardSidebar = ({
  database,
  title,
  draft,
  setDraft,
  resetLocalDashboard,
  loadDatabaseListFromNeo4j,
}) => {
  const { driver } = useContext<Neo4jContextState>(Neo4jContext);
  const [expanded, setOnExpanded] = useState(false);
  const [selectedDashboardIndex, setSelectedDashboardIndex] = React.useState(-1);
  const [dashboardDatabase, setDashboardDatabase] = React.useState(database);
  const [databases, setDatabases] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loadModelOpen, setLoadModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(Menu.NONE);

  const [dashboards, setDashboards] = React.useState([
    {
      uuid: '123',
      title: 'Revenue streams 2024',
    },
    {
      uuid: '456',
      title: 'Human resources dashboard',
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
          <NeoDashboardSidebarDatabaseMenu
            databases={databases}
            selected={dashboardDatabase}
            setSelected={setDashboardDatabase}
            open={menuOpen == Menu.DATABASE}
            anchorEl={menuAnchor}
            handleClose={() => {
              setMenuOpen(Menu.NONE);
              setMenuAnchor(null);
            }}
          />
          <NeoDashboardSidebarDashboardMenu
            open={menuOpen == Menu.DASHBOARD}
            anchorEl={menuAnchor}
            handleClose={() => {
              setMenuOpen(Menu.NONE);
              setMenuAnchor(null);
            }}
          />

          <SideNavigationGroupHeader>
            <div style={{ display: 'inline-block', width: '100%' }}>
              <span className='n-text-palette-neutral-text-weak' style={{ lineHeight: '28px' }}>
                Dashboards
              </span>

              <Tooltip title='Database' aria-label='database' disableInteractive>
                <Button
                  aria-label={'settings'}
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
                  onClick={(event) => {
                    setMenuOpen(Menu.DATABASE);
                    // Only when not yet retrieved, and needed, get the list of databases from Neo4j.
                    if (databases.length == 0) {
                      loadDatabaseListFromNeo4j(driver, (result) => {
                        setDatabases(result);
                      });
                    }
                    setMenuAnchor(event.currentTarget);
                  }}
                >
                  <CircleStackIconOutline className='btn-icon-base-r' />
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
          <SideNavigationGroupHeader style={{ marginBottom: '10px' }}>
            <TextInput
              fluid
              size='small'
              leftIcon={<MagnifyingGlassIconOutline style={{ height: 16, marginTop: '2px' }} />}
              className='n-w-full n-mr-2'
              placeholder='Search...'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
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
          {dashboards
            .filter((d) => d.title.toLowerCase().includes(searchText.toLowerCase()))
            .map((d, index) => {
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
                  onSettingsOpen={(event) => {
                    setMenuOpen(Menu.DASHBOARD);
                    setMenuAnchor(event.currentTarget);
                  }}
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
  database: applicationGetConnectionDatabase(state),
});

const mapDispatchToProps = (dispatch) => ({
  onRemovePressed: (id) => dispatch(removeReportThunk(id)),
  resetLocalDashboard: () => dispatch(resetDashboardState()),
  setDraft: (draft) => dispatch(setDraft(draft)),
  loadDatabaseListFromNeo4j: (driver, callback) => dispatch(loadDatabaseListFromNeo4jThunk(driver, callback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoDashboardSidebar);
