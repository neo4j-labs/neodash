import React, { useState } from 'react';
import { connect } from 'react-redux';
import { getDashboardIsEditable, getPageNumber } from '../../settings/SettingsSelectors';
import { getDashboardSettings } from '../DashboardSelectors';
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
} from '@neo4j-ndl/react/icons';

const ResponsiveGridLayout = WidthProvider(Responsive);

/**
 * A component responsible for rendering the sidebar on the left of the screen.
 */
export const NeoDashboardSidebar = () => {
  const [expanded, setOnExpanded] = useState(false);
  const [selected, setSelected] = useState<string | null>('aura-db-instances');
  const handleClick = (item: string) => (e: any) => {
    e.preventDefault();
    setSelected(item);
  };

  const dashboards = [
    1,
    2,
    3,
    4,
    4,
    5,
    6,
    6,
    78,
    8,
    8,
    8,
    8,
    'asdfasjiod aosifmklasl kfdmklsa  dmlkals',
    87,
    8,
    781,
    11,
    8,
    9,
  ];
  return (
    <div>
      <SideNavigation position='left' type='overlay' expanded={expanded} onExpandedChange={setOnExpanded}>
        <SideNavigationList>
          <SideNavigationGroupHeader>
            <div style={{ display: 'inline-block', width: '100%' }}>
              <span style={{ lineHeight: '28px' }}>Dashboards</span>
              <Button
                aria-label={'new dashboard'}
                fill='text'
                size='small'
                color='neutral'
                style={{ float: 'right', marginLeft: '10px' }}
                onClick={() => {}}
              >
                <PlusIconOutline className='btn-icon-base-r' />
              </Button>
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

          {dashboards.map((d) => {
            return (
              <SideNavigationGroupHeader>
                <div style={{ display: 'contents', width: '100%' }}>
                  <Button
                    aria-label={'new dashboard'}
                    fill={d == 5 ? 'outlined' : 'text'}
                    size='medium'
                    color={d == 5 ? 'primary' : 'neutral'}
                    style={{
                      width: '320px',
                      whiteSpace: 'nowrap',
                      overflowX: 'clip',
                      justifyContent: 'left',
                      paddingLeft: '0px',
                    }}
                    onClick={() => {}}
                  >
                    {/* <DocumentChartBarIconOutline className='btn-icon-base-r' /> */}
                    &nbsp; My dashboard {d}
                  </Button>
                  <IconButton
                    aria-label={'new dashboard'}
                    clean
                    size='small'
                    color={'neutral'}
                    style={{
                      justifyContent: 'left',
                      paddingLeft: '0px',
                      marginRight: '10px',
                    }}
                    onClick={() => {}}
                  >
                    <EllipsisVerticalIconOutline
                      style={{ float: 'right', marginRight: '-6px' }}
                      className='btn-icon-base-r'
                    />
                  </IconButton>
                </div>
              </SideNavigationGroupHeader>
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
  editable: getDashboardIsEditable(state),
  dashboardSettings: getDashboardSettings(state),
});

const mapDispatchToProps = (dispatch) => ({
  onRemovePressed: (id) => dispatch(removeReportThunk(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoDashboardSidebar);
