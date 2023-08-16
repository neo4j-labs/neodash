// TODO: this file (in a way) belongs to chart/parameter/ParameterSelectionChart. It would make sense to move it there

import React, { useCallback, useContext } from 'react';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import NeoCodeEditorComponent, {
  DEFAULT_CARD_SETTINGS_HELPER_TEXT_STYLE,
} from '../../../component/editor/CodeEditorComponent';
import debounce from 'lodash/debounce';

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

  function updateCypherQuery(value) {
    debouncedQueryUpdate(value);
    setQueryText(value);
  }

  return (
    <div>
      Query
      <NeoCodeEditorComponent
        value={queryText}
        editable={true}
        language={'cypher'}
        onChange={(value) => {
          updateCypherQuery(value);
        }}
        placeholder={`Enter Cypher here...`}
      />
      <div style={DEFAULT_CARD_SETTINGS_HELPER_TEXT_STYLE}>This query is executed when the user submits the form.</div>
    </div>
  );
};

export default NeoFormCardSettings;
