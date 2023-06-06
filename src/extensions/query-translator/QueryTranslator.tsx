import React, { useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import { deleteAllMessageHistory, deleteMessageHistory, setGlobalModelClient } from './state/QueryTranslatorActions';
import { getApiKey, getClientSettings, getModelProvider } from './state/QueryTranslatorSelector';
import { Button } from '@neo4j-ndl/react';
import TranslateIcon from '@mui/icons-material/Translate';
import QueryTranslatorSettingsModal from './settings/QueryTranslatorSettingsModal';
import { queryTranslationThunk } from './state/QueryTranslatorThunks';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
/**
 * //TODO:
 * 1. The query translator should handle all the requests from the cards to the client
 * 2. When changing the modeltype, reset all the history of messages
 * 3. create system message from here to prevent fucking all up during the thunk, o each modelProvider change and at the start pull all the db schema
 */

export const QueryTranslator = ({
  apiKey,
  modelProvider,
  clientSettings,
  _deleteAllMessageHistory,
  setGlobalModelClient,
  queryTranslation,
  _deleteMessageHistory,
}) => {
  const [open, setOpen] = React.useState(false);
  const { driver } = useContext<Neo4jContextState>(Neo4jContext);

  // When changing provider, i will reset all the messages to prevent strage results
  useEffect(() => {
    // TODO: can't recast correctly the model client when refreshing the session, it should be removed at every session restart
    setGlobalModelClient(undefined);
  }, []);

  // When changing provider, i will reset all the messages to prevent strage results
  useEffect(() => {
    if (modelProvider && apiKey && Object.keys(clientSettings).length > 0) {
      queryTranslation(0, '2afa79af-9ac2-4473-b424-47db58db46af', 'give me any query', 'Table', driver);
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
  queryTranslation: (pagenumber, cardIndex, message, reportType, driver) => {
    dispatch(queryTranslationThunk(pagenumber, cardIndex, message, reportType, driver));
  },
  deleteMessageHistory: (pagenumber, cardIndex) => {
    dispatch(deleteMessageHistory(pagenumber, cardIndex));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(QueryTranslator);
