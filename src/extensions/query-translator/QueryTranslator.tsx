import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { deleteAllMessageHistory, setGlobalModelClient } from './state/QueryTranslatorActions';
import { getApiKey, getClientSettings, getModelProvider } from './state/QueryTranslatorSelector';
import { Button } from '@neo4j-ndl/react';
import TranslateIcon from '@mui/icons-material/Translate';
import QueryTranslatorSettingsModal from './settings/QueryTranslatorSettingsModal';
/**
 * TODO:
 * 1. The query translator should handle all the requests from the cards to the client
 * 2. When changing the modeltype, reset all the history of messages
 * 3. create system message from here to prevent fucking all up during the thunk, o each modelProvider change and at the start pull all the db schema
 */

export const QueryTranslator = ({
  apiKey,
  modelProvider,
  clientSettings,
  _deleteAllMessageHistory,
  _setGlobalModelClient,
}) => {
  const [open, setOpen] = React.useState(false);
  // When changing provider, i will reset all the messages to prevent strage results
  useEffect(() => {
    if (modelProvider && apiKey && Object.keys(clientSettings).length > 0) {
      console.log(`henlo ${[modelProvider, apiKey, JSON.stringify(clientSettings)]}`);
    }
  }, [modelProvider, apiKey, clientSettings]);

  const button = (
    <div>
      <Button onClick={() => setOpen(true)} id='query-translator-button'>
        <TranslateIcon />
      </Button>
    </div>
  );

  const component = (
    <div>
      {button}
      {open ? <QueryTranslatorSettingsModal open={open} setOpen={setOpen}></QueryTranslatorSettingsModal> : <></>}
    </div>
  );

  return component;
};

const mapStateToProps = (state) => ({
  apiKey: getApiKey(state),
  modelProvider: getModelProvider(state),
  clientSettings: getClientSettings(state),
});

const mapDispatchToProps = (dispatch) => ({
  deleteAllMessageHistory: () => {
    dispatch(deleteAllMessageHistory());
  },
  setGlobalModelClient: (modelClient) => {
    dispatch(setGlobalModelClient(modelClient));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(QueryTranslator);
