import React from 'react';
import { CypherEditor, CypherEditorProps } from '@neo4j-cypher/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';

export const DEFAULT_CARD_SETTINGS_HELPER_TEXT_STYLE = {
  color: 'grey',
  fontSize: 12,
  paddingLeft: '5px',
  borderBottom: '1px solid lightgrey',
  borderLeft: '1px solid lightgrey',
  borderRight: '1px solid lightgrey',
  marginTop: '0px',
};

const markdownExtensions = [
  markdown({
    base: markdownLanguage, // Support GFM
    // codeLanguages: languages
  }),
];

const NeoCodeEditorComponent = ({
  value,
  onChange,
  placeholder,
  editable = true,
  language = 'cypher',
  onExecute = () => {},
  style = { border: '1px solid lightgray' },
}) => {
  const [keys, setKeys] = React.useState({});

  const editorProps: CypherEditorProps = {
    cypherLanguage: language === 'cypher',
    readOnly: !editable,
    placeholder: placeholder,
    preExtensions: language === 'markdown' ? markdownExtensions : [],
    value: value,

    // This is a check to discover whether a user wants to run the report with a shortcut (CTRL/CMD + Enter)
    onKeyDown: (e) => {
      const newKeys = keys;
      newKeys[e.key] = true;
      setKeys(newKeys);
      if ((newKeys.Control && newKeys.Enter) || (newKeys.Meta && newKeys.Enter)) {
        onExecute();
        setKeys({});
      }
      return undefined;
    },
    onKeyUp: (e) => {
      const newKeys = keys;
      delete newKeys[e.key];
      setKeys(newKeys);
      return undefined;
    },
    onValueChanged: (val) => {
      if (editable && onChange) {
        onChange(val);
      }
    },
  };

  // className 'ReactCodeMirror', only used by integration tests
  return (
    <div style={style}>
      <CypherEditor className='ndl-cypher-editor ReactCodeMirror' {...editorProps} />
    </div>
  );
};

export default NeoCodeEditorComponent;
