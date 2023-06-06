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

const NeoCodeEditorComponent = ({
  value,
  onChange,
  placeholder,
  editable = true,
  language = 'cypher',
  style = { border: '1px solid lightgray' },
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
    <div style={style}>
      <CypherEditor className='ndl-cypher-editor' {...editorProps} />
    </div>
  );
};

export default NeoCodeEditorComponent;
