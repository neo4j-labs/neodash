import { ListItem, List } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import NeoSetting from '../../../component/field/Setting';
import { getPageNumbersAndNames } from '../../../dashboard/DashboardSelectors';
import { getNodeSidebarDefaultConfig } from '../SidebarConfig';

const update = (state, mutations) => Object.assign({}, state, mutations);

// TODO - this is also very similar to the existing settings form in the card settings.
export const ExtensionSettingsForm = ({
  isAdvancedSettingsOpen,
  setSettingsToSave,
  extensionSettings,
  defaultSettings,
  pagesList,
}) => {
  const [reportSettingsText, setReportSettingsText] = React.useState(extensionSettings);

  /**
   * Given a setting name in input, return the state value needed to
   * fill the choices in the advanced settings
   * @param setting Name of the settings
   * @returns Values got from the state
   */
  function getValuesFromState(setting) {
    let res;
    if (setting === 'moveToPage') {
      res = [...pagesList];
      res.unshift(defaultSettings[setting].default);
    }
    return res;
  }

  const updateSpecificExtensionSetting = (field: string, value: any) => {
    const entry = {};
    entry[field] = value;
    setReportSettingsText(update(reportSettingsText, entry));
    setSettingsToSave(update(reportSettingsText, entry));
  };

  return isAdvancedSettingsOpen ? (
    <List style={{ marginLeft: 12, marginRight: 12 }}>
      {Object.keys(defaultSettings).map((setting) => {
        let choices = defaultSettings[setting].values;

        // Some settings need to get their choices from the application state
        if (defaultSettings[setting].needsStateValues) {
          choices = getValuesFromState(setting);
        }
        return (
          <ListItem style={{ padding: 0 }}>
            <NeoSetting
              key={setting}
              name={setting}
              value={reportSettingsText[setting]}
              type={defaultSettings[setting].type}
              label={defaultSettings[setting].label}
              defaultValue={defaultSettings[setting].default}
              choices={choices}
              onChange={(e) => updateSpecificExtensionSetting(setting, e)}
            />
          </ListItem>
        );
      })}
    </List>
  ) : (
    <></>
  );
};

const mapStateToProps = (state) => ({
  defaultSettings: getNodeSidebarDefaultConfig(),
  pagesList: getPageNumbersAndNames(state),
});

const mapDispatchToProps = (_dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ExtensionSettingsForm);
