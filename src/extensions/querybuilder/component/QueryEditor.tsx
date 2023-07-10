/* eslint-disable */
import React, { useEffect } from 'react';

import { connect, useDispatch, useSelector } from 'react-redux';

import { updateQuery } from '../state/QueryBuilderActions';
import QueryEditorForm from './index';
import { useSchema } from 'use-neo4j';
import { getQueryBuilderQuery } from '../state/QueryBuilderSelectors';
import { QueryBuilderModal } from './QueryBuilderModal';
import { setConnected } from '../../../application/ApplicationActions';
import { resetSessionStorage } from '../../../sessionStorage/SessionStorageActions';
import { createConnectionThunk } from '../../../application/ApplicationThunks';

const QueryEditor = ({ queryId, query }) => {
  const { loading, labels, types } = useSchema();

  if (loading || !query) {
    return (
      <div className='flex flex-col h-screen'>
        <div className='flex flex-col h-full justify-center align-center'>
          <div
            className='bg-gray-200 p-4 rounded-md w-auto justify-center mx-auto text-center'
            style={{ width: '200px' }}
          >
            <p className='font-bold mb-4'>Loading Schema...</p>
          </div>
        </div>
      </div>
    );
  }

  return <QueryEditorForm labels={labels} types={types} />;
};

const mapStateToProps = (state, ownProps) => ({
  query: getQueryBuilderQuery(state, ownProps.queryId),
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(QueryEditor);
