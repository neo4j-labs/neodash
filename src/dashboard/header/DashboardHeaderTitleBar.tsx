import { Toolbar, Badge, InputBase, Tooltip } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { IconButton } from '@neo4j-ndl/react';
import { CameraIconSolid } from '@neo4j-ndl/react/icons';
import {
  APPLY_CUSTOM_BRAND_LOGO,
  DASHBOARD_BUTTON_IMAGE,
  DASHBOARD_BUTTON_IMAGE_SIZE,
  DASHBOARD_HEADER_BRAND_LOGO,
  DASHBOARD_HEADER_COLOR,
  DASHBOARD_HEADER_BUTTON_COLOR,
  DASHBOARD_HEADER_TITLE_COLOR,
} from '../../config/ApplicationConfig';
import StyleConfig from '../../config/StyleConfig';

await StyleConfig.getInstance();

const brandedToolbarContent = (
  <img style={{ height: '54px', marginLeft: 'auto', marginRight: 'auto' }} src={DASHBOARD_HEADER_BRAND_LOGO} />
);

export const NeoDashboardHeaderTitleBar = ({
  dashboardTitle,
  downloadImageEnabled,
  onDownloadImage,
  setDashboardTitle,
  editable,
}) => {
  const [dashboardTitleText, setDashboardTitleText] = React.useState(dashboardTitle);
  const debouncedDashboardTitleUpdate = useCallback(debounce(setDashboardTitle, 250), []);

  useEffect(() => {
    // Reset text to the dashboard state when the page gets reorganized.
    if (dashboardTitle !== dashboardTitleText) {
      setDashboardTitleText(dashboardTitle);
    }
  }, [dashboardTitle]);

  const content = (
    <Toolbar
      key={1}
      style={{ paddingLeft: 88, paddingRight: 24, minHeight: '64px', background: DASHBOARD_HEADER_COLOR, zIndex: 1000 }}
    >
      {APPLY_CUSTOM_BRAND_LOGO ? brandedToolbarContent : <></>}
      <InputBase
        id='center-aligned'
        style={{
          textAlign: 'center',
          fontSize: '22px',
          flexGrow: 1,
          color: DASHBOARD_HEADER_TITLE_COLOR,
          fontWeight: 'bold',
        }}
        placeholder='Dashboard Name...'
        fullWidth
        maxRows={4}
        value={dashboardTitleText}
        onChange={(event) => {
          if (editable) {
            setDashboardTitleText(event.target.value);
            debouncedDashboardTitleUpdate(event.target.value);
          }
        }}
      />
      {downloadImageEnabled ? (
        <Tooltip title={'Download Dashboard as Image'}>
          <IconButton
            aria-label={'camera'}
            style={{ marginRight: '3px', background: DASHBOARD_HEADER_BUTTON_COLOR }}
            onClick={() => onDownloadImage()}
            size='large'
            clean
          >
            <CameraIconSolid className='n-text-light-neutral-bg-weak' aria-label={'camera icon'} />
          </IconButton>
        </Tooltip>
      ) : (
        <></>
      )}

      {/* <Tooltip
        title={`${connection.protocol}://${connection.url}:${connection.port}`}
        placement='left'
        aria-label='host'
      >
        <IconButton
          className='logo-btn'
          aria-label={'connection '}
          style={{ background: DASHBOARD_HEADER_BUTTON_COLOR, padding: '3px' }}
          onClick={() => {
            if (!standalone) {
              onConnectionModalOpen();
            }
          }}
          size='large'
          clean
        ></IconButton>
      </Tooltip> */}
    </Toolbar>
  );
  return content;
};

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NeoDashboardHeaderTitleBar);
