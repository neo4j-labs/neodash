import { GraphChartVisualizationProps } from '../GraphChartVisualization';
import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@mui/material/Button';
import { Badge, IconButton } from '@material-ui/core';
import { Fab, TextField, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { Autocomplete } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import PlayArrow from '@material-ui/icons/PlayArrow';
import { LabelTypeAutocomplete } from './autocomplete/LabelTypeAutocomplete';
import { DeletePropertyButton } from './button/modal/DeletePropertyButton';
import {
  handleNodeCreate,
  handleNodeDelete,
  handleNodeEdit,
  handleRelationshipCreate,
  handleRelationshipDelete,
  handleRelationshipEdit,
} from '../util/EditUtils';
import { PropertyNameAutocomplete } from './autocomplete/PropertyNameAutocomplete';

export enum EditType {
  Node,
  Relationship,
}

export enum EditAction {
  Create,
  Edit,
  Delete,
}

interface GraphChartEditorVisualizationProps extends GraphChartVisualizationProps {
  type: EditType;
  action: EditAction;
  selectedNode: any;
  dialogOpen: any;
  setDialogOpen: any;
}

/**
 * The edit modal is a pop-up window that lets users change a node or relationship in the graph.
 * This is a generic component, that can be used for creating/editing/deleting either nodes or relationships, and their properties.
 */
export const GraphChartEditModal = (props: GraphChartEditorVisualizationProps) => {
  const [properties, setProperties] = React.useState([{ name: '', value: '' }]);
  const [labelRecords, setLabelRecords] = React.useState([]);
  const [labelInputText, setLabelInputText] = React.useState('');
  const [propertyRecords, setPropertyRecords] = React.useState([]);
  const [propertyInputTexts, setPropertyInputTexts] = React.useState([]);
  const [label, setLabel] = React.useState(undefined);

  // When the dialog gets opened, and we are editing, prepopulate the fields with current node/rel data in the database.
  useEffect(() => {
    if (
      props.dialogOpen &&
      props.interactivity.selectedEntity &&
      props.type == EditType.Node &&
      props.action == EditAction.Edit
    ) {
      const label = props.interactivity.selectedEntity.labels ? props.interactivity.selectedEntity.labels[0] : '';
      setLabelInputText(label);
      setLabel(label);
      const selectedProps = Object.keys(props.interactivity.selectedEntity.properties).map((prop) => {
        return { name: prop, value: props.interactivity.selectedEntity.properties[prop] };
      });
      setProperties(selectedProps);
      setPropertyInputTexts(selectedProps.map((p) => p.name));
    } else if (
      props.dialogOpen &&
      props.interactivity.selectedEntity &&
      props.type == EditType.Relationship &&
      props.action == EditAction.Edit
    ) {
      const { type } = props.interactivity.selectedEntity;
      setLabelInputText(type);
      setLabel(type);
      const selectedProps = Object.keys(props.interactivity.selectedEntity.properties).map((prop) => {
        return { name: prop, value: props.interactivity.selectedEntity.properties[prop] };
      });
      setProperties(selectedProps);
      setPropertyInputTexts(selectedProps.map((p) => p.name));
    } else if (props.dialogOpen) {
      setLabelInputText('');
      setLabel('');
    }
  }, [props.dialogOpen]);

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
        {props.action == EditAction.Create ? 'Create' : 'Edit'} a{' '}
        {props.type == EditType.Node ? 'Node' : 'Relationship'}
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
          <LabelTypeAutocomplete
            records={labelRecords}
            setRecords={setLabelRecords}
            value={label}
            setValue={setLabel}
            queryCallback={props.engine.queryCallback}
            type={props.type}
            input={labelInputText}
            setInput={setLabelInputText}
            disabled={props.type == EditType.Relationship && props.action == EditAction.Edit}
          />
          <h4>Properties</h4>

          <table>
            {properties.map((property, index) => {
              const disabled = !(
                typeof property.value == 'string' ||
                typeof property.value == 'number' ||
                property.value.toNumber !== undefined
              );

              return (
                <>
                  <tr style={{ height: 40 }}>
                    <td style={{ paddingLeft: '2px', paddingRight: '2px' }}>
                      <span style={{ color: 'black', width: '50px' }}>{index + 1}.</span>
                    </td>
                    <td style={{ paddingLeft: '5px', paddingRight: '5px' }}>
                      <PropertyNameAutocomplete
                        records={propertyRecords}
                        setRecords={setPropertyRecords}
                        values={properties}
                        setValues={setProperties}
                        queryCallback={props.engine.queryCallback}
                        index={index}
                        inputs={propertyInputTexts}
                        setInputs={setPropertyInputTexts}
                        disabled={disabled}
                      />
                    </td>
                    <td style={{ paddingLeft: '5px', paddingRight: '5px' }}>
                      <TextField
                        style={{ width: '100%' }}
                        placeholder='Value...'
                        disabled={disabled}
                        value={property.value}
                        onChange={(e) => {
                          const newProperties = [...properties];
                          newProperties[index].value = e.target.value;
                          setProperties(newProperties);
                        }}
                      ></TextField>
                    </td>

                    <td>
                      <DeletePropertyButton
                        onClick={() => {
                          setProperties([...properties.slice(0, index), ...properties.slice(index + 1)]);
                          setPropertyInputTexts([
                            ...propertyInputTexts.slice(0, index),
                            ...propertyInputTexts.slice(index + 1),
                          ]);
                        }}
                      />
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
          <hr />
          <Button
            style={{ marginBottom: '10px' }}
            disabled={label === undefined || label == '' || labelInputText !== label}
            onClick={() => {
              const newProperties = {};

              properties.map((prop) => {
                if (prop.name !== '' && prop.value !== '') {
                  newProperties[prop.name] = prop.value;
                }
              });

              if (props.action == EditAction.Create && props.type == EditType.Node) {
                handleNodeCreate();
              } else if (props.action == EditAction.Create && props.type == EditType.Relationship) {
                handleRelationshipCreate(
                  props.interactivity.selectedEntity,
                  label,
                  newProperties,
                  props.selectedNode,
                  props.engine,
                  props.interactivity,
                  props.data
                );
              } else if (props.action == EditAction.Edit && props.type == EditType.Node) {
                const labels = label.split(',').map((l) => l.trim());
                handleNodeEdit(props.interactivity.selectedEntity, labels, newProperties, props);
              } else if (props.action == EditAction.Edit && props.type == EditType.Relationship) {
                handleRelationshipEdit(props.interactivity.selectedEntity, newProperties, props);
              } else if (props.action == EditAction.Delete && props.type == EditType.Node) {
                handleNodeDelete();
              } else if (props.action == EditAction.Delete && props.type == EditType.Relationship) {
                handleRelationshipDelete();
              }
              props.setDialogOpen(false);
              setProperties([{ name: '', value: '' }]);
            }}
            style={{ float: 'right', marginBottom: 15 }}
            variant='contained'
            size='medium'
            endIcon={<PlayArrow />}
          >
            {props.action == EditAction.Create ? 'Create' : 'Save'}
          </Button>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
