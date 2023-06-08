import React from 'react';
import { connect } from 'react-redux';
import { setClientSettings, setModelProvider } from '../state/QueryTranslatorActions';
import { getQueryTranslatorSettings, getModelProvider } from '../state/QueryTranslatorSelector';
import { SELECTION_TYPES } from '../../../config/CardConfig';
import NeoSetting from '../../../component/field/Setting';
import { QUERY_TRANSLATOR_CONFIG } from '../QueryTranslatorConfig';
import ClientSettings from './ClientSettings';
import { Dialog } from '@neo4j-ndl/react';

export const QueryTranslatorSettingsModal = ({
  open,
  setOpen,
  modelProvider,
  clientSettings,
  updateClientSettings,
  updateModelProvider,
}) => {
  const [modelProviderState, setModelProviderState] = React.useState(modelProvider);
  const [settingsState, setSettingsState] = React.useState(clientSettings);

  // TODO: a user shouldn't be able to save a configuration if it's not correct and it didn't fill all the requirements
  const handleClose = () => {
    updateModelProvider(modelProviderState);
    updateClientSettings(settingsState);
    setOpen(false);
  };

  return (
    <Dialog size='large' open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
      <Dialog.Header id='form-dialog-title'>LLM-Powered Natural Language Queries</Dialog.Header>
      <Dialog.Content>
        This extensions lets you create reports with natural language. Your queries (in English) are translated to
        Cypher by a LLM provider of your choice.
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
});

export default connect(mapStateToProps, mapDispatchToProps)(QueryTranslatorSettingsModal);
