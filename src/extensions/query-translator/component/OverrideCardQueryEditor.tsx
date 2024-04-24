import React, { useCallback, useContext, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Switch } from '@neo4j-ndl/react';
import NeoCodeEditorComponent, {
  DEFAULT_CARD_SETTINGS_HELPER_TEXT_STYLE,
} from '../../../component/editor/CodeEditorComponent';
import { getReportTypes } from '../../ExtensionUtils';
import { queryTranslationThunk } from '../state/QueryTranslatorThunks';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import debounce from 'lodash/debounce';
import { updateLastMessage } from '../state/QueryTranslatorActions';
import { createNotification } from '../../../application/ApplicationActions';
import { getLastMessage, QUERY_TRANSLATOR_EXTENSION_NAME } from '../state/QueryTranslatorSelector';
import { GPT_LOADING_ICON } from './LoadingIcon';
import {
  deleteSessionStoragePrepopulationReportFunction,
  setSessionStoragePrepopulationReportFunction,
} from '../../state/ExtensionActions';
import { getPrepopulateReportExtension } from '../../state/ExtensionSelectors';

// TODO: right now if we change the database in the cardSelector, it should forgot the card history
export const NeoOverrideCardQueryEditor = ({
  pagenumber,
  reportId,
  cypherQuery,
  extensions,
  reportType,
  updateCypherQuery,
  lastMessage,
  prepopulateExtensionName,
  onExecute,
  translateQuery,
  updateEnglishQuery,
  displayError,
  setPrepopulationReportFunction,
  deletePrepopulationReportFunction,
}) => {
  enum Language {
    ENGLISH = 0,
    CYPHER = 1,
  }

  const [language, setLanguage] = React.useState(Language.CYPHER);
  const [runningTranslation, setRunningTranslation] = React.useState(false);
  const [englishQuestion, setEnglishQuestion] = React.useState('');
  const debouncedEnglishQuestionUpdate = useCallback(debounce(updateEnglishQuery, 250), []);

  useEffect(() => {
    // Reset text to the dashboard state when the page gets reorganized.
    if (lastMessage !== englishQuestion) {
      setEnglishQuestion(lastMessage);
    }
  }, [lastMessage]);

  const reportTypes = getReportTypes(extensions);

  const cypherEditor = (
    <NeoCodeEditorComponent
      value={cypherQuery}
      editable={true}
      onExecute={onExecute}
      language={
        reportTypes[reportType] && reportTypes[reportType].inputMode ? reportTypes[reportType].inputMode : 'cypher'
      }
      onChange={(value) => updateCypherQuery(value)}
      placeholder={`Enter Cypher here...`}
    />
  );

  function updateEnglishQuestion(value) {
    debouncedEnglishQuestionUpdate(pagenumber, reportId, value);
    setEnglishQuestion(value);
  }

  // To prevent a bug with the code editor component, we wrap it in an extra enclosing bracket.
  const englishEditor = (
    <div>
      <NeoCodeEditorComponent
        value={englishQuestion}
        editable={true}
        language={'markdown'}
        onChange={(value) => {
          setPrepopulationReportFunction(reportId);
          updateEnglishQuestion(value);
        }}
        style={{ border: '1px dashed darkgrey' }}
        placeholder={`Enter English here...`}
      />
    </div>
  );

  const { driver } = useContext<Neo4jContextState>(Neo4jContext);

  function triggerTranslation() {
    setRunningTranslation(true);
    translateQuery(
      pagenumber,
      reportId,
      englishQuestion,
      reportType,
      driver,
      () => {
        setRunningTranslation(false);
      },
      (e) => {
        setRunningTranslation(false);
        displayError(e);
      }
    );
  }

  return (
    <div>
      {runningTranslation ? (
        <div style={{ height: 150, border: '1px dashed grey', position: 'relative' }}>{GPT_LOADING_ICON}</div>
      ) : (
        <>
          <table style={{ marginBottom: 5, width: '100%' }}>
            <tr>
              <td style={{ width: 50 }}>Cypher</td>
              <td style={{ width: 50 }}>
                <Switch
                  style={{ backgroundColor: 'grey' }}
                  checked={language == Language.ENGLISH}
                  onChange={() => {
                    if (language == Language.ENGLISH) {
                      setLanguage(Language.CYPHER);
                      deletePrepopulationReportFunction(reportId);
                    } else {
                      setLanguage(Language.ENGLISH);
                    }
                  }}
                  className='n-ml-2'
                />
              </td>
              <td style={{ width: 70 }}>&nbsp; English</td>
              <td style={{ width: '100px', float: 'right' }}>
                {/* Only show translation button if there's something new to translate */}
                {language == Language.ENGLISH ? (
                  <Button
                    fill='outlined'
                    disabled={prepopulateExtensionName == undefined}
                    style={{ float: 'right' }}
                    onClick={() => {
                      if (prepopulateExtensionName !== undefined) {
                        triggerTranslation();
                        setLanguage(Language.CYPHER);
                        deletePrepopulationReportFunction(reportId);
                      }
                    }}
                  >
                    Translate
                  </Button>
                ) : (
                  <></>
                )}
              </td>
            </tr>
          </table>
          {language == Language.CYPHER ? cypherEditor : englishEditor}
          <div
            style={
              language == Language.CYPHER
                ? DEFAULT_CARD_SETTINGS_HELPER_TEXT_STYLE
                : {
                    ...DEFAULT_CARD_SETTINGS_HELPER_TEXT_STYLE,
                    // color: '#006FD6',
                    borderBottom: '1px dashed darkgrey',
                    borderLeft: '1px dashed darkgrey',
                    borderRight: '1px dashed darkgrey',
                  }
            }
          >
            {language == Language.ENGLISH ? (
              <>
                For best results, use a descriptive question. See also the{' '}
                <a
                  target='_blank'
                  style={{ textDecoration: 'underline' }}
                  href='https://neo4j.com/labs/neodash/2.4/user-guide/extensions/natural-language-queries/'
                >
                  documentation
                </a>
                .
              </>
            ) : (
              reportTypes[reportType] && reportTypes[reportType].helperText
            )}
          </div>
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state, ownProps) => ({
  lastMessage: getLastMessage(state, ownProps.pagenumber, ownProps.reportId),
  prepopulateExtensionName: getPrepopulateReportExtension(state, ownProps.reportId),
});

const mapDispatchToProps = (dispatch) => ({
  translateQuery: (pagenumber, reportId, text, reportType, driver, onComplete, onError, onRetry) => {
    dispatch(queryTranslationThunk(pagenumber, reportId, text, reportType, driver, onComplete, onError, onRetry));
  },
  updateEnglishQuery: (pagenumber, reportId, message) => {
    dispatch(updateLastMessage(message, pagenumber, reportId));
  },
  displayError: (message) => {
    dispatch(createNotification('Error when translating the natural language query', message));
  },
  setPrepopulationReportFunction: (reportId) => {
    dispatch(setSessionStoragePrepopulationReportFunction(reportId, QUERY_TRANSLATOR_EXTENSION_NAME));
  },
  deletePrepopulationReportFunction: (reportId) => {
    dispatch(deleteSessionStoragePrepopulationReportFunction(reportId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoOverrideCardQueryEditor);
