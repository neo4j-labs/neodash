import React from 'react';
import { Box, Button, List, ListItem, ListItemText, Popover, Tooltip, Typography } from '@mui/material';
import { GraphChartVisualizationProps } from '../../GraphChartVisualization';
import { IconButton } from '@neo4j-ndl/react';
import { CircleIcon, QueueListIconSolid } from '@neo4j-ndl/react/icons';
import { ArrowForwardRounded } from '@mui/icons-material';

/**
 * Renders an icon on the bottom-right of the graph visualization to fit the current graph to the user's view.
 */
export const NeoGraphChartLegendButton = (props: GraphChartVisualizationProps) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const [legendOpen, setLegendOpen] = React.useState(false);
  const [legendEnabled, setLegendEnabled] = React.useState(false);
  const [legendEntries, setLegendEntries] = React.useState(props.data.legendDefinition);

  React.useEffect(() => {
    let legendEntryList: object[] = [];

    Object.values(props.data.legendDefinition).forEach((legendDefinition) => {
      if (legendDefinition.enabled === true && legendDefinition.entries.length > 0) {
        setLegendEnabled(true);
        legendDefinition.entries.forEach((entry) => legendEntryList.push(entry));
      }
      setLegendEntries(legendEntryList);
    });
  }, [props.data.legendDefinition]);

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
      <List dense={true} disablePadding={true}>
        {legendEntries.map((entry) => {
          return (
            <ListItem
              alignItems='center'
              disablePadding={true}
              disableGutters={true}
              style={{ marginLeft: '0.2rem', marginRight: '0.5rem' }}
            >
              <Typography
                padding-left='0.5rem'
                variant='h4'
                sx={{
                  width: '1.5rem',
                  display: entry.type === 'node' ? 'flex' : 'none',
                  alignItems: 'center',
                }}
              >
                <CircleIcon color={entry.color} />
              </Typography>
              <Typography
                padding-left='0.5rem'
                variant='h4'
                sx={{ width: '1.5rem', display: entry.type === 'edge' ? 'flex' : 'none', alignItems: 'center' }}
              >
                <ArrowForwardRounded htmlColor={entry.color} />
              </Typography>
              <ListItemText
                sx={{ paddingLeft: '0.5rem' }}
                primary={entry.meaning}
                primaryTypographyProps={{
                  color: entry.textColor,
                }}
              />
              <ListItemText
                secondary={`(${entry.type})`}
                secondaryTypographyProps={{
                  color: entry.textColor,
                  display: 'inline',
                  variant: 'body2',
                }}
              />
              {/* <Box
                component='span'
                sx={{
                  p: 2,
                  backgroundColor: entry.color,
                  padding: 0,
                  margin: 0,
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
              </Box>*/}
            </ListItem>
          );
        })}
      </List>
    ) : (
      <></>
    );
  };
  return (
    <>
      <IconButton
        aria-label='show legend'
        size='small'
        clean
        grouped
        onClick={handleClick}
        style={{ display: !legendEnabled ? 'none' : '', position: 'absolute', zIndex: '50' }}
      >
        <Tooltip title='Show legend' aria-label={'show Legend'}>
          <QueueListIconSolid />
        </Tooltip>
      </IconButton>
      {/* <Button
        color='primary'
        size='small'
        onClick={handleClick}
        style={{ display: !legendEnabled ? 'none' : '', position: 'absolute', marginTop: '0px', zIndex: '50' }}
      >
        <Tooltip title='Show legend' aria-label={'show Legend'}>
          <Box
            sx={{
              paddingRight: '2pt',
              paddingLeft: '2pt',
              borderColor: '#EAECEE',
              borderWidth: '1pt',
              typography: 'subtitle2',
              textTransform: 'capitalize',
            }}
          >
            Legend
          </Box>
        </Tooltip>
      </Button> */}
      <Popover
        open={legendOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography
          align='center'
          variant='subtitle2'
          gutterBottom={false}
          sx={{
            p: 1,
            padding: 0,
            marginTop: '0.2rem',
            fontWeight: 'bold',
          }}
        >
          LEGEND
        </Typography>
        {getNodeLegend(legendEntries)}
      </Popover>
    </>
  );
};
