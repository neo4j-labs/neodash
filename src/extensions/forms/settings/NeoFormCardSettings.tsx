// TODO: this file (in a way) belongs to chart/parameter/ParameterSelectionChart. It would make sense to move it there

import React, { useCallback, useContext } from 'react';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import NeoCodeEditorComponent, {
  DEFAULT_CARD_SETTINGS_HELPER_TEXT_STYLE,
} from '../../../component/editor/CodeEditorComponent';
import debounce from 'lodash/debounce';
import { Banner, Dialog, IconButton } from '@neo4j-ndl/react';
import { PencilIconOutline, PlusIconOutline, XMarkIconOutline } from '@neo4j-ndl/react/icons';
import ParameterSelectCardSettings from '../../../chart/parameter/ParameterSelectCardSettings';
import NeoCardSettingsFooter from '../../../card/settings/CardSettingsFooter';

const NeoFormCardSettings = ({
  query,
  //   type,
  database,
  //   settings,
  extensions,
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
  const [selectedFieldIndex, setSelectedFieldIndex] = React.useState(-1);
  const [fieldModalOpen, setFieldModalOpen] = React.useState(false);
  const [fieldModalAdvancedSettingsOpen, setFieldModalAdvancedSettingsOpen] = React.useState(false);
  function updateCypherQuery(value) {
    debouncedQueryUpdate(value);
    setQueryText(value);
  }

  const formFieldComponents = formFields.map((field, index) => {
    return (
      <Banner
        description={
          <div>
            <span style={{ lineHeight: '32px' }}>
              {index + 1}. {'(Undefined)'}
            </span>
            <IconButton
              className='n-float-right'
              aria-label='remove field'
              size='small'
              onClick={() => {
                setFormFields([...formFields.slice(0, index), ...formFields.slice(index + 1)]);
              }}
            >
              <XMarkIconOutline />
            </IconButton>
            <IconButton
              className='n-float-right'
              aria-label='edit field'
              size='small'
              onClick={() => {
                setSelectedFieldIndex(index);
                setFieldModalOpen(true);
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
          const newField = { type: 'Node Property', settings: {}, query: '' };
          const newIndex = formFields.length;
          setFormFields(formFields.concat(newField));
          setSelectedFieldIndex(newIndex);
          setFieldModalOpen(true);
        }}
      >
        <PlusIconOutline />
      </IconButton>
    </div>
  );

  return (
    <div>
      <Dialog
        className='dialog-l'
        open={fieldModalOpen}
        onClose={() => setFieldModalOpen(false)}
        style={{ overflow: 'inherit', overflowY: 'inherit' }}
        aria-labelledby='form-dialog-title'
      >
        <Dialog.Header id='form-dialog-title'>Editing Form Field #{selectedFieldIndex + 1}</Dialog.Header>
        <Dialog.Content style={{ overflow: 'inherit' }}>
          {formFields[selectedFieldIndex] ? (
            <>
              <ParameterSelectCardSettings
                query={formFields[selectedFieldIndex].query}
                type={'select'}
                database={database}
                settings={formFields[selectedFieldIndex].settings}
                extensions={extensions}
                onReportSettingUpdate={(key, value) => {
                  const newFormFields = [...formFields];
                  newFormFields[selectedFieldIndex].settings[key] = value;
                  setFormFields(newFormFields);
                }}
                onQueryUpdate={(query) => {
                  const newFormFields = [...formFields];
                  newFormFields[selectedFieldIndex].query = query;
                  setFormFields(newFormFields);
                }}
              />
              <NeoCardSettingsFooter
                type={'select'}
                reportSettings={formFields[selectedFieldIndex].settings}
                reportSettingsOpen={fieldModalAdvancedSettingsOpen}
                onToggleReportSettings={() => setFieldModalAdvancedSettingsOpen(!fieldModalAdvancedSettingsOpen)}
                onReportSettingUpdate={() => {
                  alert('error');
                }}
              />
            </>
          ) : (
            <></>
          )}
        </Dialog.Content>
      </Dialog>
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
