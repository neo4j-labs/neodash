import { Toolbar, IconButton, Badge, InputBase, Tooltip } from '@material-ui/core';
import React, { useCallback, useEffect } from 'react';
import MenuIcon from '@material-ui/icons/Menu';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import ImageIcon from '@material-ui/icons/Image';

export const NeoDashboardHeaderTitleBar = ({
  dashboardTitle,
  downloadImageEnabled,
  onDownloadImage,
  open,
  setDashboardTitle,
  connection,
  editable,
  standalone,
  handleDrawerOpen,
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
    <Toolbar key={1} style={{ paddingRight: 24, minHeight: '64px', background: '#0B297D', zIndex: 1201 }}>
      {!standalone ? (
        <IconButton
          edge='start'
          color='inherit'
          aria-label='open drawer'
          onClick={handleDrawerOpen}
          style={
            open
              ? {
                  display: 'none',
                }
              : {
                  marginRight: 36,
                  marginLeft: -19,
                }
          }
        >
          <MenuIcon />
        </IconButton>
      ) : (
        <></>
      )}
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
            style={{ background: '#ffffff22', padding: '3px', marginRight: '3px' }}
            onClick={() => onDownloadImage()}
          >
            <ImageIcon
              style={{ padding: 6, color: '#ffffffdd', width: '36px', height: '36px', fontSize: '1.3rem', zIndex: 5 }}
              fontSize='small'
            ></ImageIcon>
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
          style={{ background: '#ffffff22', padding: '3px' }}
          onClick={() => {
            if (!standalone) {
              onConnectionModalOpen();
            }
          }}
        >
          <Badge badgeContent={''}>
            <img style={{ width: '36px', height: '36px' }} src='neo4j-icon.png' />
          </Badge>
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
  return content;
};

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NeoDashboardHeaderTitleBar);
