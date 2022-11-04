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
import TuneIcon from '@material-ui/icons/Tune';
import { Autocomplete } from '@material-ui/lab';

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
    const newRules = [...rules]; // Deep copy
    newRules[ruleIndex][ruleField] = ruleFieldValue;
    setRules(newRules);
  };

    return (
        <div>
            {customReportStyleModalOpen ?
                <Dialog maxWidth={"xl"} open={customReportStyleModalOpen == true}
                    PaperProps={{
                        style: {
                            overflow: 'inherit'
                        },
                    }}
                    style={{ overflow: "inherit", overflowY: "inherit" }}
                    aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">
                        <TuneIcon style={{
                            height: "30px",
                            paddingTop: "4px",
                            marginBottom: "-8px",
                            marginRight: "5px",
                            paddingBottom: "5px"
                        }} />
                        Rule-Based Styling
                        <IconButton onClick={handleClose} style={{ padding: "3px", float: "right" }}>
                            <Badge badgeContent={""} >
                                <CloseIcon />
                            </Badge>
                        </IconButton>
                    </DialogTitle>
                    <div>
                        <DialogContent style={{ overflow: "inherit" }}>
                            <p>You can define rule-based styling for the report here. <br />
                                Style rules are checked in-order and override the default behaviour - if no rules are valid, no style is applied.<br />
                                {(type == "graph" || type == "map") ? <p>For <b>{type}</b> reports, the field name should be specified in the format <code>label.name</code>, for example: <code>Person.age</code>. This is case-sensentive.</p> : <></>}
                                {(type == "line" || type == "value" || type == "bar" || type == "pie" || type == "table") ? <p>For <b>{type}</b> reports, the field name should be the exact name of the returned field. <br />For example, if your query is <code>MATCH (n:Movie) RETURN n.rating as Rating</code>, your field name is <code>Rating</code>.</p> : <></>}
                            </p>
                            <div>

                                <hr></hr>

                                <table>
                                    {rules.map((rule, index) => {
                                        return <>
                                            <tr>

                                       
                                            <td style={{ paddingLeft: "2px", paddingRight: "2px" }}><span style={{ color: "black", width: "50px" }}>{index+1}.</span></td>
                                                <td style={{ paddingLeft: "20px", paddingRight: "20px" }}><span style={{ fontWeight: "bold", color: "black", width: "50px" }}> IF</span></td>
                                                <div style={{ border: "2px dashed grey" }}>
                                                    <td style={{ paddingLeft: "5px", paddingRight: "5px", paddingTop: "5px", paddingBottom: "5px" }}>
                                                        <Autocomplete
                                                            disableClearable={true}
                                                            id="autocomplete-label-type"
                                                            noOptionsText="*Specify an exact field name"
                                                            options={createFieldVariableSuggestions().filter(e => e.toLowerCase().includes(rule['field'].toLowerCase()))}
                                                            value={rule['field'] ? rule['field'] : ""}
                                                            inputValue={rule['field'] ? rule['field'] : ""}
                                                            popupIcon={<></>}
                                                            style={{ display: "inline-block", width: 185, marginLeft: "5px", marginTop: "5px" }}
                                                            onInputChange={(event, value) => {
                                                                updateRuleField(index, 'field', value)
                                                            }}
                                                            onChange={(event, newValue) => {
                                                                updateRuleField(index, 'field', newValue)
                                                            }}
                                                            renderInput={(params) => <TextField {...params} placeholder="Field name..." InputLabelProps={{ shrink: true }} />}
                                                        />
                                                    </td>
                                                    <td style={{ paddingLeft: "5px", paddingRight: "5px" }}>
                                                        <TextField select value={rule['condition']}
                                                            onChange={(e) => updateRuleField(index, 'condition', e.target.value)}>
                                                            {RULE_CONDITIONS.map((option) => (
                                                                <MenuItem key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField></td>
                                                    <td style={{ paddingLeft: "5px", paddingRight: "5px" }}><TextField placeholder="Value..." value={rule['value']}
                                                        onChange={(e) => updateRuleField(index, 'value', e.target.value)}></TextField></td>
                                                </div>
                                                <td style={{ paddingLeft: "20px", paddingRight: "20px" }}><span style={{ fontWeight: "bold", color: "black", width: "50px" }}>THEN</span></td>
                                                <div style={{ border: "2px dashed grey", marginBottom: "5px" }}>
                                                    <td style={{ paddingLeft: "5px", paddingRight: "5px", paddingTop: "5px", paddingBottom: "5px" }}>
                                                        <TextField select value={rule['customization']}
                                                            onChange={(e) => updateRuleField(index, 'customization', e.target.value)}>
                                                            {RULE_BASED_REPORT_CUSTOMIZATIONS[type] && RULE_BASED_REPORT_CUSTOMIZATIONS[type].map((option) => (
                                                                <MenuItem key={option.value} value={option.value}>
                                                                    {option.label}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField></td>
                                                    <td style={{ paddingLeft: "5px", paddingRight: "5px", paddingTop: "5px", paddingBottom: "5px" }}>
                                                        <TextField style={{ width: "20px", color: "black" }} disabled={true} value={'='}></TextField>
                                                    </td>
                                                    <td style={{ paddingLeft: "5px", paddingRight: "5px" }}><NeoColorPicker label="" defaultValue="black" key={undefined} style={undefined} value={rule['customizationValue']} onChange={(value) => updateRuleField(index, 'customizationValue', value)} ></NeoColorPicker></td>
                                                </div>
                                                <td>
                                                    <Fab size="small" aria-label="add" style={{ background: "black", color: "white", marginTop: "-6px", marginLeft: "20px" }}
                                                        onClick={() => {
                                                            setRules([...rules.slice(0, index), ...rules.slice(index + 1)])
                                                        }} >
                                                        <CloseIcon />
                                                    </Fab>
                                                </td>
                                            </tr></>
                                    })}

                                    <tr >
                                        <td style={{ minWidth: '850px'}} colSpan={5}>
                                            <Typography variant="h3" color="primary" style={{ textAlign: "center", marginBottom: "5px" }}>
                                                <Fab size="small" aria-label="add" style={{ background: "white", color: "black" }}
                                                    onClick={() => {
                                                        const newRule = getDefaultRule(RULE_BASED_REPORT_CUSTOMIZATIONS[type][0]['value']);
                                                        setRules(rules.concat(newRule));
                                                    }} >
                                                    <AddIcon />
                                                </Fab>
                                            </Typography>

                                        </td>
                                    </tr>
                                </table>

                                <hr></hr>

                            </div>

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
                                id="autocomplete-label-type"
                                noOptionsText="*Specify an exact field name"
                                options={createFieldVariableSuggestions().filter((e) =>
                                  e.toLowerCase().includes(rule.field.toLowerCase()),
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
                                  <TextField
                                    {...params}
                                    placeholder="Field name..."
                                    InputLabelProps={{ shrink: true }}
                                  />
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
                                placeholder="Value..."
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
                                label=""
                                defaultValue="black"
                                key={undefined}
                                style={undefined}
                                value={rule.customizationValue}
                                onChange={(value) => updateRuleField(index, 'customizationValue', value)}
                              ></NeoColorPicker>
                            </td>
                          </div>
                          <td>
                            <Fab
                              size="small"
                              aria-label="add"
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
                    <td style={{ borderBottom: '1px solid grey', width: '750px' }} colSpan={5}>
                      <Typography variant="h3" color="primary" style={{ textAlign: 'center', marginBottom: '5px' }}>
                        <Fab
                          size="small"
                          aria-label="add"
                          style={{ background: 'white', color: 'black' }}
                          onClick={() => {
                            const newRule = getDefaultRule(RULE_BASED_REPORT_CUSTOMIZATIONS[type][0].value);
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
                color="default"
                variant="contained"
                size="large"
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

export default NeoCustomReportStyleModal;
