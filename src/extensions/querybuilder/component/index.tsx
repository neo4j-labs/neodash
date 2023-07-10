import React from 'react';
import Graph from '../Graph';
import InitialNodeSelector from './InitialNodeSelector';
import Toolbar from './Toolbar';
import { connect, useSelector } from 'react-redux';

import QueryHeader from './Header';
import { getCurrentQuery, getQueryBuilderQuery } from '../state/QueryBuilderSelectors';

export const QueryEditorForm = ({ labels, types, currentQuery }) => {
  const {nodes} = currentQuery;
  let {selected} = currentQuery;
  let graph = <InitialNodeSelector labels={labels} />;

  if (nodes.length) {
    graph = <Graph />;
  }

  return (
    <div className='query-stage flex flex-col w-full h-full'>
      <QueryHeader />

      <div className='query-stage flex flex-grow-1 h-full flex-row bg-gray-100'>
        {graph}

        {selected && <Toolbar labels={labels} types={types} />}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentQuery: getCurrentQuery(state),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(QueryEditorForm);
