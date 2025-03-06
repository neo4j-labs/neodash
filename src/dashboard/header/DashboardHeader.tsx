import React, { useContext, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setDashboardTitle } from '../DashboardActions';
import { getDashboardSettings, getDashboardTheme, getDashboardTitle, getPages } from '../DashboardSelectors';
import { setConnectionModalOpen } from '../../application/ApplicationActions';
import { applicationGetStandaloneSettings, applicationGetCustomHeader } from '../../application/ApplicationSelectors';
import { getDashboardIsEditable, getPageNumber } from '../../settings/SettingsSelectors';
import { NeoDashboardHeaderLogo } from './DashboardHeaderLogo';
import NeoAboutButton from './DashboardHeaderAboutButton';
import { NeoLogoutButton } from './DashboardHeaderLogoutButton';
import { NeoDashboardHeaderDownloadImageButton } from './DashboardHeaderDownloadImageButton';
import { updateDashboardSetting } from '../../settings/SettingsActions';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { DASHBOARD_HEADER_BUTTON_COLOR } from '../../config/ApplicationConfig';
import { Tooltip } from '@mui/material';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { Button } from '@neo4j-ndl/react';
import { CircleStackIconOutline } from '@neo4j-ndl/react/icons';
import { loadDatabaseListFromNeo4jThunk } from '../DashboardThunks';
import NeoDashboardSidebarDatabaseMenu from '../sidebar/menu/DashboardSidebarDatabaseMenu';

// Which (small) pop-up menu is currently open for the sidebar.
enum Menu {
  DATABASE = 0,
  NONE = 1,
}

export const NeoDashboardHeader = ({
  database,
  standaloneSettings,
  dashboardTitle,
  customHeader,
  connection,
  settings,
  onConnectionModalOpen,
  onDownloadImage,
  onAboutModalOpen,
  resetApplication,
  themeMode,
  setTheme,
  loadDatabaseListFromNeo4j,
  readonly,
}) => {
  const downloadImageEnabled = settings ? settings.downloadImageEnabled : false;
  const [dashboardTitleText, setDashboardTitleText] = React.useState(dashboardTitle);
  const [databases, setDatabases] = useState([]);
  const [menuOpen, setMenuOpen] = useState(Menu.NONE);
  const [isDarkMode, setDarkMode] = React.useState(themeMode !== 'light');
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [dataDatabase, setDataDatabase] = React.useState(database ? database : 'neo4j');
  const { driver } = useContext<Neo4jContextState>(Neo4jContext);

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
  };

  useEffect(() => {
    // Reset text to the dashboard state when the page gets reorganized.
    if (dashboardTitle !== dashboardTitleText) {
      setDashboardTitleText(dashboardTitle);
    }
  }, [dashboardTitle]);

  useEffect(() => {
    setTheme(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);
  const content = (
    <div className='n-relative n-bg-palette-neutral-bg-weak n-w-full'>
      <div className='n-min-w-full'>
        <div className='n-flex n-justify-between n-h-16 n-items-center n-py-6 md:n-justify-start md:n-space-x-10 n-mx-4'>
          <NeoDashboardHeaderLogo resetApplication={resetApplication} />
          <nav className='n-items-center n-justify-center n-flex n-flex-1 n-w-full n-font-semibold'>
            {customHeader && customHeader.length > 0
              ? `${customHeader}`
              : `${connection.protocol}://${connection.url}:${connection.port}`}
          </nav>
          <div className='sm:n-flex n-items-center n-justify-end md:n-flex-1 lg:n-w-0 n-gap-6'>
            <div className='n-flex n-flex-row n-gap-x-2'>
              <Tooltip title={'Change Theme'} disableInteractive>
                <div>
                  <DarkModeSwitch
                    className={'ndl-icon-btn n-p-2 ndl-large ndl-clean'}
                    style={{}}
                    checked={isDarkMode}
                    onChange={toggleDarkMode}
                    size={24}
                    sunColor={DASHBOARD_HEADER_BUTTON_COLOR || '#000000'}
                    moonColor={'#ff0000'}
                  />
                </div>
              </Tooltip>
              <Tooltip title='Database' aria-label='database' disableInteractive>
                <Button
                  aria-label={'settings'}
                  fill='text'
                  size='large'
                  color='neutral'
                  style={{
                    float: 'right',
                    marginLeft: '0px',
                    marginRight: '0px',
                    paddingLeft: '12px',
                    paddingRight: '12px',
                  }}
                  onClick={(event) => {
                    setMenuOpen(Menu.DATABASE);
                    // Only when not yet retrieved, and needed, get the list of databases from Neo4j.
                    if (databases.length == 0) {
                      loadDatabaseListFromNeo4j(driver, (result) => {
                        if (
                          readonly &&
                          standaloneSettings.standaloneMultiDatabase &&
                          standaloneSettings.standaloneDatabaseList
                        ) {
                          let tmp = standaloneSettings.standaloneDatabaseList.split(',').map((x) => x.trim());
                          result = result.filter((value) => tmp.includes(value));
                        }
                        setDatabases(result);
                      });
                    }
                    setMenuAnchor(event.currentTarget);
                  }}
                >
                  <CircleStackIconOutline className='btn-icon-base-r' />
                </Button>
              </Tooltip>

              {downloadImageEnabled && <NeoDashboardHeaderDownloadImageButton onDownloadImage={onDownloadImage} />}
              <NeoAboutButton connection={connection} onAboutModalOpen={onAboutModalOpen} />
              <NeoLogoutButton standaloneSettings={standaloneSettings} onConnectionModalOpen={onConnectionModalOpen} />
            </div>
          </div>
        </div>
      </div>
      <NeoDashboardSidebarDatabaseMenu
        databases={databases}
        selected={dataDatabase}
        setSelected={(newDatabase) => {
          setDataDatabase(newDatabase);
        }}
        open={menuOpen == Menu.DATABASE}
        anchorEl={menuAnchor}
        handleClose={() => {
          setMenuOpen(Menu.NONE);
          setMenuAnchor(null);
        }}
      />
    </div>
  );
  return content;
};

const mapStateToProps = (state) => ({
  dashboardTitle: getDashboardTitle(state),
  standaloneSettings: applicationGetStandaloneSettings(state),
  customHeader: applicationGetCustomHeader(state),
  pages: getPages(state),
  settings: getDashboardSettings(state),
  editable: getDashboardIsEditable(state),
  pagenumber: getPageNumber(state),
  themeMode: getDashboardTheme(state),
});

const mapDispatchToProps = (dispatch) => ({
  setDashboardTitle: (title: any) => {
    dispatch(setDashboardTitle(title));
  },

  setTheme: (theme: string) => {
    dispatch(updateDashboardSetting('theme', theme));
  },

  onConnectionModalOpen: () => {
    dispatch(setConnectionModalOpen(true));
  },

  loadDatabaseListFromNeo4j: (driver, callback) => {
    dispatch(loadDatabaseListFromNeo4jThunk(driver, callback))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoDashboardHeader);
