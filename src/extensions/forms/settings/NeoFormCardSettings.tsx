// TODO: this file (in a way) belongs to chart/parameter/ParameterSelectionChart. It would make sense to move it there

import React, { useCallback, useContext } from 'react';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import NeoCodeEditorComponent, {
  DEFAULT_CARD_SETTINGS_HELPER_TEXT_STYLE,
} from '../../../component/editor/CodeEditorComponent';
import debounce from 'lodash/debounce';
import { Banner, IconButton } from '@neo4j-ndl/react';
import { PencilIconOutline, PlusIconOutline, XMarkIconOutline } from '@neo4j-ndl/react/icons';

const NeoFormCardSettings = ({
  query,
  //   type,
  //   database,
  //   settings,
  //   extensions,
  //   onReportSettingUpdate,
  onQueryUpdate,
}) => {
  const { driver } = useContext<Neo4jContextState>(Neo4jContext);
  if (!driver) {
    throw new Error(
      '`driver` not defined. Have you added it into your app as <Neo4jContext.Provider value={{driver}}> ?'
    );
  }
  // Ensure that we only trigger a text update event after the user has stopped typing.
  const [queryText, setQueryText] = React.useState(query);
  const debouncedQueryUpdate = useCallback(debounce(onQueryUpdate, 250), []);
  const [formFields, setFormFields] = React.useState([]);
  function updateCypherQuery(value) {
    debouncedQueryUpdate(value);
    setQueryText(value);
  }

  const formFieldComponents = formFields.map((field, index) => {
    return (
      <Banner
        description={
          <div>
            <span style={{ lineHeight: '32px' }}>I'm a field</span>
            <IconButton
              className='n-float-right'
              aria-label='remove rule'
              size='small'
              onClick={() => {
                setFormFields([...formFields.slice(0, index), ...formFields.slice(index + 1)]);
              }}
            >
              <XMarkIconOutline />
            </IconButton>
            <IconButton
              className='n-float-right'
              aria-label='remove rule'
              size='small'
              onClick={() => {
                setFormFields([...formFields.slice(0, index), ...formFields.slice(index + 1)]);
              }}
            >
              <PencilIconOutline />
            </IconButton>
          </div>
        }
        style={{ width: '100%' }}
      ></Banner>
    );
  });

  const addFieldButton = (
    <div style={{ width: '100%', display: 'flex' }}>
      <IconButton
        style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: 5, marginBottom: 5 }}
        aria-label='add'
        size='medium'
        floating
        onClick={() => {
          const newRule = { text: 'abc' };
          setFormFields(formFields.concat(newRule));
        }}
      >
        <PlusIconOutline />
      </IconButton>
    </div>
  );

  return (
    <div>
      <div style={{ borderTop: '1px dashed lightgrey', width: '100%' }}>
        <span>Fields:</span>
        {formFieldComponents}
        {addFieldButton}
      </div>

      <div style={{ borderTop: '1px dashed lightgrey', width: '100%' }}>
        <span>Form Submission Query:</span>
        <NeoCodeEditorComponent
          value={queryText}
          editable={true}
          language={'cypher'}
          onChange={(value) => {
            updateCypherQuery(value);
          }}
          placeholder={`Enter Cypher here...`}
        />
        <div style={DEFAULT_CARD_SETTINGS_HELPER_TEXT_STYLE}>
          This query is executed when the user submits the form.
        </div>
      </div>
    </div>
  );
};

export default NeoFormCardSettings;
