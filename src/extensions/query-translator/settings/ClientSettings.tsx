import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { debounce, List, ListItem } from '@mui/material';
import { getModelProviderObject, getQueryTranslatorDefaultConfig } from '../QueryTranslatorConfig';
import { getClientSettings } from '../state/QueryTranslatorSelector';
import NeoSetting from '../../../component/field/Setting';
import { settingsReducer } from '../../../settings/SettingsReducer';

const update = (state, mutations) => Object.assign({}, state, mutations);

// TODO - this is also very similar to the existing settings form in the card settings.
export const ClientSettings = ({ modelProvider, settingState, setSettingsState }) => {
  const defaultSettings = getQueryTranslatorDefaultConfig(modelProvider);
  const requiredSettings = Object.keys(defaultSettings).filter((setting) => defaultSettings[setting].required);
  const [localSettings, setLocalSettings] = React.useState(settingState);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [localClient, setLocalClient] = React.useState(undefined);
  const [settingChoices, setSettingChoices] = React.useState({});

  const updateSpecificSettingChoices = (field: string, value: any) => {
    const entry = {};
    entry[field] = value;
    setSettingChoices(update(settingChoices, entry));
  };

  const updateSpecificExtensionSetting = (field: string, value: any, local = false) => {
    const entry = {};
    entry[field] = value;
    local ? setLocalSettings(update(localSettings, entry)) : setSettingsState(update(settingState, entry));
  };
  const debouncedUpdateSpecificExtensionSetting = useCallback(debounce(updateSpecificExtensionSetting, 500), []);

  function checkIfDisabled(setting) {
    let tmp = defaultSettings[setting];
    if (tmp.required || isAuthenticated) {
      return false;
    }
    return !requiredSettings.every((e) => settingState[e]);
  }

  useEffect(() => {
    let clientObject = getModelProviderObject(modelProvider, settingState);
    clientObject.authenticate(setIsAuthenticated);
  }, [settingState.apiKey]);

  useEffect(() => {
    let localClientTmp = getModelProviderObject(modelProvider, settingState);
    if (isAuthenticated) {
      setLocalClient(localClientTmp);
    }
    let tmpSettingsChoices = {};
    Object.keys(defaultSettings).map((setting) => {
      tmpSettingsChoices[setting] = setChoices(setting, localClientTmp);
    });
  }, [isAuthenticated]);

  function setChoices(setting, localClientTmp) {
    let choices = defaultSettings[setting].values ? defaultSettings[setting].values : [];
    let { methodFromClient } = defaultSettings[setting];
    if (methodFromClient && isAuthenticated) {
      localClientTmp[methodFromClient]().then((value) => {
        updateSpecificSettingChoices(setting, value);
      });
    } else {
      updateSpecificSettingChoices(setting, choices);
    }
  }

  const component = (
    <List style={{ marginLeft: 12, marginRight: 12 }}>
      {Object.keys(defaultSettings).map((setting) => {
        let disabled = checkIfDisabled(setting);
        return (
          <ListItem style={{ padding: 0 }}>
            <NeoSetting
              key={setting}
              name={setting}
              value={localSettings[setting]}
              disabled={disabled}
              type={defaultSettings[setting].type}
              label={`${defaultSettings[setting].label} - ${
                setting == 'apiKey' ? (isAuthenticated ? '( Authenticated )' : '( Not Authenticated )') : ''
              }`}
              defaultValue={defaultSettings[setting].default}
              choices={settingChoices[setting] ? settingChoices[setting] : []}
              onChange={(e) => {
                updateSpecificExtensionSetting(setting, e, true);
                debouncedUpdateSpecificExtensionSetting(setting, e);
              }}
            />
          </ListItem>
        );
      })}
    </List>
  );
  return component;
};

const mapStateToProps = (state) => ({
  settings: getClientSettings(state),
});

const mapDispatchToProps = (_dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ClientSettings);
