import ReportIcon from '@mui/icons-material/Report';
import React from 'react';
import { connect } from 'react-redux';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { IconButton, Switch } from '@neo4j-ndl/react';

// TODO - rename to 'Node Sidebar Extension button' to reflect better the functionality.
export const NeoLanguageToggleSwitch = () => {
  enum Language {
    ENGLISH,
    CYPHER,
  }

  const [language, setLanguage] = React.useState(Language.CYPHER);

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
    </div>
  );
};

const mapStateToProps = () => ({});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(NeoLanguageToggleSwitch);
