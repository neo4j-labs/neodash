import React from 'react';
import { dottedTruncateString } from '../utils/ReportUtils';
import { Badge, Box, Card, CardContent, Fab, List, ListItem, ListItemText, Tooltip } from '@mui/material';
import { IconButton } from '@neo4j-ndl/react';
import { ExpandIcon, XMarkIconSolid, ChevronUpIconOutline } from '@neo4j-ndl/react/icons';

export default function PageToolBox({ items, onTakeItem, isListOpen, toggleToolBox }) {
  return (
    <Box position='fixed' bottom={16} right={30} zIndex={1}>
      {isListOpen ? (
        <Card variant='outlined' sx={{ minWidth: 275 }}>
          <CardContent>
            <List sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}>
              {items.map((item: { i: React.Key | null | undefined; title: any }, index: number) => (
                <ListItem
                  key={item.i}
                  disableGutters={false}
                  secondaryAction={
                    <IconButton aria-label='maximize' onClick={() => onTakeItem(item)} clean size='medium'>
                      <ExpandIcon />
                    </IconButton>
                  }
                >
                  <Tooltip title={item.title} placement='left' arrow>
                    <ListItemText primary={`${index + 1}. ${dottedTruncateString(item.title, 25)}`} />
                  </Tooltip>
                </ListItem>
              ))}
            </List>
            <IconButton
              aria-label='close'
              danger
              size='extra-small'
              onClick={toggleToolBox}
              style={{
                position: 'absolute',
                top: '-7px',
                right: '-5px',
              }}
            >
              <XMarkIconSolid />
            </IconButton>
          </CardContent>
        </Card>
      ) : (
        <Tooltip title='Minimized reports will appear here' placement='left' arrow>
          <Badge badgeContent={items.length} color='success' max={999}>
            <Fab color='primary' aria-label='up' onClick={toggleToolBox}>
              <IconButton aria-label='up' clean size='extra-small' style={{ color: 'white' }}>
                <ChevronUpIconOutline />
              </IconButton>
            </Fab>
          </Badge>
        </Tooltip>
      )}
    </Box>
  );
}
