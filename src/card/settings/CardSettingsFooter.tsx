import React, { useEffect } from 'react';
import debounce from 'lodash/debounce';
import { useCallback } from 'react';
import { FormGroup, Tooltip } from '@mui/material';
import NeoSetting from '../../component/field/Setting';
import {
  NeoCustomReportStyleModal,
  RULE_BASED_REPORT_CUSTOMIZATIONS,
} from '../../extensions/styling/StyleRuleCreationModal';
import { getReportTypes } from '../../extensions/ExtensionUtils';
import { RULE_BASED_REPORT_ACTIONS_CUSTOMIZATIONS } from '../../extensions/actions/ActionsRuleCreationModal';
import NeoCustomReportActionsModal from '../../extensions/actions/ActionsRuleCreationModal';
import { AdjustmentsHorizontalIconOutline, SparklesIconOutline } from '@neo4j-ndl/react/icons';
import { IconButton, Switch } from '@neo4j-ndl/react';

const update = (state, mutations) => Object.assign({}, state, mutations);

const NeoCardSettingsFooter = ({
  type,
  fields = [],
  schema = [],
  reportSettings,
  reportSettingsOpen,
  extensions = {},
  onToggleReportSettings,
  onReportSettingUpdate,
}) => {
  const [reportSettingsText, setReportSettingsText] = React.useState(reportSettings);

  // Variables related to customizing report settings
  const [customReportStyleModalOpen, setCustomReportStyleModalOpen] = React.useState(false);
  const settingToCustomize = 'styleRules';

  // Variables related to customizing report actions
  const [customReportActionsModalOpen, setCustomReportActionsModalOpen] = React.useState(false);
  const actionsToCustomize = 'actionsRules';

  const debouncedReportSettingUpdate = useCallback(debounce(onReportSettingUpdate, 250), []);

  const updateSpecificReportSetting = (field: string, value: unknown) => {
    const entry = {};
    entry[field] = value;
    setReportSettingsText(update(reportSettingsText, entry));
    debouncedReportSettingUpdate(field, value);
  };

  const reportTypes = getReportTypes(extensions);

  // Contains, for a certain type of chart, its disabling logic
  const disabledDependency = reportTypes[type] && reportTypes[type].disabledDependency;

  /**
   * This method manages the disabling logic for all the settings inside the footer.
   * The logic is based on the disabledDependency param inside the chart's configuration
   * @param field
   * @returns
   */
  const getDisabled = (field: string) => {
    // By default an option is enabled
    let isDisabled = false;
    let dependencyLogic = disabledDependency[field];
    if (dependencyLogic != undefined) {
      // Getting the current parameter defined in the settings of the report
      // (if undefined, the param will be treated as undefined (boolean false)
      let currentValue = reportSettingsText[dependencyLogic.dependsOn];
      if (typeof dependencyLogic.operator === 'boolean') {
        if (!dependencyLogic.operator) {
          isDisabled = !currentValue;
        }
      }
      // if the value is in the list of values that enable the option, then enable the option
      else if (dependencyLogic.operator === 'not in') {
        isDisabled = !dependencyLogic.values.includes(currentValue);
      }
    }
    return isDisabled;
  };

  useEffect(() => {
    // Reset text to the dashboard state when the page gets reorganized.
    setReportSettingsText(reportSettings);
  }, [JSON.stringify(reportSettings)]);

  const settings = reportTypes[type] ? reportTypes[type].settings : {};

  // If there are no advanced settings, render nothing.
  if (Object.keys(settings).length == 0) {
    return <div></div>;
  }

  // Else, build the advanced settings view.
  const advancedReportSettings = (
    <div style={{ marginLeft: '5px' }}>
      {Object.keys(settings).map((setting) => {
        let isDisabled = false;
        // Adding disabling logic to specific entries but only if the logic is defined inside the configuration
        if (disabledDependency != undefined) {
          isDisabled = getDisabled(setting);
        }
        return (
          <NeoSetting
            key={setting}
            name={setting}
            value={reportSettingsText[setting]}
            type={settings[setting].type}
            label={settings[setting].label}
            defaultValue={settings[setting].default}
            choices={settings[setting].values}
            disabled={isDisabled}
            onChange={(e) => updateSpecificReportSetting(setting, e)}
          />
        );
      })}
    </div>
  );

  // TODO - Make the extensions more pluggable and dynamic, instead of hardcoded here.
  // ^ keep modals at a higher level in the object hierarchy instead of injecting in the footer.
  return (
    <div>
      {extensions.styling && extensions.styling.active ? (
        <NeoCustomReportStyleModal
          settingName={settingToCustomize}
          settingValue={reportSettings[settingToCustomize]}
          type={type}
          fields={fields}
          schema={schema}
          customReportStyleModalOpen={customReportStyleModalOpen}
          setCustomReportStyleModalOpen={setCustomReportStyleModalOpen}
          onReportSettingUpdate={onReportSettingUpdate}
        ></NeoCustomReportStyleModal>
      ) : (
        <></>
      )}

      {extensions.actions && extensions.actions.active ? (
        <NeoCustomReportActionsModal
          settingName={actionsToCustomize}
          settingValue={reportSettings[actionsToCustomize]}
          type={type}
          fields={fields}
          customReportActionsModalOpen={customReportActionsModalOpen}
          setCustomReportActionsModalOpen={setCustomReportActionsModalOpen}
          onReportSettingUpdate={onReportSettingUpdate}
        ></NeoCustomReportActionsModal>
      ) : (
        <></>
      )}

      <table
        style={{
          borderTop: '1px dashed lightgrey',
          width: '100%',
        }}
      >
        <tbody>
          <tr>
            <td>
              <FormGroup className='n-my-2'>
                <Switch
                  label='Advanced settings'
                  checked={reportSettingsOpen}
                  onChange={onToggleReportSettings}
                  className='n-ml-2'
                />
              </FormGroup>
            </td>
            <td>
              {RULE_BASED_REPORT_CUSTOMIZATIONS[type] && extensions.styling && extensions.styling.active ? (
                <Tooltip title='Set rule-based styling' aria-label='' disableInteractive>
                  <IconButton
                    style={{ float: 'right', marginRight: '10px' }}
                    aria-label='custom styling'
                    onClick={() => {
                      setCustomReportStyleModalOpen(true); // Open the modal.
                    }}
                    clean
                  >
                    <AdjustmentsHorizontalIconOutline />
                  </IconButton>
                </Tooltip>
              ) : (
                <></>
              )}
              {extensions.actions && extensions.actions.active && RULE_BASED_REPORT_ACTIONS_CUSTOMIZATIONS[type] ? (
                <Tooltip title='Set report actions' aria-label='' disableInteractive>
                  <IconButton
                    style={{ float: 'right' }}
                    aria-label='custom actions'
                    clean
                    onClick={() => {
                      setCustomReportActionsModalOpen(true); // Open the modal.
                    }}
                  >
                    <SparklesIconOutline />
                  </IconButton>
                </Tooltip>
              ) : (
                <></>
              )}
            </td>
          </tr>
          <tr>
            <td colSpan={2} style={{ maxWidth: '100%' }}>
              {reportSettingsOpen ? advancedReportSettings : <div></div>}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default NeoCardSettingsFooter;
