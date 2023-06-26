import React from 'react';
import { Box, Chip, Icon, List, ListItem, ListItemText, Popover, Stack, Tooltip, Typography } from '@mui/material';
import { GraphChartVisualizationProps } from '../../GraphChartVisualization';
import { IconButton } from '@neo4j-ndl/react';
import { CircleIcon, QueueListIconSolid } from '@neo4j-ndl/react/icons';

/**
 * Renders an icon on the bottom-right of the graph visualization to fit the current graph to the user's view.
 */
export const NeoGraphChartLegendButton = (props: GraphChartVisualizationProps) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const [legendOpen, setLegendOpen] = React.useState(false);

  const [legendEntries, setLegendEntries] = React.useState(props.data.legendDefinition);

  React.useEffect(() => {
    let legendEntryList = [];

    Object.values(props.data.legendDefinition).forEach((legendDefinition) => {
      if (legendDefinition.enabled === true) {
        legendDefinition.entries.forEach((entry) => {
          legendEntryList.push(entry);
        });
      }
      setLegendEntries(legendEntryList);
    });
  }, [props.data.legendDefinition]);
  // React.useEffect(() => {
  //   let legendEntryList = [];
  //   if (props.data.legendDefinition.enabled) {
  //     props.data.legendDefinition.entries.forEach((entry) => {
  //       legendEntryList.push(entry.meaning);
  //     });
  //     setLegendEntries(legendEntryList);
  //   }
  // }, [props.data.legendDefinition]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setLegendOpen(!legendOpen);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setLegendOpen(false);
  };

  const getNodeLegend = (legendEntries) => {
    return legendEntries.length > 0 ? (
      <List>
        {legendEntries.map((entry) => {
          return (
            <ListItem>
              <Box
                component='span'
                sx={{
                  p: 2,
                  backgroundColor: entry.color,
                }}
              >
                <ListItemText
                  primary={entry.meaning}
                  primaryTypographyProps={{
                    color: entry.textColor,
                  }}
                  secondary={`(${entry.type})`}
                  secondaryTypographyProps={{
                    color: entry.textColor,
                  }}
                ></ListItemText>
              </Box>
              {/* <Stack direction='row' spacing='1pt'>
                <ListItemText primary={entry.meaning} secondary={entry.type}></ListItemText>
                <Icon>
                  <CircleIcon color={entry.color} />
                </Icon>
              </Stack> */}
            </ListItem>
          );
        })}
      </List>
    ) : (
      <></>
    );
  };
  return (
    <Tooltip title='Show legend' aria-label={'show legend'}>
      <>
        <IconButton aria-label='show legend' size='small' clean grouped onClick={handleClick}>
          <QueueListIconSolid />
        </IconButton>
        <Popover
          open={legendOpen}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Typography sx={{ p: 1 }}>LEGEND</Typography>
          {getNodeLegend(legendEntries)}
        </Popover>
      </>
    </Tooltip>
  );
};
