import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { debounce, List, ListItem } from '@mui/material';
import { getModelClientObject, getQueryTranslatorDefaultConfig } from '../QueryTranslatorConfig';
import { getQueryTranslatorSettings } from '../state/QueryTranslatorSelector';
import NeoSetting from '../../../component/field/Setting';
import {
  deleteAllMessageHistory,
  setClientSettings,
  setGlobalModelClient,
  setModelProvider,
} from '../state/QueryTranslatorActions';
import {
  PlayCircleIconSolid,
  CheckCircleIconSolid,
  PlayIconSolid,
  ExclamationTriangleIconSolid,
} from '@neo4j-ndl/react/icons';
import { Button, IconButton } from '@neo4j-ndl/react';
import { modelClientInitializationThunk } from '../state/QueryTranslatorThunks';

const update = (state, mutations) => Object.assign({}, state, mutations);

export enum Status {
  NOT_AUTHENTICATED,
  AUTHENTICATED,
  ERROR,
}

// TODO: the following
// 1. the settings modal should save only when all the required fields are defined and we can correctly authenticate
export const ClientSettings = ({
  modelProvider,
  settingState,
  setSettingsState,
  authenticate,
  updateModelProvider,
  updateClientSettings,
  deleteAllMessageHistory,
  handleClose,
}) => {
  const defaultSettings = getQueryTranslatorDefaultConfig(modelProvider);
  const requiredSettings = Object.keys(defaultSettings).filter((setting) => defaultSettings[setting].required);
  const [localSettings, setLocalSettings] = React.useState(settingState);

  const [status, setStatus] = React.useState(Status.NOT_AUTHENTICATED);
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
    if (tmp.required || status == Status.AUTHENTICATED) {
      return false;
    }
    return !requiredSettings.every((e) => settingState[e]);
  }

  // Effect used to trigger the population of the settings when the user inserts a correct apiKey
  useEffect(() => {
    let localClientTmp = getModelClientObject(modelProvider, settingState);
    if (status == Status.AUTHENTICATED) {
      setGlobalModelClient(localClientTmp);
    } else {
      setGlobalModelClient(undefined);
    }
    let tmpSettingsChoices = {};
    Object.keys(defaultSettings).map((setting) => {
      tmpSettingsChoices[setting] = setChoices(setting, localClientTmp);
    });
  }, [status]);

  /**
   * Function used to handle the definition of the choices param inside the settings form.
   * If needed, it will get the choices from the client
   * @param setting Name of the setting that we need to populate
   * @param modelClient Client to call the AI model
   */
  function setChoices(setting, modelClient) {
    let choices = defaultSettings[setting].values ? defaultSettings[setting].values : [];
    let { methodFromClient } = defaultSettings[setting];
    if (methodFromClient && status == Status.AUTHENTICATED) {
      modelClient[methodFromClient]().then((value) => {
        updateSpecificFieldInStateObject(setting, value, settingChoices, setSettingChoices);
      });
    } else {
      updateSpecificFieldInStateObject(setting, choices, settingChoices, setSettingChoices);
    }
  }

  const getBackgroundColor = (status) => {
    if (status == Status.AUTHENTICATED) {
      return 'green';
    } else if (status == Status.NOT_AUTHENTICATED) {
      return 'orange';
    }
    return 'red';
  };

  // Prevent authentication if all required fields are not full (EX: look at checkIfDisabled)
  const authButton = (
    <IconButton
      key={'auth-setting'}
      aria-label='connect'
      onClick={(e) => {
        e.preventDefault();
        updateModelProvider(modelProvider);
        updateClientSettings(settingState);
        authenticate(setStatus);
      }}
      clean
      style={{
        marginTop: 24,
        marginRight: 28,
        color: 'white',
        backgroundColor: getBackgroundColor(status),
      }}
      size='medium'
    >
      {status == Status.AUTHENTICATED ? (
        <CheckCircleIconSolid />
      ) : status == Status.NOT_AUTHENTICATED ? (
        <PlayCircleIconSolid color='white' />
      ) : (
        <ExclamationTriangleIconSolid />
      )}
    </IconButton>
  );

  const component = (
    <List style={{ marginLeft: 0, marginRight: 0 }}>
      {/* Only render the base settings (required for auth) if no authentication is available. */}
      {Object.keys(defaultSettings)
        .filter((setting) => defaultSettings[setting].authentication == true || status == Status.AUTHENTICATED)
        .map((setting) => {
          let disabled = checkIfDisabled(setting);
          return (
            <ListItem key={`list-${  setting}`} style={{ padding: 0 }}>
              <NeoSetting
                key={setting}
                style={{ marginLeft: 0, marginRight: 0 }}
                name={setting}
                value={localSettings[setting]}
                disabled={disabled}
                type={defaultSettings[setting].type}
                label={defaultSettings[setting].label}
                defaultValue={defaultSettings[setting].default}
                choices={settingChoices[setting] ? settingChoices[setting] : []}
                onChange={(e) => {
                  updateSpecificFieldInStateObject(setting, e, localSettings, setLocalSettings);
                  debouncedUpdateSpecificFieldInStateObject(setting, e, settingState, setSettingsState);

                  if (defaultSettings[setting].hasAuthButton) {
                    setStatus(Status.NOT_AUTHENTICATED);
                  }
                }}
              />
              {/* TODO: Only show auth button if all required fields are filled in. */}
              {defaultSettings[setting].hasAuthButton == true ? authButton : <></>}
            </ListItem>
          );
        })}
      <br />
      {status == Status.AUTHENTICATED && Object.keys(defaultSettings).every((n) => localSettings[n] !== undefined) ? (
        <>
          <Button
            style={{ float: 'right', marginRight: '30px' }}
            onClick={() => {
              handleClose();
            }}
            floating
          >
            Start Querying
            <PlayIconSolid className='btn-icon-base-r' />
          </Button>
          <Button fill='outlined' onClick={() => deleteAllMessageHistory()}>
            Delete Model History
          </Button>
        </>
      ) : (
        <></>
      )}
    </List>
  );
  return component;
};

const mapStateToProps = (state) => ({
  settings: getQueryTranslatorSettings(state),
});

const mapDispatchToProps = (dispatch) => ({
  setGlobalModelClient: (modelClient) => {
    dispatch(setGlobalModelClient(modelClient));
  },
  authenticate: (setIsAuthenticated) => {
    dispatch(modelClientInitializationThunk(setIsAuthenticated));
  },
  updateModelProvider: (modelProviderState) => {
    dispatch(setModelProvider(modelProviderState));
  },
  updateClientSettings: (settingState) => {
    dispatch(setClientSettings(settingState));
  },
  deleteAllMessageHistory: () => {
    dispatch(deleteAllMessageHistory());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ClientSettings);
