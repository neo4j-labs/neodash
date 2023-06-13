import ReportIcon from '@mui/icons-material/Report';
import React, { useCallback, useContext } from 'react';
import { connect } from 'react-redux';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { IconButton, Switch } from '@neo4j-ndl/react';
import NeoCodeEditorComponent, {
  DEFAULT_CARD_SETTINGS_HELPER_TEXT_STYLE,
} from '../../../component/editor/CodeEditorComponent';
import { getReportTypes } from '../../ExtensionUtils';
import { queryTranslationThunk } from '../state/QueryTranslatorThunks';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import debounce from 'lodash/debounce';
import { updateLastMessage } from '../state/QueryTranslatorActions';
import { createNotification } from '../../../application/ApplicationActions';

// TODO - rename to 'Node Sidebar Extension button' to reflect better the functionality.
export const NeoOverrideCardQueryEditor = ({
  pagenumber,
  reportId,
  cypherQuery,
  extensions,
  reportType,
  updateCypherQuery,
  translateQuery,
  updateEnglishQuery,
  displayError,
}) => {
  enum Language {
    ENGLISH,
    CYPHER,
  }

  const [language, setLanguage] = React.useState(Language.CYPHER);
  const [runningTranslation, setRunningTranslation] = React.useState(false);
  const [englishQuestion, setEnglishQuestion] = React.useState('');
  const debouncedEnglishQuestionUpdate = useCallback(debounce(updateEnglishQuery, 250), []);

  const reportTypes = getReportTypes(extensions);

  const cypherEditor = (
    <NeoCodeEditorComponent
      value={cypherQuery}
      editable={true}
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
    <>
      <NeoCodeEditorComponent
        value={englishQuestion}
        editable={true}
        language={'english'}
        onChange={(value) => {
          updateEnglishQuestion(value);
        }}
        placeholder={`Enter English here...`}
      />
    </>
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
        console.log(e);
        displayError(e);
      }
    );
  }

  return (
    <div>
      {runningTranslation ? (
        <div style={{ width: '100%', height: 150, textAlign: 'center', display: 'block', border: '1px solid grey' }}>
          <br />
          <img
            style={{ width: 40, animation: 'pulse 2s infinite', marginLeft: 'auto', marginRight: 'auto' }}
            src='https://seeklogo.com/images/O/open-ai-logo-8B9BFEDC26-seeklogo.com.png'
          ></img>
          <br />
          <span style={{ fontSize: 12 }}>Calling OpenAI...</span>
        </div>
      ) : (
        <>
          <table style={{ marginBottom: 5 }}>
            <tr>
              <td>Cypher</td>
              <td>
                <Switch
                  style={{ backgroundColor: 'grey' }}
                  checked={language == Language.ENGLISH}
                  onChange={() => {
                    if (language == Language.ENGLISH) {
                      triggerTranslation();
                      setLanguage(Language.CYPHER);
                    } else {
                      setLanguage(Language.ENGLISH);
                    }
                  }}
                  className='n-ml-2'
                />
              </td>
              <td>&nbsp; English</td>
            </tr>
          </table>
          {language == Language.CYPHER ? cypherEditor : englishEditor}
          <div style={DEFAULT_CARD_SETTINGS_HELPER_TEXT_STYLE}>
            {language == Language.ENGLISH ? (
              <>
                For prompting tips, check out the{' '}
                <a
                  style={{ textDecoration: 'underline' }}
                  href='https://neo4j.com/labs/neodash/2.3/user-guide/extensions/natural-language-queries/'
                >
                  Documentation
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

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  translateQuery: (pagenumber, reportId, text, reportType, driver, onComplete, onError) => {
    dispatch(queryTranslationThunk(pagenumber, reportId, text, reportType, driver, onComplete, onError));
  },
  updateEnglishQuery: (pagenumber, reportId, message) => {
    dispatch(updateLastMessage(message, pagenumber, reportId));
  },
  displayError: (message) => {
    dispatch(createNotification('Error when translating the natural language query', message));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(NeoOverrideCardQueryEditor);
