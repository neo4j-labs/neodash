import { GraphChartVisualizationProps } from '../GraphChartVisualization';
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import ReactDOMServer from 'react-dom/server';
import { mutateName } from '../../ChartUtils';
import { Avatar, Badge, Card, CardHeader, IconButton } from '@material-ui/core';
import { Fab, MenuItem, TextField, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import TuneIcon from '@material-ui/icons/Tune';
import { Autocomplete } from '@material-ui/lab';
import { NestedMenuItem, IconMenuItem } from 'mui-nested-menu';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import PlayArrow from '@material-ui/icons/PlayArrow';
import {
  FormControl,
  InputLabel,
  ListItem,
  ListItemIcon,
  ListItemText,
  Select,
  TextareaAutosize,
} from '@material-ui/core';

interface ExtendedGraphChartVisualizationProps extends GraphChartVisualizationProps {
  selectedNode: any;
  dialogOpen: any;
  setDialogOpen: any;
}

export const GraphChartCreateModal = (props: ExtendedGraphChartVisualizationProps) => {
  const [properties, setProperties] = React.useState([{ name: '', value: '' }]);
  const [relTypes, setRelTypes] = React.useState(['IN_LOCATION', 'HAS_ENTITY', 'RELATED_TO', 'HAS_ALERT']);
  const [relType, setRelType] = React.useState(undefined);
  return (
    <Dialog
      maxWidth={'lg'}
      open={props.dialogOpen}
      onClose={() => {
        props.setDialogOpen(false);
      }}
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>
        Create a Relationship
        <IconButton
          onClick={() => {
            props.interactivity.setContextMenuOpen(false);
            props.setDialogOpen(false);
            setProperties([{ name: '', value: '' }]);
          }}
          style={{ marginLeft: '40px', padding: '3px', float: 'right' }}
        >
          <Badge overlap='rectangular' badgeContent={''}>
            <CloseIcon />
          </Badge>
        </IconButton>
      </DialogTitle>

      <DialogContent style={{ minWidth: '300px' }}>
        <DialogContentText>
          <FormControl style={{ width: '100%' }}>
            <InputLabel id='demo-simple-select-label'>Type</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              style={{ width: '100%' }}
              value={relType}
              onChange={(e) => {
                setRelType(e.target.value);
              }}
            >
              {relTypes.map((rel) => {
                return (
                  <MenuItem key={rel} value={rel}>
                    {rel}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <h4>Properties</h4>
          <table>
            {properties.map((property, index) => {
              return (
                <>
                  <tr>
                    <td style={{ paddingLeft: '2px', paddingRight: '2px' }}>
                      <span style={{ color: 'black', width: '50px' }}>{index + 1}.</span>
                    </td>
                    <td style={{ paddingLeft: '5px', paddingRight: '5px' }}>
                      <TextField
                        style={{ width: '100%' }}
                        placeholder='Name...'
                        value={property.name}
                        onChange={(e) => {
                          const newProperties = [...properties];
                          newProperties[index].name = e.target.value;
                          setProperties(newProperties);
                        }}
                      ></TextField>
                    </td>
                    <td style={{ paddingLeft: '5px', paddingRight: '5px' }}>
                      <TextField
                        style={{ width: '100%' }}
                        placeholder='Value...'
                        value={property.value}
                        onChange={(e) => {
                          const newProperties = [...properties];
                          newProperties[index].value = e.target.value;
                          setProperties(newProperties);
                        }}
                      ></TextField>
                    </td>
                  </tr>
                </>
              );
            })}

            <tr>
              <td style={{ minWidth: '450px' }} colSpan={3}>
                <Typography variant='h3' color='primary' style={{ textAlign: 'center', marginBottom: '5px' }}>
                  <Fab
                    size='small'
                    aria-label='add'
                    style={{ background: 'white', color: 'black' }}
                    onClick={() => {
                      const newProperty = { name: '', value: '' };
                      setProperties(properties.concat(newProperty));
                    }}
                  >
                    <AddIcon />
                  </Fab>
                </Typography>
              </td>
            </tr>
          </table>

          <Button
            onClick={() => {
              const newProperties = {
                name: relType,
                pending: true,
              };

              properties.map((prop) => {
                newProperties[prop.name] = prop.value;
              });

              props.data.appendLink({
                id: -1,
                width: 4,
                color: 'black',
                type: relType,
                new: true,
                properties: newProperties,
                source: props.interactivity.selectedEntity?.id,
                target: props.selectedNode.id,
              });
              props.interactivity.setContextMenuOpen(false);
              props.setDialogOpen(false);
              setProperties([{ name: '', value: '' }]);
            }}
            style={{ float: 'right' }}
            variant='contained'
            size='medium'
            endIcon={<PlayArrow />}
          >
            Create
          </Button>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
