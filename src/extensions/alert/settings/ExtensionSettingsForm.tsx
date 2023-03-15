import { ListItem, List } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import NeoSetting from '../../../component/field/Setting';
import { getExtensionDefaultConfig } from '../../ExtensionsConfig';

const update = (state, mutations) => Object.assign({}, state, mutations);

// TODO - this is also very similar to the existing settings form in the card settings.
export const ExtensionSettingsForm = ({
  isAdvancedSettingsOpen,
  setSettingsToSave,
  extensionSettings,
  defaultSettings,
}) => {
  const [reportSettingsText, setReportSettingsText] = React.useState(extensionSettings);
  const [allSettings, setAllSettings] = React.useState(defaultSettings);

  const updateSpecificExtensionSetting = (field: string, value: any) => {
    const entry = {};
    entry[field] = value;
    setReportSettingsText(update(reportSettingsText, entry));
    setSettingsToSave(update(reportSettingsText, entry));
  };

  return isAdvancedSettingsOpen ? (
    <List style={{ marginLeft: 12, marginRight: 12 }}>
      {Object.keys(allSettings).map((setting) => {
        return (
          <ListItem style={{ padding: 0 }}>
            <NeoSetting
              key={setting}
              name={setting}
              value={reportSettingsText[setting]}
              type={defaultSettings[setting].type}
              label={defaultSettings[setting].label}
              defaultValue={defaultSettings[setting].default}
              choices={defaultSettings[setting].values}
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

const mapStateToProps = (state, ownProps) => ({
  defaultSettings: getExtensionDefaultConfig(ownProps.extensionName),
});

const mapDispatchToProps = (_dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ExtensionSettingsForm);
