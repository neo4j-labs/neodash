import { Drawer, ListItem, List, Collapse, IconButton, Tooltip } from '@material-ui/core';
import React from 'react';
import Card from '@material-ui/core/Card';
import MoreVertIcon from '@material-ui/icons/MoreVert';

// The sidebar that appears on the left side of the dashboard.
export const AlertDrawer = () => {
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const settingsButton = (
    <Tooltip title='Settings' aria-label='settings'>
      <IconButton aria-label='settings' onClick={() => setSettingsOpen(!settingsOpen)}>
        <MoreVertIcon />
      </IconButton>
    </Tooltip>
  );
  const content = (
    <Drawer
      variant='permanent'
      style={{
        position: 'relative',
        overflowX: 'hidden',
        width: '240px',
        transition: 'width 125ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
        boxShadow: '2px 1px 10px 0px rgb(0 0 0 / 12%)',
        height: '800px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          overflowX: 'hidden',
          justifyContent: 'flex-end',
          padding: '0 8px',
          minHeight: '64px',
        }}
      ></div>
      {settingsButton}
      <Collapse disableStrictModeCompat in={!settingsOpen} timeout={'auto'} style={{ height: '100%' }}>
        <List>
          {[...Array(10).keys()].map((_value) => {
            return (
              <ListItem>
                <Card style={{ height: '120px' }}>
                  {
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elit'
                  }
                </Card>
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </Drawer>
  );
  return content;
};

export default AlertDrawer;
