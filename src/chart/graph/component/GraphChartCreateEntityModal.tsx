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
  const type = 'Relationship';
  const [properties, setProperties] = React.useState([{ name: '', value: '' }]);
  const [labelRecords, setLabelRecords] = React.useState([]);
  const [labelInputText, setLabelInputText] = React.useState('');
  const [propertyRecords, setPropertyRecords] = React.useState([]);

  const [propertyInputTexts, setPropertyInputTexts] = React.useState({});
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
          <Autocomplete
            id='autocomplete-label-type'
            options={labelRecords.map((r) => (r._fields ? r._fields[0] : '(no data)'))}
            getOptionLabel={(option) => option || ''}
            style={{ width: '100%', marginLeft: '5px', marginTop: '5px' }}
            inputValue={labelInputText}
            onInputChange={(event, value) => {
              setLabelInputText(value);
              if (type == 'Node Property') {
                props.engine.queryCallback(
                  'CALL db.labels() YIELD label WITH label as nodeLabel WHERE toLower(nodeLabel) CONTAINS toLower($input) RETURN DISTINCT nodeLabel LIMIT 5',
                  { input: value },
                  setLabelRecords
                );
              } else {
                props.engine.queryCallback(
                  'CALL db.relationshipTypes() YIELD relationshipType WITH relationshipType as relType WHERE toLower(relType) CONTAINS toLower($input) RETURN DISTINCT relType LIMIT 5',
                  { input: value },
                  setLabelRecords
                );
              }
            }}
            value={relType}
            onChange={(event, newValue) => setRelType(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder='Start typing...'
                InputLabelProps={{ shrink: true }}
                label={type == 'Relationship' ? 'Type' : 'Label'}
              />
            )}
          />
          <h4>Properties</h4>
          <table>
            {properties.map((property, index) => {
              return (
                <>
                  <tr style={{ marginBottom: 10 }}>
                    <td style={{ paddingLeft: '2px', paddingRight: '2px' }}>
                      <span style={{ color: 'black', width: '50px' }}>{index + 1}.</span>
                    </td>
                    <td style={{ paddingLeft: '5px', paddingRight: '5px' }}>
                      <Autocomplete
                        id='autocomplete-property'
                        options={propertyRecords.map((r) => (r._fields ? r._fields[0] : '(no data)'))}
                        getOptionLabel={(option) => (option ? option : '')}
                        style={{ display: 'inline-block', width: 170, marginLeft: '5px', marginTop: '5px' }}
                        inputValue={propertyInputTexts[index]}
                        onInputChange={(event, value) => {
                          const newPropertyInputTexts = { ...propertyInputTexts };
                          newPropertyInputTexts[index] = value;
                          setPropertyInputTexts(newPropertyInputTexts);

                          props.engine.queryCallback(
                            'CALL db.propertyKeys() YIELD propertyKey as propertyName WITH propertyName WHERE toLower(propertyName) CONTAINS toLower($input) RETURN DISTINCT propertyName LIMIT 5',
                            { input: value },
                            setPropertyRecords
                          );
                        }}
                        value={property.name}
                        onChange={(e, val) => {
                          const newProperties = [...properties];
                          newProperties[index].name = val;
                          setProperties(newProperties);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} placeholder='Name...' InputLabelProps={{ shrink: true }} />
                        )}
                      />
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
                    <td>
                      <Fab
                        size='small'
                        aria-label='remove'
                        style={{
                          background: 'white',
                          color: 'black',
                          marginTop: '-6px',
                          marginLeft: '20px',
                          width: '34px',
                          height: '30px',
                        }}
                        onClick={() => {
                          setProperties([...properties.slice(0, index), ...properties.slice(index + 1)]);
                        }}
                      >
                        <CloseIcon />
                      </Fab>
                    </td>
                  </tr>
                </>
              );
            })}

            <tr>
              <td style={{ minWidth: '450px' }} colSpan={4}>
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
            style={{ marginBottom: '10px' }}
            disabled={relType === undefined}
            onClick={() => {
              const newProperties = {
                name: relType,
                pending: true,
              };

              properties.map((prop) => {
                if (prop.name !== '' && prop.value !== '') {
                  newProperties[prop.name] = prop.value;
                }
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
