import React from 'react';
import { connect } from 'react-redux';
import { setClientSettings, setModelProvider } from '../state/QueryTranslatorActions';
import { getQueryTranslatorSettings, getModelProvider } from '../state/QueryTranslatorSelector';
import { SELECTION_TYPES } from '../../../config/CardConfig';
import NeoSetting from '../../../component/field/Setting';
import { QUERY_TRANSLATOR_CONFIG } from '../QueryTranslatorConfig';
import ClientSettings from './ClientSettings';
import { Dialog } from '@neo4j-ndl/react';
import { modelClientInitializationThunk } from '../state/QueryTranslatorThunks';

const QueryTranslatorSettingsModal = ({
  open,
  setOpen,
  modelProvider,
  clientSettings,
  updateClientSettings,
  updateModelProvider,
  initializeModelClient,
}) => {
  const [modelProviderState, setModelProviderState] = React.useState(modelProvider);
  const [settingsState, setSettingsState] = React.useState(clientSettings);

  // TODO: a user shouldn't be able to save a configuration if it's not correct and it didn't fill all the requirements
  // DONE: by moving the storing logic only inside the start querying button
  const handleCloseWithSave = () => {
    updateModelProvider(modelProviderState);
    updateClientSettings(settingsState);
    setOpen(false);
    initializeModelClient();
  };

  const handleCloseWithoutSave = () => {
    setOpen(false);
  };

  return (
    <Dialog size='large' open={open} onClose={handleCloseWithoutSave} aria-labelledby='form-dialog-title'>
      <Dialog.Header id='form-dialog-title'>LLM-Powered Natural Language Queries</Dialog.Header>
      <Dialog.Content>
        This extensions lets you create reports with natural language. Your queries (in English) are translated to
        Cypher by a LLM provider of your choice.
        <br />
        <br />
        Keep in mind that the following data will be sent to a external API:
        <ul>
          <li>- Your database schema, including label names, relationship types, and property keys.</li>
          <li>- Any natural language question that a user writes.</li>
        </ul>
        <br />
        <br />
        <NeoSetting
          style={{ marginLeft: 0, marginRight: 0 }}
          key={'Model Provider'}
          name={'Model Provider'}
          label={'Model Provider'}
          value={modelProviderState}
          type={SELECTION_TYPES.LIST}
          choices={Object.keys(QUERY_TRANSLATOR_CONFIG.availableClients)}
          onChange={(e) => setModelProviderState(e)}
        />
        {modelProviderState ? (
          <ClientSettings
            handleClose={handleCloseWithSave}
            modelProvider={modelProviderState}
            settingState={settingsState}
            setSettingsState={setSettingsState}
          />
        ) : (
          <>Select one of the available clients.</>
        )}
      </Dialog.Content>
    </Dialog>
  );
};
const mapStateToProps = (state) => ({
  clientSettings: getQueryTranslatorSettings(state),
  modelProvider: getModelProvider(state),
});

const mapDispatchToProps = (dispatch) => ({
  updateClientSettings: (settings) => dispatch(setClientSettings(settings)),
  updateModelProvider: (modelProvider) => dispatch(setModelProvider(modelProvider)),
  initializeModelClient: (setIsAuthenticated) => {
    dispatch(modelClientInitializationThunk(setIsAuthenticated));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(QueryTranslatorSettingsModal);
