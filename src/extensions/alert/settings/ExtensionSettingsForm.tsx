import { ListItem, List } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import NeoSetting from '../../../component/field/Setting';
import { getExtensionDefaultConfig } from '../../ExtensionsConfig';

const update = (state, mutations) => Object.assign({}, state, mutations);

export const ExtensionSettingsForm = ({
  isAdvancedSettingsOpen,
  setSettingsToSave,
  extensionName,
  extensionSettings,
  defaultSettings,
}) => {
  let _extensionName = extensionName;
  const [reportSettingsText, setReportSettingsText] = React.useState(extensionSettings);
  const [allSettings, _setAllSettings] = React.useState(defaultSettings);

  const updateSpecificExtensionSetting = (field: string, value: any) => {
    const entry = {};
    entry[field] = value;
    setReportSettingsText(update(reportSettingsText, entry));
    setSettingsToSave(update(reportSettingsText, entry));
  };

  return isAdvancedSettingsOpen ? (
    <List>
      {Object.keys(allSettings).map((setting) => {
        return (
          <ListItem>
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
