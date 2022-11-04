import React from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/addon/hint/show-hint.css';
import CypherEditor from './CypherEditor';

const NeoCodeEditorComponent = ({
  value,
  onChange = () => {},
  placeholder,
  editable = true,
  language = 'cypher',
  style = { width: '100%', height: 'auto', border: '1px solid lightgray' },
}) => {
  const [cancelNextEdit, setCancelNextEdit] = React.useState(false);
  const options = {
    viewPortMargin: Infinity,
    mode: language,
    theme: 'cypher',
    height: 'auto',
    lineNumberFormatter: (line) => line,
  };

  // TODO -  we force a recreating of the editor object here in a strange way...
  const editor =
    language == 'cypher' ? (
      <CypherEditor
        options={options}
        aria-label=""
        readOnly={!editable}
        value={!cancelNextEdit ? value : `${value} `}
        onValueChange={(val, change) => {
          // There's a bug here that causes an extra change event to be first after copy-pasting (with replacement) in the editor text box.
          // This is a workaround for that.
          if (cancelNextEdit) {
            setCancelNextEdit(false);
            onChange(value);
            return;
          }
          if (change.origin == 'paste' && change.removed[0].length > 0) {
            onChange(val);
            setCancelNextEdit(true);
            return;
          }
          if (editable && !cancelNextEdit) {
            onChange(val);
          }
        }}
        placeholder={placeholder}
      />
    ) : (
      <div>
        <CypherEditor
          options={options}
          readOnly={!editable}
          aria-label=""
          value={!cancelNextEdit ? value : `${value} `}
          onValueChange={(val, change) => {
            // There's a bug here that causes an extra change event to be first after copy-pasting (with replacement) in the editor text box.
            // This is a workaround for that.
            if (cancelNextEdit) {
              setCancelNextEdit(false);
              onChange(value);
              return;
            }
            if (change.origin == 'paste' && change.removed[0].length > 0) {
              onChange(val);
              setCancelNextEdit(true);
              return;
            }
            if (editable && !cancelNextEdit) {
              onChange(val);
            }
          }}
          placeholder={placeholder}
        />
      </div>
    );

  return (
    <div className={'autosize'} style={style}>
      {editor}
    </div>
  );
};

export default NeoCodeEditorComponent;
