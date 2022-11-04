import React from "react";
import { CardActions, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, Select, TextField } from "@material-ui/core";
import { categoricalColorSchemes } from "../../config/ColorConfig";
import { getReportTypes } from "../../extensions/ExtensionUtils";
import { SELECTION_TYPES } from "../../config/CardConfig";

const NeoCardViewFooter = ({ fields, settings, selection, type, extensions, showOptionalSelections, onSelectionUpdate }) => {
    /**
     * For each selectable field in the visualization, give the user an option to select them from the query output fields.
    */
     const reportTypes = getReportTypes(extensions);
    const selectableFields = reportTypes[type].selection;
    const selectables = (selectableFields) ? Object.keys(selectableFields) : [];
    const nodeColorScheme = settings && settings.nodeColorScheme ? settings.nodeColorScheme : "neodash";
    const hideSelections = settings && settings.hideSelections ? settings.hideSelections : false;
    const ignoreLabelColors = reportTypes[type].ignoreLabelColors;
    if (!fields || fields.length == 0 || hideSelections) {
        return <div></div>
    }
    return (
        <CardActions style={{ position: "relative", paddingLeft: "15px", marginTop: "-5px", overflowX: "scroll" }} disableSpacing>
            {selectables.map((selectable, index) => {
                const selectionIsMandatory = (selectableFields[selectable]['optional']) ? false : true;

        // Creates the component for node property selections.
        if (selectableFields[selectable].type == SELECTION_TYPES.NODE_PROPERTIES) {
          // Only show optional selections if we explicitly allow it.
          if (showOptionalSelections || selectionIsMandatory) {
            const fieldSelections = fields.map((field, i) => {
              const nodeLabel = field[0];
              const discoveredProperties = field.slice(1);
              const properties = (discoveredProperties ? [...discoveredProperties].sort() : []).concat([
                '(label)',
                '(id)',
                '(no label)',
              ]);
              const totalColors = categoricalColorSchemes[nodeColorScheme]
                ? categoricalColorSchemes[nodeColorScheme].length
                : 0;
              const color =
                totalColors > 0 && !ignoreLabelColors
                  ? categoricalColorSchemes[nodeColorScheme][i % totalColors]
                  : 'lightgrey';
              return (
                <FormControl key={nodeLabel}>
                  <InputLabel style={{ paddingLeft: '10px' }} id={nodeLabel}>
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
              <FormControl key={index}>
                <InputLabel id={selectable}>{selectableFields[selectable].label}</InputLabel>
                <Select
                  labelId={selectable}
                  id={selectable}
                  multiple={selectableFields[selectable].multiple}
                  style={{ minWidth: 120, marginRight: 20 }}
                  onChange={(e) => onSelectionUpdate(selectable, e.target.value)}
                  renderValue={(selected) => (Array.isArray(selected) ? selected.join(', ') : selected)}
                  value={
                    selection && selection[selectable]
                      ? selectableFields[selectable].multiple && !Array.isArray(selection[selectable])
                        ? [selection[selectable]]
                        : selection[selectable]
                      : selectableFields[selectable].multiple
                      ? selection[selectable] && selection[selectable].length > 0
                        ? selection[selectable][0]
                        : []
                      : '(no data)'
                  }
                >
                  {/* Render choices */}
                  {fieldsToRender.map((field) => {
                    return (
                      <MenuItem key={field} value={field}>
                        {selectableFields[selectable].multiple && Array.isArray(selection[selectable]) ? (
                          <Checkbox checked={selection[selectable].indexOf(field) > -1} />
                        ) : (
                          <></>
                        )}
                        {field}
                        {/* <ListItemText primary={field} /> */}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            );
          }
        }
      })}
    </CardActions>
  );
};

export default NeoCardViewFooter;
