import React, { useEffect } from 'react';
import { Fab, MenuItem, TextField, Typography } from '@material-ui/core';
import NeoColorPicker from '../../component/field/ColorPicker';
import { Autocomplete } from '@material-ui/lab';
import { IconButton, Button, Dialog } from '@neo4j-ndl/react';
import {
  AdjustmentsHorizontalIconOutline,
  XMarkIconOutline,
  PlusIconOutline,
  PlayIconSolid,
} from '@neo4j-ndl/react/icons';

// The set of conditional checks that are included in the rule specification.
const RULE_CONDITIONS = [
  {
    value: '=',
    label: '=',
  },
  {
    value: '!=',
    label: '!=',
  },
  {
    value: '>',
    label: '>',
  },
  {
    value: '>=',
    label: '>=',
  },
  {
    value: '<',
    label: '<',
  },
  {
    value: '<=',
    label: '<=',
  },
  {
    value: 'contains',
    label: 'contains',
  },
];

// For each report type, the customizations that can be specified using rules.
export const RULE_BASED_REPORT_CUSTOMIZATIONS = {
  graph: [
    {
      value: 'node color',
      label: 'Node Color',
    },
    {
      value: 'node label color',
      label: 'Node Label Color',
    },
  ],
  map: [
    {
      value: 'marker color',
      label: 'Marker color',
    },
  ],
  bar: [
    {
      value: 'bar color',
      label: 'Bar Color',
    },
  ],
  line: [
    {
      value: 'line color',
      label: 'Line Color',
    },
  ],
  pie: [
    {
      value: 'slice color',
      label: 'Slice Color',
    },
  ],
  value: [
    {
      value: 'text color',
      label: 'Text Color',
    },
  ],
  table: [
    {
      value: 'row color',
      label: 'Row Background Color',
    },
    {
      value: 'row text color',
      label: 'Row Text Color',
    },
    {
      value: 'cell color',
      label: 'Cell Background Color',
    },
    {
      value: 'cell text color',
      label: 'Cell Text Color',
    },
  ],
};

// Get the default rule structure to append when a rule gets added to the list.
const getDefaultRule = (customization) => {
  return {
    field: '',
    condition: '=',
    value: '',
    customization: customization,
    customizationValue: 'black',
  };
};

/**
 * The pop-up window used to build and specify custom styling rules for reports.
 */
export const NeoCustomReportStyleModal = ({
  customReportStyleModalOpen,
  settingName,
  settingValue,
  type,
  fields,
  setCustomReportStyleModalOpen,
  onReportSettingUpdate,
}) => {
  // The rule set defined in this modal is updated whenever the setting value is externally changed.
  const [rules, setRules] = React.useState([]);
  useEffect(() => {
    if (settingValue) {
      setRules(settingValue);
    }
  }, [settingValue]);

  const handleClose = () => {
    // If no rules are specified, clear the special report setting that holds the customization rules.
    if (rules.length == 0) {
      onReportSettingUpdate(settingName, undefined);
    } else {
      onReportSettingUpdate(settingName, rules);
    }
    setCustomReportStyleModalOpen(false);
  };

  // Update a single field in one of the rules in the rule array.
  const updateRuleField = (ruleIndex, ruleField, ruleFieldValue) => {
    let newRules = [...rules]; // Deep copy
    newRules[ruleIndex][ruleField] = ruleFieldValue;
    setRules(newRules);
  };

  /**
   * Create the list of suggestions used in the autocomplete box of the rule specification window.
   * This will be dynamic based on the type of report we are customizing.
   */
  const createFieldVariableSuggestions = () => {
    if (!fields) {
      return [];
    }
    if (type == 'graph' || type == 'map') {
      return fields
        .map((node, index) => {
          if (!Array.isArray(node)) {
            return undefined;
          }
          return fields[index].map((property, propertyIndex) => {
            if (propertyIndex == 0) {
              return undefined;
            }
            return `${fields[index][0]}.${property}`;
          });
        })
        .flat()
        .filter((e) => e !== undefined);
    }
    if (type == 'bar' || type == 'line' || type == 'pie' || type == 'table' || type == 'value') {
      return fields;
    }
    return [];
  };

  return (
    <div>
      {customReportStyleModalOpen ? (
        <Dialog
          size='large'
          open={customReportStyleModalOpen == true}
          onClose={handleClose}
          aria-labelledby='form-dialog-title'
        >
          <Dialog.Header id='form-dialog-title'>
            <AdjustmentsHorizontalIconOutline
              className='n-w-6 n-h-6'
              style={{ display: 'inline', marginRight: '5px', marginBottom: '5px' }}
            />
            Rule-Based Styling
          </Dialog.Header>
          <Dialog.Content style={{ overflow: 'inherit' }}>
            <p>
              You can define rule-based styling for the report here. <br />
              Style rules are checked in-order and override the default behaviour - if no rules are valid, no style is
              applied.
              <br />
              {type == 'graph' || type == 'map' ? (
                <p>
                  For <b>{type}</b> reports, the field name should be specified in the format <code>label.name</code>,
                  for example: <code>Person.age</code>. This is case-sensentive.
                </p>
              ) : (
                <></>
              )}
              {type == 'line' || type == 'value' || type == 'bar' || type == 'pie' || type == 'table' ? (
                <p>
                  For <b>{type}</b> reports, the field name should be the exact name of the returned field. <br />
                  For example, if your query is <code>MATCH (n:Movie) RETURN n.rating as Rating</code>, your field name
                  is <code>Rating</code>.
                </p>
              ) : (
                <></>
              )}
            </p>
            <div>
              <hr></hr>

              <table>
                {rules.map((rule, index) => {
                  return (
                    <>
                      <tr>
                        <td style={{ paddingLeft: '2px', paddingRight: '2px' }}>
                          <span style={{ color: 'black', width: '50px' }}>{index + 1}.</span>
                        </td>
                        <td style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                          <span style={{ fontWeight: 'bold', color: 'black', width: '50px' }}> IF</span>
                        </td>
                        <div style={{ border: '2px dashed grey' }}>
                          <td
                            style={{
                              paddingLeft: '5px',
                              paddingRight: '5px',
                              paddingTop: '5px',
                              paddingBottom: '5px',
                            }}
                          >
                            <Autocomplete
                              disableClearable={true}
                              id='autocomplete-label-type'
                              noOptionsText='*Specify an exact field name'
                              options={createFieldVariableSuggestions().filter((e) =>
                                e.toLowerCase().includes(rule.field.toLowerCase())
                              )}
                              value={rule.field ? rule.field : ''}
                              inputValue={rule.field ? rule.field : ''}
                              popupIcon={<></>}
                              style={{ display: 'inline-block', width: 185, marginLeft: '5px', marginTop: '5px' }}
                              onInputChange={(event, value) => {
                                updateRuleField(index, 'field', value);
                              }}
                              onChange={(event, newValue) => {
                                updateRuleField(index, 'field', newValue);
                              }}
                              renderInput={(params) => (
                                <TextField {...params} placeholder='Field name...' InputLabelProps={{ shrink: true }} />
                              )}
                            />
                          </td>
                          <td style={{ paddingLeft: '5px', paddingRight: '5px' }}>
                            <TextField
                              select
                              value={rule.condition}
                              onChange={(e) => updateRuleField(index, 'condition', e.target.value)}
                            >
                              {RULE_CONDITIONS.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </TextField>
                          </td>
                          <td style={{ paddingLeft: '5px', paddingRight: '5px' }}>
                            <TextField
                              placeholder='Value...'
                              value={rule.value}
                              onChange={(e) => updateRuleField(index, 'value', e.target.value)}
                            ></TextField>
                          </td>
                        </div>
                        <td style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                          <span style={{ fontWeight: 'bold', color: 'black', width: '50px' }}>THEN</span>
                        </td>
                        <div style={{ border: '2px dashed grey', marginBottom: '5px' }}>
                          <td
                            style={{
                              paddingLeft: '5px',
                              paddingRight: '5px',
                              paddingTop: '5px',
                              paddingBottom: '5px',
                            }}
                          >
                            <TextField
                              select
                              value={rule.customization}
                              onChange={(e) => updateRuleField(index, 'customization', e.target.value)}
                            >
                              {RULE_BASED_REPORT_CUSTOMIZATIONS[type] &&
                                RULE_BASED_REPORT_CUSTOMIZATIONS[type].map((option) => (
                                  <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                            </TextField>
                          </td>
                          <td
                            style={{
                              paddingLeft: '5px',
                              paddingRight: '5px',
                              paddingTop: '5px',
                              paddingBottom: '5px',
                            }}
                          >
                            <TextField
                              style={{ width: '20px', color: 'black' }}
                              disabled={true}
                              value={'='}
                            ></TextField>
                          </td>
                          <td style={{ paddingLeft: '5px', paddingRight: '5px' }}>
                            <NeoColorPicker
                              label=''
                              defaultValue='black'
                              key={undefined}
                              style={undefined}
                              value={rule.customizationValue}
                              onChange={(value) => updateRuleField(index, 'customizationValue', value)}
                            ></NeoColorPicker>
                          </td>
                        </div>
                        <td>
                          <IconButton aria-label='remove rule' size='medium' floating>
                            <XMarkIconOutline
                              onClick={() => {
                                setRules([...rules.slice(0, index), ...rules.slice(index + 1)]);
                              }}
                            />
                          </IconButton>
                        </td>
                      </tr>
                    </>
                  );
                })}

                <tr>
                  <td style={{ borderBottom: '1px solid grey', width: '750px' }} colSpan={5}>
                    <div style={{ textAlign: 'center', marginBottom: '5px' }}>
                      <IconButton aria-label='add' size='medium' floating>
                        <PlusIconOutline
                          onClick={() => {
                            const newRule = getDefaultRule(RULE_BASED_REPORT_CUSTOMIZATIONS[type][0].value);
                            setRules(rules.concat(newRule));
                          }}
                        />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              </table>
            </div>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onClick={() => {
                handleClose();
              }}
              size='large'
              floating
            >
              Save
              <PlayIconSolid className='n-w-6 n-h-6' />
            </Button>
          </Dialog.Actions>
        </Dialog>
      ) : (
        <></>
      )}
    </div>
  );
};

export default NeoCustomReportStyleModal;
