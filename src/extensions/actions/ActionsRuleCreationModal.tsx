import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Badge from '@material-ui/core/Badge';
import { Button, Fab, MenuItem, TextField, Typography } from '@material-ui/core';
import NeoColorPicker from '../../component/field/ColorPicker';
import AddIcon from '@material-ui/icons/Add';
import { Autocomplete } from '@material-ui/lab';
import StarsIcon from '@material-ui/icons/Stars';
import { getPageNames } from '../advancedcharts/Utils';
// The set of conditional checks that are included in the rule specification.
const RULE_CONDITIONS = {
  table: [
    {
      value: 'Click',
      label: 'Cell Click',
      default: true,
    },
    {
      value: 'doubleClick',
      label: 'Cell Double Click',
    },
  ],
  map: [
    {
      value: 'Click',
      label: 'Click on Tooltip',
      default: true,
    },
  ],
  graph: [
    {
      value: 'onNodeClick',
      label: 'Node Click',
      default: true,
    },
    {
      value: 'onLinkClick',
      label: 'Link Click',
    },
  ],
};

// For each report type, the customizations that can be specified using rules.
export const RULE_BASED_REPORT_ACTIONS_CUSTOMIZATIONS = {
  table: [
    {
      value: 'set variable',
      label: 'Parameter',
    },
    {
      value: 'set page',
      label: 'Page',
    },
  ],
  map: [
    {
      value: 'set variable',
      label: 'Parameter',
    },
    {
      value: 'set page',
      label: 'Page',
    },
  ],
  graph: [
    {
      value: 'set variable',
      label: 'Parameter',
    },
    {
      value: 'set page',
      label: 'Page',
    },
  ],
};

// Get the default rule structure to append when a rule gets added to the list.
const getDefaultRule = (type) => {
  let rule = RULE_CONDITIONS[type].filter((e) => e.default !== undefined && e.default);
  rule = rule.length > 0 ? rule[0] : RULE_CONDITIONS[type][0];
  let customization = RULE_BASED_REPORT_ACTIONS_CUSTOMIZATIONS[type].filter(
    (e) => e.default !== undefined && e.default
  );
  customization = customization.length > 0 ? customization[0] : RULE_BASED_REPORT_ACTIONS_CUSTOMIZATIONS[type][0];
  return {
    condition: rule.value,
    field: '',
    value: '',
    customization: customization.value,
    customizationValue: '',
  };
};

/**
 * The pop-up window used to build and specify custom styling rules for reports.
 */
export const NeoCustomReportActionsModal = ({
  customReportActionsModalOpen,
  settingName,
  settingValue,
  type,
  fields,
  setCustomReportActionsModalOpen,
  onReportSettingUpdate,
}) => {
  // The rule set defined in this modal is updated whenever the setting value is externally changed.
  const [rules, setRules] = React.useState([]);
  useEffect(() => {
    if (settingValue) {
      setRules(settingValue);
    }
  }, [settingValue]);

  const pageNames = getPageNames();
  const handleClose = () => {
    // If no rules are specified, clear the special report setting that holds the customization rules.
    if (rules.length == 0) {
      onReportSettingUpdate(settingName, undefined);
    } else {
      onReportSettingUpdate(settingName, rules);
    }
    setCustomReportActionsModalOpen(false);
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
  const createFieldVariableSuggestions = (c, labels, labelRel) => {
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
            if (!['Click', 'onNodeClick'].includes(c)) {
              return undefined;
            }

            if (labels) {
              if (propertyIndex > 0) {
                return undefined;
              }
              return fields[index][0];
            }

            if (propertyIndex == 0) {
              return undefined;
            }

            return `${fields[index][0]}.${property}`;
          });
        })
        .flat()
        .filter((e) => e !== undefined)
        .filter((e) => labelRel == null || e.startsWith(labelRel));
    }
    if (type == 'bar' || type == 'line' || type == 'pie' || type == 'table' || type == 'value') {
      return fields;
    }
    return [];
  };

  const createFieldVariableSuggestionsFromRule = (rule, type) => {
    let suggestions;
    if (type) {
      suggestions = createFieldVariableSuggestions(rule.condition, true, null).filter((e) =>
        e.toLowerCase().startsWith(rule.field.toLowerCase())
      );
    } else if (rule.customization == 'set page' && pageNames) {
      suggestions = pageNames;
    } else {
      suggestions = createFieldVariableSuggestions(rule.condition, false, rule.field).filter((e) =>
        e.toLowerCase().startsWith(rule.value.toLowerCase())
      );
    }

    suggestions = suggestions.map((e) => e.split('.')[1] || e);

    return suggestions;
  };

  const getActionHelper = (rule, index, customization) => {
    if (customization == 'set variable') {
      return (
        <>
          <td
            style={{
              paddingLeft: '5px',
              paddingRight: '0px',
              paddingTop: '5px',
              paddingBottom: '5px',
            }}
          >
            <TextField
              style={{ width: '80px', color: 'black', marginRight: '-5px' }}
              disabled={true}
              value='$neodash_'
            ></TextField>
          </td>
          <td style={{ paddingLeft: '5px', paddingRight: '5px' }}>
            <TextField
              placeholder=''
              value={rule.customizationValue}
              onChange={(e) => updateRuleField(index, 'customizationValue', e.target.value)}
            ></TextField>
          </td>
        </>
      );
    } else if (customization == 'set page') {
      return (
        <>
          <td
            style={{
              paddingLeft: '5px',
              paddingRight: '0px',
              paddingTop: '5px',
              paddingBottom: '5px',
            }}
          >
            <TextField
              style={{ width: '100%', color: 'black', marginRight: '-5px' }}
              disabled={true}
              value='name/index'
            ></TextField>
          </td>
        </>
      );
    }
    return 'wtf';
  };

  return (
    <div>
      {customReportActionsModalOpen ? (
        <Dialog
          maxWidth={'xl'}
          open={customReportActionsModalOpen == true}
          PaperProps={{
            style: {
              overflow: 'inherit',
            },
          }}
          style={{ overflow: 'inherit', overflowY: 'inherit' }}
          aria-labelledby='form-dialog-title'
        >
          <DialogTitle id='form-dialog-title'>
            <StarsIcon
              style={{
                height: '30px',
                paddingTop: '4px',
                marginBottom: '-8px',
                marginRight: '5px',
                paddingBottom: '5px',
              }}
            />
            Report Actions
            <IconButton onClick={handleClose} style={{ padding: '3px', float: 'right' }}>
              <Badge badgeContent={''}>
                <CloseIcon />
              </Badge>
            </IconButton>
          </DialogTitle>
          <div>
            <DialogContent style={{ overflow: 'inherit' }}>
              <p>You can define actions for the report here. </p>
              <p>
                Report actions enable you to create conditional logic in the dashboard, for example, setting a parameter
                dynamically based on a 'node click' or 'table click'.
              </p>
              <p>For more on report actions, see the documentation.</p>
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
                            <span style={{ fontWeight: 'bold', color: 'black', width: '50px' }}> ON</span>
                          </td>
                          <div style={{ border: '2px dashed grey' }}>
                            <td style={{ paddingLeft: '5px', paddingRight: '5px' }}>
                              <TextField
                                select
                                value={rule.condition}
                                onChange={(e) => updateRuleField(index, 'condition', e.target.value)}
                              >
                                {RULE_CONDITIONS[type] &&
                                  RULE_CONDITIONS[type].map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                      {option.label}
                                    </MenuItem>
                                  ))}
                              </TextField>
                            </td>
                            <td>
                              <Autocomplete
                                disableClearable={true}
                                id='autocomplete-label-type'
                                noOptionsText='*Specify an exact field name'
                                options={createFieldVariableSuggestionsFromRule(rule, true)}
                                value={rule.field ? rule.field : ''}
                                inputValue={rule.field ? rule.field : ''}
                                popupIcon={<></>}
                                style={{ display: 'inline-block', width: 100, marginLeft: '5px', marginTop: '5px' }}
                                onInputChange={(event, value) => {
                                  updateRuleField(index, 'field', value);
                                }}
                                onChange={(event, newValue) => {
                                  updateRuleField(index, 'field', newValue);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder='Field name...'
                                    InputLabelProps={{ shrink: true }}
                                  />
                                )}
                              />
                            </td>
                          </div>
                          <td style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                            <span style={{ fontWeight: 'bold', color: 'black', width: '50px' }}>SET</span>
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
                                {RULE_BASED_REPORT_ACTIONS_CUSTOMIZATIONS[type] &&
                                  RULE_BASED_REPORT_ACTIONS_CUSTOMIZATIONS[type].map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                      {option.label}
                                    </MenuItem>
                                  ))}
                              </TextField>
                            </td>
                            {getActionHelper(rule, index, rules[index].customization)}
                          </div>

                          <td style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                            <span style={{ fontWeight: 'bold', color: 'black', width: '50px' }}>TO</span>
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
                                options={createFieldVariableSuggestionsFromRule(rule, false)}
                                value={rule.value || ''}
                                inputValue={rule.value || ''}
                                popupIcon={<></>}
                                style={{ display: 'inline-block', width: 185, marginLeft: '5px', marginTop: '5px' }}
                                onInputChange={(event, value) => {
                                  updateRuleField(index, 'value', value);
                                }}
                                onChange={(event, newValue) => {
                                  updateRuleField(index, 'value', newValue);
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder='Field name...'
                                    InputLabelProps={{ shrink: true }}
                                  />
                                )}
                              />
                            </td>
                          </div>

                          <td>
                            <Fab
                              size='small'
                              aria-label='add'
                              style={{ background: 'black', color: 'white', marginTop: '-6px', marginLeft: '20px' }}
                              onClick={() => {
                                setRules([...rules.slice(0, index), ...rules.slice(index + 1)]);
                              }}
                            >
                              <CloseIcon />
                            </Fab>
                          </td>
                          <hr />
                        </tr>
                      </>
                    );
                  })}

                  <tr>
                    <td style={{ borderBottom: '1px solid grey', width: '1000px' }} colSpan={8}>
                      <Typography variant='h3' color='primary' style={{ textAlign: 'center', marginBottom: '5px' }}>
                        <Fab
                          size='small'
                          aria-label='add'
                          style={{ background: 'white', color: 'black' }}
                          onClick={() => {
                            const newRule = getDefaultRule(type);
                            setRules(rules.concat(newRule));
                          }}
                        >
                          <AddIcon />
                        </Fab>
                      </Typography>
                    </td>
                  </tr>
                </table>
              </div>

              <Button
                style={{ float: 'right', marginTop: '20px', marginBottom: '20px', backgroundColor: 'white' }}
                color='default'
                variant='contained'
                size='large'
                onClick={() => {
                  handleClose();
                }}
              >
                Save
              </Button>
            </DialogContent>
          </div>
        </Dialog>
      ) : (
        <></>
      )}
    </div>
  );
};

export default NeoCustomReportActionsModal;
