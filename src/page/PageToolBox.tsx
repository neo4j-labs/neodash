import React from 'react';
import { dottedTruncateString } from '../utils/ReportUtils';
import {
  Badge,
  Box,
  Card,
  CardContent,
  Fab,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  IconButton as MIconButton,
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@neo4j-ndl/react';
import { ExpandIcon } from '@neo4j-ndl/react/icons';

export default function PageToolBox({ items, onTakeItem, isListOpen, handleButtonClick }) {
  return (
    <Box position='fixed' bottom={16} right={30} zIndex={1}>
      {!isListOpen && (
        <Tooltip title='Minimized reports will appear here' placement='left' arrow>
          <Badge badgeContent={items.length} color='success' max={999}>
            <Fab color='primary' aria-label='up' onClick={handleButtonClick}>
              <KeyboardArrowUpIcon />
            </Fab>
          </Badge>
        </Tooltip>
      )}
      {isListOpen && (
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
            <MIconButton
              aria-label='close'
              color='primary'
              onClick={handleButtonClick}
              style={{
                position: 'absolute',
                top: '-7px',
                right: '-5px',
              }}
            >
              <CloseIcon />
            </MIconButton>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
