import React from 'react';
import { CardActions, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { categoricalColorSchemes } from '../../config/ColorConfig';
import { getReportTypes } from '../../extensions/ExtensionUtils';
import { SELECTION_TYPES } from '../../config/CardConfig';
import { Dropdown, Label } from '@neo4j-ndl/react';

const NeoCardViewFooter = ({
  fields,
  settings,
  selection,
  type,
  extensions,
  showOptionalSelections,
  onSelectionUpdate,
  dashboardSettings,
}) => {
  /**
   * For each selectable field in the visualization, give the user an option to select them from the query output fields.
   */
  const reportTypes = getReportTypes(extensions);
  const selectableFields = reportTypes[type].selection;
  const selectables = selectableFields ? Object.keys(selectableFields) : [];
  const nodeColorScheme = settings && settings.nodeColorScheme ? settings.nodeColorScheme : 'neodash';
  const hideSelections = settings && settings.hideSelections ? settings.hideSelections : false;
  const { ignoreLabelColors } = reportTypes[type];
  if (!fields || fields.length == 0 || hideSelections) {
    return <div></div>;
  }
  return (
    <CardActions
      style={{
        position: 'relative',
        paddingLeft: '15px',
        overflowX: 'scroll',
        paddingBottom: '100px',
      }}
      disableSpacing
    >
      {selectables.map((selectable, index) => {
        const selectionIsMandatory = !selectableFields[selectable].optional;

        // Creates the component for node property selections.
        if (selectableFields[selectable].type == SELECTION_TYPES.NODE_PROPERTIES) {
          // Only show optional selections if we explicitly allow it.
          if (showOptionalSelections || selectionIsMandatory) {
            const totalColors = categoricalColorSchemes[nodeColorScheme]
              ? categoricalColorSchemes[nodeColorScheme].length
              : 0;
            const fieldSelections = fields.map((field, i) => {
              // TODO logically, it should be the last element in the field (node labels) array, as that is typically
              // the most specific node label when we have multi-labels
              const nodeLabel = field[0];
              // TODO this convention that we have for storing node labels and properties in fields should be documented
              // , and probably even converted to a generic type.
              const discoveredProperties = field.slice(1);
              const properties = (discoveredProperties ? [...discoveredProperties].sort() : []).concat([
                '(label)',
                '(id)',
                '(no label)',
              ]);
              const color =
                totalColors > 0 && !ignoreLabelColors
                  ? categoricalColorSchemes[nodeColorScheme][i % totalColors]
                  : 'lightgrey';
              const inputColor =
                dashboardSettings.theme === 'dark' ? 'var(--palette-dark-neutral-border-strong)' : 'rgba(0, 0, 0, 0.6)';
              return (
                <FormControl key={nodeLabel} size={'small'} variant='standard'>
                  <InputLabel id={nodeLabel} style={{ color: inputColor }}>
                    {nodeLabel}
                  </InputLabel>
                  <Select
                    labelId={nodeLabel}
                    id={nodeLabel}
                    className={'MuiChip-root'}
                    style={{ backgroundColor: color, paddingLeft: 10, minWidth: 75, marginRight: 5 }}
                    onChange={(e) => onSelectionUpdate(nodeLabel, e.target.value)}
                    value={selection && selection[nodeLabel] ? selection[nodeLabel] : ''}
                  >
                    {/* Render choices */}
                    {properties.length &&
                      properties.map &&
                      properties.map((field) => {
                        return (
                          <MenuItem key={field} value={field}>
                            {field}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              );
            });
            return fieldSelections;
          }
        }
        // Creates the selection for all other types of components
        if (
          selectableFields[selectable].type == SELECTION_TYPES.LIST ||
          selectableFields[selectable].type == SELECTION_TYPES.NUMBER ||
          selectableFields[selectable].type == SELECTION_TYPES.NUMBER_OR_DATETIME ||
          selectableFields[selectable].type == SELECTION_TYPES.TEXT
        ) {
          if (selectionIsMandatory || showOptionalSelections) {
            const sortedFields = fields ? [...fields].sort() : [];

            const fieldsToRender = selectionIsMandatory ? sortedFields : sortedFields.concat(['(none)']);
            return (
              <FormControl key={index} size={'small'}>
                <Dropdown
                  id={selectable}
                  label={selectableFields[selectable].label}
                  type='select'
                  selectProps={{
                    onChange: (newValue) =>
                      (newValue && selectableFields[selectable].multiple
                        ? onSelectionUpdate(
                            selectable,
                            newValue.map((v) => v.value)
                          )
                        : onSelectionUpdate(selectable, newValue.value)),
                    options: fieldsToRender.map((option) => ({ label: option, value: option })),
                    value: selectableFields[selectable].multiple
                      ? selection[selectable].map((sel) => ({ label: sel, value: sel }))
                      : { label: selection[selectable], value: selection[selectable] },
                    isMulti: selectableFields[selectable].multiple,
                    isClearable: false,
                    menuPortalTarget: document.querySelector('#overlay'),
                  }}
                  fluid
                  style={{
                    minWidth: selectableFields[selectable].multiple ? 170 : 120,
                    marginRight: 20,
                    display: 'inline-block',
                  }}
                  placeholder={selectableFields[selectable].multiple ? 'Select (multiple)' : 'Select'}
                ></Dropdown>
              </FormControl>
            );
          }
        }
      })}
    </CardActions>
  );
};

export default NeoCardViewFooter;
