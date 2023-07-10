import React from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { deleteQuery, updateQuery } from '../state/QueryBuilderActions';

import { getCurrentQuery } from '../state/QueryBuilderSelectors';
import { QueryEditorForm } from './index';

export const QueryHeader = ({ currentQuery }) => {
  const dispatch = useDispatch();

  if (!currentQuery) {
    return 'mm';
  }

  const handleUpdateQueryClick = () => {
    dispatch(updateQuery(currentQuery));
  };
  const handleDeleteClick = () => {
    // eslint-disable-next-line
    if (confirm('Are you sure you want to delete this query?')) {
      dispatch(deleteQuery(currentQuery.id as string));
    }
  };

  return (
    <div className='query-header flex flex-row flex-grow-0 bg-white border-b border-gray-300 p-4'>
      <div className='flex flex-grow justify-top'>{currentQuery.name} Hola</div>

      <div className='flex flex-row'>
        {currentQuery.savedAt && (
          <div className='p-2 text-gray-500 text-italic text-sm'>Last saved {currentQuery.savedAt.toString()}</div>
        )}
        <button
          className='px-4 py-1 rounded-md border border-red-600 text-red-600 text-sm ml-2'
          onClick={handleDeleteClick}
        >
          Delete Query
        </button>
        <button
          className='px-4 py-1 rounded-md border border-blue-600 bg-blue-600 text-white font-bold text-sm ml-2'
          onClick={handleUpdateQueryClick}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentQuery: getCurrentQuery(state),
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(QueryHeader);
