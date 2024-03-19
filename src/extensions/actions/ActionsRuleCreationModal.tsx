import React, { useEffect } from 'react';
import {
  AdjustmentsHorizontalIconOutline,
  XMarkIconOutline,
  PlusIconOutline,
  PlayIconSolid,
  SparklesIconOutline,
} from '@neo4j-ndl/react/icons';
import { getPageNumbersAndNamesList } from '../advancedcharts/Utils';
import { IconButton, Button, Dialog, Dropdown, TextInput } from '@neo4j-ndl/react';
import { Autocomplete, TextField } from '@mui/material';

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
    {
      value: 'rowCheck',
      label: 'Row Checked',
      disableFieldSelection: true,
      multiple: true,
    },
  ],
  bar: [
    {
      value: 'Click',
      label: 'Click',
      default: true,
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
  graph3d: [
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
  gantt: [
    {
      value: 'onTaskClick',
      label: 'Task Click',
      default: true,
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
  bar: [
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
  graph3d: [
    {
      value: 'set variable',
      label: 'Parameter',
    },
    {
      value: 'set page',
      label: 'Page',
    },
  ],
  gantt: [
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
    if (type == 'graph' || type == 'map' || type == 'gantt' || type == 'graph3d') {
      return fields
        .map((node, index) => {
          if (!Array.isArray(node)) {
            return undefined;
          }
          return fields[index].map((property, propertyIndex) => {
            if (!['Click', 'onNodeClick', 'onTaskClick'].includes(c)) {
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

  const createFieldVariableSuggestionsFromRule = (rule, skipRuleFieldCheck) => {
    let suggestions: string[];
    if (skipRuleFieldCheck) {
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
    // When we are accessing node properties (not page names), parse the node label + property pair to only show properties.
    // Fields for graph and map reports are structured differently than regular reports (table, bar, etc.), so we access suggestions differently.
    if (rule.customization !== 'set page' && (type == 'graph' || type == 'map' || type == 'graph3d')) {
      suggestions = suggestions.map((e) => e.split('.')[1] || e);
    }
    return suggestions;
  };

  const handleOnInputchange = (customization, index, value) => {
    updateRuleField(index, 'value', value);
    if (type == 'bar' && customization !== 'set page') {
      // For bar charts, duplicate the value to rule.field
      updateRuleField(index, 'field', value);
    }
  };

  const handleOnChange = (customization, index, newValue) => {
    updateRuleField(index, 'value', newValue);
  };

  const actionHelperClass = 'n-w-2/3 n-inline-flex';
  const spanClass = 'n-align-middle ';
  const textInputClass = 'font-bold n-ml-2 n-mt-[1px] n-float-right n-w-full';

  // Sets parameter value
  const getActionHelper = (rule, index, customization) => {
    if (customization == 'set variable') {
      return (
        <div className={actionHelperClass}>
          <div style={{ marginLeft: 10, display: 'inline' }} className={spanClass}>
            <span
              style={{
                height: '2.25rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                fontSize: 'var(--font-size-body-medium)',
                fontWeight: '700',
                letterSpacing: '0.016rem',
                lineHeight: '37px',
              }}
            >
              $neodash_
            </span>
          </div>
          <TextInput
            className={textInputClass}
            aria-label='Choose variable'
            fluid
            style={{ fontWeight: 700 }}
            placeholder=''
            value={rule.customizationValue}
            onChange={(e) => updateRuleField(index, 'customizationValue', e.target.value)}
          ></TextInput>
        </div>
      );
    } else if (customization == 'set page') {
      return (
        <>
          <div style={{ marginLeft: 15, display: 'inline-block' }}>
            <span
              style={{
                height: '2.25rem',
                paddingTop: '0.5rem',
                paddingBottom: '0.5rem',
                fontSize: 'var(--font-size-body-medium)',
                fontWeight: '700',
                letterSpacing: '0.016rem',
                lineHeight: '36px',
              }}
            >
              index/name
            </span>
          </div>
        </>
      );
    }
    return undefined;
  };

  // Naming convention: td2 = table data 2. Conditional styling was implemented for each table data depending on whether the chart type == bar or not.
  // Styling was then extracted into functions outside of the html components, hence the naming.
  const td2Styling = (type) => ({ width: type === 'bar' ? '15%' : '30%' });
  const td2DropdownClassname = (type) => `n-align-middle n-pr-1 ${type === 'bar' ? 'n-w-full' : 'n-w-2/5'}`;
  const td2Autocomplete = (type, index, rule) =>
    (type !== 'bar' && rule.condition !== 'rowCheck' ? (
      <Autocomplete
        className='n-align-middle n-inline-block n-w-/5'
        disableClearable={true}
        id='autocomplete-label-type'
        size='small'
        noOptionsText='*Specify an exact field name'
        options={createFieldVariableSuggestionsFromRule(rule, true)}
        value={rule.field ? rule.field : ''}
        inputValue={rule.field ? rule.field : ''}
        popupIcon={<></>}
        style={{
          minWidth: 125,
        }}
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
    ) : (
      <></>
    ));
  const td4Styling = (type) => ({ width: type === 'bar' ? '45%' : '40%' });
  const td4DropdownClassname = 'n-align-middle, n-w-1/3';
  const td6Styling = (type) => ({ width: type === 'bar' ? '30%' : '20%' });

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

              <table style={{ width: '100%' }}>
                {rules.map((rule, index) => {
                  const ruleType = RULE_BASED_REPORT_ACTIONS_CUSTOMIZATIONS[type].find(
                    (el) => el.value === rule.customization
                  );
                  const ruleTrigger = RULE_CONDITIONS[type].find((el) => el.value === rule.condition);

                  return (
                    <>
                      <tr>
                        <td width='5%' className='n-pr-1'>
                          <span className='n-pr-1'>{index + 1}.</span>
                          <span className='n-font-bold'>&nbsp;ON</span>
                        </td>

                        {/* <--      td2 (table data 2)      -->*/}

                        <td style={td2Styling(type)}>
                          <div style={{ border: '2px dashed grey' }} className='n-p-1'>
                            <Dropdown
                              type='select'
                              className={td2DropdownClassname(type)}
                              style={{
                                minWidth: '140px',
                                width: ruleTrigger?.disableFieldSelection === true ? '100%' : '140px',
                                display: 'inline-block',
                              }}
                              selectProps={{
                                onChange: (newValue) => updateRuleField(index, 'condition', newValue.value),
                                options:
                                  RULE_CONDITIONS[type] &&
                                  RULE_CONDITIONS[type].map((option) => ({
                                    label: option.label,
                                    value: option.value,
                                  })),
                                value: { label: ruleTrigger ? ruleTrigger.label : '', value: rule.condition },
                              }}
                            ></Dropdown>
                            {td2Autocomplete(type, index, rule)}
                          </div>
                        </td>

                        {/* <--      td3 (table data 3)      -->*/}

                        <td style={{ width: '6%' }} className='n-text-center'>
                          <span style={{ fontWeight: 'bold', color: 'black', marginLeft: 5, marginRight: 5 }}>
                            {!ruleTrigger?.multiple ? 'SET' : 'APPEND'}
                          </span>
                        </td>

                        {/* <--      td4 (table data 4)      -->*/}

                        <td style={td4Styling(type)}>
                          <div style={{ border: '2px dashed grey' }} className='n-p-1'>
                            <Dropdown
                              type='select'
                              className={td4DropdownClassname}
                              style={{ minWidth: 130, display: 'inline-block' }}
                              fluid
                              selectProps={{
                                onChange: (newValue) => updateRuleField(index, 'customization', newValue.value),
                                options:
                                  RULE_BASED_REPORT_ACTIONS_CUSTOMIZATIONS[type] &&
                                  RULE_BASED_REPORT_ACTIONS_CUSTOMIZATIONS[type].map((option) => ({
                                    label: option.label,
                                    value: option.value,
                                  })),
                                value: { label: ruleType ? ruleType.label : '', value: rule.customization },
                              }}
                            ></Dropdown>
                            {getActionHelper(rule, index, rules[index].customization)}
                          </div>
                        </td>

                        {/* <--      td5 (table data 5)       -->*/}

                        <td width='5%' className='n-text-center'>
                          <span style={{ fontWeight: 'bold', color: 'black', marginLeft: 5, marginRight: 5 }}>
                            {!ruleTrigger?.multiple ? 'TO' : 'WITH'}
                          </span>
                        </td>

                        {/* <--      td6 (table data 6)       -->*/}

                        <td style={td6Styling(type)}>
                          <div style={{ border: '2px dashed grey' }} className='n-p-1'>
                            <Autocomplete
                              disableClearable={true}
                              size='small'
                              className='n-align-middle n-inline-block n-w-full'
                              id='autocomplete-label-type'
                              noOptionsText='*Specify an exact field name'
                              options={createFieldVariableSuggestionsFromRule(rule, false)}
                              value={rule.value || ''}
                              inputValue={rule.value || ''}
                              popupIcon={<></>}
                              style={{ minWidth: 250 }}
                              onInputChange={(e, value) => handleOnInputchange(rule.customization, index, value)}
                              onChange={(e, newValue) => handleOnChange(rule.customization, index, newValue)}
                              renderInput={(params) => (
                                <TextField {...params} placeholder='Value name...' InputLabelProps={{ shrink: true }} />
                              )}
                            />
                          </div>
                        </td>

                        <td width='5%'>
                          <IconButton
                            aria-label='remove rule'
                            size='medium'
                            style={{ marginLeft: 10 }}
                            floating
                            onClick={() => {
                              setRules([...rules.slice(0, index), ...rules.slice(index + 1)]);
                            }}
                          >
                            <XMarkIconOutline />
                          </IconButton>
                        </td>
                      </tr>
                    </>
                  );
                })}

                <tr>
                  <td colSpan={7}>
                    <div className='n-text-center n-mt-1'>
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
              <SparklesIconOutline className='btn-icon-lg-r' />
            </Button>
          </Dialog.Actions>
        </Dialog>
      ) : (
        <></>
      )}
    </div>
  );
};

export default NeoCustomReportActionsModal;
