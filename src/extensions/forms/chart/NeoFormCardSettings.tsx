// TODO: this file (in a way) belongs to chart/parameter/ParameterSelectionChart. It would make sense to move it there

import React, { useContext } from 'react';
import { Neo4jContext, Neo4jContextState } from 'use-neo4j/dist/neo4j.context';

const NeoFormCardSettings = ({
  query,
  //   type,
  //   database,
  //   settings,
  //   extensions,
  //   onReportSettingUpdate,
  //   onQueryUpdate,
}) => {
  const { driver } = useContext<Neo4jContextState>(Neo4jContext);
  if (!driver) {
    throw new Error(
      '`driver` not defined. Have you added it into your app as <Neo4jContext.Provider value={{driver}}> ?'
    );
  }

  return <div>Form Settings {query} </div>;
};

export default NeoFormCardSettings;
