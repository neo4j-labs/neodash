import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { debounce, List, ListItem } from '@mui/material';
import { getModelClientObject, getQueryTranslatorDefaultConfig } from '../QueryTranslatorConfig';
import { getClientSettings } from '../state/QueryTranslatorSelector';
import NeoSetting from '../../../component/field/Setting';
import { setGlobalModelClient } from '../state/QueryTranslatorActions';

const update = (state, mutations) => Object.assign({}, state, mutations);

// TODO: the following
// 1. the settings modal should save only when all the required fields are defined and we can correctly authenticate
export const ClientSettings = ({ modelProvider, settingState, setSettingsState }) => {
  const defaultSettings = getQueryTranslatorDefaultConfig(modelProvider);
  const requiredSettings = Object.keys(defaultSettings).filter((setting) => defaultSettings[setting].required);
  const [localSettings, setLocalSettings] = React.useState(settingState);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [settingChoices, setSettingChoices] = React.useState({});

  /**
   * Method used to update a certain field inside a state object.
   * @param field Name of the field to update
   * @param value Value to set for the specified field
   * @param stateObj Object to update
   * @param setFunction Function used to update stateObj
   */
  const updateSpecificFieldInStateObject = (field: string, value: any, stateObj, setFunction) => {
    const entry = {};
    entry[field] = value;
    setFunction(update(stateObj, entry));
  };

  const debouncedUpdateSpecificFieldInStateObject = useCallback(debounce(updateSpecificFieldInStateObject, 500), []);

  /**
   * Function used from each setting to understand if it needs to be disabled
   * @param setting Name of the setting to check
   * @returns False if not disabled, otherwise True
   */
  function checkIfDisabled(setting) {
    let tmp = defaultSettings[setting];
    if (tmp.required || isAuthenticated) {
      return false;
    }
    return !requiredSettings.every((e) => settingState[e]);
  }

  // Effect used to authenticate the client when the apiKey changed
  // TODO: change to modelClientInitializationThunk when having a button to set the state globally and not only local as right now
  useEffect(() => {
    let clientObject = getModelClientObject(modelProvider, settingState);
    clientObject.authenticate(setIsAuthenticated);
  }, [settingState.apiKey]);

  // Effect used to trigger the population of the settings when the user inserts a correct apiKey
  useEffect(() => {
    let localClientTmp = getModelClientObject(modelProvider, settingState);
    if (isAuthenticated) {
      setGlobalModelClient(localClientTmp);
    } else {
      setGlobalModelClient(undefined);
    }
    let tmpSettingsChoices = {};
    Object.keys(defaultSettings).map((setting) => {
      tmpSettingsChoices[setting] = setChoices(setting, localClientTmp);
    });
  }, [isAuthenticated]);

  /**
   * Function used to handle the definition of the choices param inside the settings form.
   * If needed, it will get the choices from the client
   * @param setting Name of the setting that we need to populate
   * @param modelClient Client to call the AI model
   */
  function setChoices(setting, modelClient) {
    let choices = defaultSettings[setting].values ? defaultSettings[setting].values : [];
    let { methodFromClient } = defaultSettings[setting];
    if (methodFromClient && isAuthenticated) {
      modelClient[methodFromClient]().then((value) => {
        updateSpecificFieldInStateObject(setting, value, settingChoices, setSettingChoices);
      });
    } else {
      updateSpecificFieldInStateObject(setting, choices, settingChoices, setSettingChoices);
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
              label={
                // TODO: change this label for api to a button that verifies the auth,
                // if verified, then show the other options.(should be verified for all REQUIRED options in defaultConfig)
                `${defaultSettings[setting].label} - ${
                  setting == 'apiKey' ? (isAuthenticated ? '( Authenticated )' : '( Not Authenticated )') : ''
                }`
              }
              defaultValue={defaultSettings[setting].default}
              choices={settingChoices[setting] ? settingChoices[setting] : []}
              onChange={(e) => {
                updateSpecificFieldInStateObject(setting, e, localSettings, setLocalSettings);
                debouncedUpdateSpecificFieldInStateObject(setting, e, settingState, setSettingsState);
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

const mapDispatchToProps = (dispatch) => ({
  setGlobalModelClient: (modelClient) => {
    dispatch(setGlobalModelClient(modelClient));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientSettings);
