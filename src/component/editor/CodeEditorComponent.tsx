import React from 'react';
import { CypherEditor, CypherEditorProps } from '@neo4j-cypher/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
// import { languages } from '@codemirror/language-data';

const markdownExtensions = [
  markdown({
    base: markdownLanguage, // Support GFM
    // codeLanguages: languages
  }),
];

import '@neo4j-cypher/codemirror/css/cypher-codemirror.css';

const NeoCodeEditorComponent = ({
  value,
  onChange,
  placeholder,
  editable = true,
  language = 'cypher',
  style = { width: '100%', height: 'auto', border: '1px solid lightgray' },
}) => {
  const editorProps: CypherEditorProps = {
    cypherLanguage: language === 'cypher',
    readOnly: !editable,
    placeholder: placeholder,
    preExtensions: language === 'markdown' ? markdownExtensions : [],
    value: value,
    onValueChanged: (val) => {
      if (editable && onChange) {
        onChange(val);
      }
    },
    className: 'ReactCodeMirror', // only used by integration tests
  };

  return (
    <div className={'autosize'} style={style}>
      <CypherEditor {...editorProps} />
    </div>
  );
};

export default NeoCodeEditorComponent;
