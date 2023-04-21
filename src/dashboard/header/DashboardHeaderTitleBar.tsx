import { Toolbar, Badge, InputBase, Tooltip } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import { IconButton } from '@neo4j-ndl/react';
import { CameraIconSolid } from '@neo4j-ndl/react/icons';

export const NeoDashboardHeaderTitleBar = ({
  dashboardTitle,
  downloadImageEnabled,
  onDownloadImage,
  setDashboardTitle,
  connection,
  editable,
  standalone,
  onConnectionModalOpen,
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
      className='n-bg-primary-70'
      style={{ paddingLeft: 88, paddingRight: 24, minHeight: '64px', zIndex: 1000 }}
    >
      <InputBase
        id='center-aligned'
        style={{ textAlign: 'center', fontSize: '22px', flexGrow: 1, color: 'white' }}
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
            style={{ marginRight: '3px', background: '#ffffff22' }}
            onClick={() => onDownloadImage()}
            size='large'
            clean
          >
            <CameraIconSolid className='n-text-light-neutral-bg-weak' />
          </IconButton>
        </Tooltip>
      ) : (
        <></>
      )}

      <Tooltip
        title={`${connection.protocol}://${connection.url}:${connection.port}`}
        placement='left'
        aria-label='host'
      >
        <IconButton
          className='logo-btn'
          style={{ background: '#ffffff22', padding: '3px' }}
          onClick={() => {
            if (!standalone) {
              onConnectionModalOpen();
            }
          }}
          size='large'
          clean
        >
          <img src='neo4j-icon.png' />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
  return content;
};

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NeoDashboardHeaderTitleBar);
