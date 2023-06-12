import ReportIcon from '@mui/icons-material/Report';
import React from 'react';
import { connect } from 'react-redux';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { IconButton, Switch } from '@neo4j-ndl/react';
import NeoCodeEditorComponent, {
  DEFAULT_CARD_SETTINGS_HELPER_TEXT_STYLE,
} from '../../../component/editor/CodeEditorComponent';
import { getReportTypes } from '../../ExtensionUtils';

// TODO - rename to 'Node Sidebar Extension button' to reflect better the functionality.
export const NeoOverrideCardQueryEditor = ({ cypherQuery, extensions, reportType, updateCypherQuery }) => {
  enum Language {
    ENGLISH,
    CYPHER,
  }

  const [language, setLanguage] = React.useState(Language.CYPHER);
  const reportTypes = getReportTypes(extensions);

  return (
    <div>
      <table style={{ marginBottom: 5 }}>
        <tr>
          <td>Cypher</td>
          <td>
            <Switch
              style={{ backgroundColor: 'grey' }}
              checked={language == Language.ENGLISH}
              onChange={() => {
                if (language == Language.ENGLISH) {
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
      <NeoCodeEditorComponent
        value={cypherQuery}
        editable={true}
        language={
          reportTypes[reportType] && reportTypes[reportType].inputMode ? reportTypes[reportType].inputMode : 'cypher'
        }
        onChange={(value) => updateCypherQuery(value)}
        placeholder={`Enter Cypher here...`}
      />
      <div style={DEFAULT_CARD_SETTINGS_HELPER_TEXT_STYLE}>
        {reportTypes[reportType] && reportTypes[reportType].helperText}
      </div>
    </div>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NeoOverrideCardQueryEditor);
