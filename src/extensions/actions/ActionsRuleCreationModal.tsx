import React, { useEffect } from 'react';
import { XMarkIconOutline, PlusIconOutline, SparklesIconOutline } from '@neo4j-ndl/react/icons';
import { getPageNumbersAndNamesList } from '../advancedcharts/Utils';
import { IconButton, Button, Dialog, Dropdown, TextInput } from '@neo4j-ndl/react';
import { Autocomplete, TextField } from '@mui/material';
import NeoField from '../../component/field/Field';

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

  const pageNames = getPageNumbersAndNamesList();
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
            <TextInput
              style={{ width: '100px', color: 'black', marginRight: '-5px' }}
              disabled={true}
              value='$neodash_'
            ></TextInput>
          </td>
          <td style={{ paddingLeft: '5px', paddingRight: '5px' }}>
            <TextInput
              placeholder=''
              value={rule.customizationValue}
              onChange={(e) => updateRuleField(index, 'customizationValue', e.target.value)}
            ></TextInput>
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
            <TextInput
              style={{ width: '100%', color: 'black', marginRight: '-5px' }}
              disabled={true}
              value='name/index'
            ></TextInput>
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
          className='dialog-xl'
          open={customReportActionsModalOpen == true}
          onClose={handleClose}
          style={{ overflow: 'inherit', overflowY: 'inherit' }}
          aria-labelledby='form-dialog-title'
        >
          <Dialog.Header id='form-dialog-title'>
            <SparklesIconOutline className='icon-base icon-inline text-r' aria-label={'Adjust'} />
            Report Actions
          </Dialog.Header>
          <Dialog.Content style={{ overflow: 'inherit' }}>
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
                  const ruleType = RULE_BASED_REPORT_ACTIONS_CUSTOMIZATIONS[type].find(
                    (el) => el.value === rule.customization
                  );
                  const ruleTrigger = RULE_CONDITIONS[type].find((el) => el.value === rule.condition);
                  return (
                    <>
                      <tr>
                        <td className='n-px-1'>
                          <span className='n-w-12'>{index + 1}.</span>
                        </td>
                        <td className='n-px-5'>
                          <span className='n-font-bold n-w-12'> ON</span>
                        </td>
                        <td>
                          <div style={{ border: '2px dashed grey' }}>
                            <td className='n-px-1'>
                              <NeoField
                                select
                                valueLabel={ruleTrigger ? ruleTrigger.label : ''}
                                value={rule.condition}
                                choices={
                                  RULE_CONDITIONS[type] &&
                                  RULE_CONDITIONS[type].map((option) => ({
                                    label: option.label,
                                    value: option.value,
                                  }))
                                }
                                onChange={(newValue) => updateRuleField(index, 'condition', newValue.value)}
                                className='n-w-48 n-ml-1'
                                fluid
                              />
                            </td>
                            <td className='n-align-top'>
                              <Autocomplete
                                disableClearable={true}
                                id='autocomplete-label-type'
                                size='small'
                                noOptionsText='*Specify an exact field name'
                                options={createFieldVariableSuggestionsFromRule(rule, true)}
                                value={rule.field ? rule.field : ''}
                                inputValue={rule.field ? rule.field : ''}
                                popupIcon={<></>}
                                style={{ width: 150, padding: 0 }}
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
                                    style={{ padding: 0 }}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                )}
                              />
                            </td>
                          </div>
                        </td>
                        <td className='n-px-5'>
                          <span className='n-font-bold n-w-12'>SET</span>
                        </td>
                        <td>
                          <div style={{ border: '2px dashed grey', marginBottom: '5px' }}>
                            <td className='n-p-1'>
                              <NeoField
                                select
                                valueLabel={ruleType ? ruleType.label : ''}
                                value={rule.customization}
                                choices={
                                  RULE_BASED_REPORT_ACTIONS_CUSTOMIZATIONS[type] &&
                                  RULE_BASED_REPORT_ACTIONS_CUSTOMIZATIONS[type].map((option) => ({
                                    label: option.label,
                                    value: option.value,
                                  }))
                                }
                                onChange={(newValue) => updateRuleField(index, 'customization', newValue.value)}
                                className='n-w-36'
                                fluid
                              />
                            </td>
                            {getActionHelper(rule, index, rules[index].customization)}
                          </div>
                        </td>

                        <td className='n-px-5'>
                          <span className='n-font-bold n-w-12'>TO</span>
                        </td>
                        <td>
                          <div style={{ border: '2px dashed grey' }}>
                            <td className='n-align-top'>
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
                        </td>

                        <td style={{ width: '2.5%' }}>
                          <IconButton
                            aria-label='remove rule'
                            size='medium'
                            floating
                            onClick={() => {
                              setRules([...rules.slice(0, index), ...rules.slice(index + 1)]);
                            }}
                          >
                            <XMarkIconOutline />
                          </IconButton>
                        </td>
                        <hr />
                      </tr>
                    </>
                  );
                })}

                <tr>
                  <td colSpan={5}>
                    <div style={{ textAlign: 'center', marginBottom: '5px' }}>
                      <IconButton
                        aria-label='add'
                        size='medium'
                        floating
                        onClick={() => {
                          const newRule = getDefaultRule(type);
                          setRules(rules.concat(newRule));
                        }}
                      >
                        <PlusIconOutline />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              </table>
            </div>

            <Button
              onClick={() => {
                handleClose();
              }}
              size='large'
              floating
            >
              Save
              <SparklesIconOutline className='btn-icon-lg-r' />
            </Button>
          </Dialog.Content>
        </Dialog>
      ) : (
        <></>
      )}
    </div>
  );
};

export default NeoCustomReportActionsModal;
