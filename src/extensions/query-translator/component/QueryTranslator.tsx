import React, { useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import { deleteAllMessageHistory, deleteMessageHistory, setGlobalModelClient } from '../state/QueryTranslatorActions';
import { getApiKey, getQueryTranslatorSettings, getModelProvider } from '../state/QueryTranslatorSelector';
import { SideNavigationItem } from '@neo4j-ndl/react';
import QueryTranslatorSettingsModal from './QueryTranslatorSettingsModal';
import { queryTranslationThunk } from '../state/QueryTranslatorThunks';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { Tooltip } from '@mui/material';
import { LanguageIconSolid } from '@neo4j-ndl/react/icons';
/**
 * //TODO:
 * 1. The query translator should handle all the requests from the cards to the client
 * 2. When changing the modeltype, reset all the history of messages
 * 3. create system message from here to prevent fucking all up during the thunk, o each modelProvider change and at the start pull all the db schema
 */

export const QueryTranslatorButton = ({
  apiKey,
  modelProvider,
  clientSettings,
  setGlobalModelClient,
  queryTranslation,
}) => {
  const [open, setOpen] = React.useState(false);
  const { driver } = useContext<Neo4jContextState>(Neo4jContext);

  // When changing provider, i will reset all the messages to prevent strage results
  useEffect(() => {
    // TODO: can't recast correctly the model client when refreshing the session, it should be removed at every session restart
    setGlobalModelClient(undefined);
  }, []);

  // When changing provider, i will reset all the messages to prevent strage results
  // TODO: remove this effect is just for testing
  useEffect(() => {
    try {
      if (modelProvider && apiKey && Object.keys(clientSettings).length > 0) {
        ['eb204bd5-7dd1-4cb4-9a34-111976db0b0e', '4d017b2f-261a-4d21-a187-ab8cce6ec31d'].forEach((cardId) => {
          queryTranslation(0, cardId, 'give me any query', 'Table', driver);
        });
      }
    } catch (e) {
      console.log(e);
    }
  }, [modelProvider, apiKey, clientSettings]);

  const button = (
    <div>
      <Tooltip title='Natural Language Queries' aria-label='examples'>
        <SideNavigationItem
          onClick={() => setOpen(true)}
          icon={
            <LanguageIconSolid
            // className={navItemClass}
            />
          }
        >
          Natural Language Queries
        </SideNavigationItem>
      </Tooltip>
    </div>
  );

  const component = (
    <div>
      {button}
      {open ? <QueryTranslatorSettingsModal open={open} setOpen={setOpen} /> : <></>}
    </div>
  );

  return component;
};

const mapStateToProps = (state) => ({
  apiKey: getApiKey(state),
  modelProvider: getModelProvider(state),
  clientSettings: getQueryTranslatorSettings(state),
});

const mapDispatchToProps = (dispatch) => ({
  setGlobalModelClient: (modelClient) => {
    dispatch(setGlobalModelClient(modelClient));
  },
  queryTranslation: (pagenumber, cardIndex, message, reportType, driver) => {
    dispatch(queryTranslationThunk(pagenumber, cardIndex, message, reportType, driver));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(QueryTranslatorButton);
