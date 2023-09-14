// ExampleDisplayTable.js
import React from 'react';
import { useTable, usePagination } from 'react-table';
import { IconButton } from '@neo4j-ndl/react';
import { TrashIconOutline, PencilSquareIconOutline } from '@neo4j-ndl/react/icons';

const ExampleDisplayTable = ({ examples, deleteModelExample, handleEdit }) => {
  const data = React.useMemo(() => examples, [examples]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Question',
        accessor: 'question',
      },
      {
        Header: 'Answer',
        accessor: 'answer',
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <div className='n-w-min n-float-right n-text-right'>
            <IconButton
              className='n-float-right n-text-right'
              style={{ color: 'red' }}
              aria-label='remove'
              onClick={() => deleteModelExample(row.index)}
              size='large'
              clean
            >
              <TrashIconOutline aria-label={'remove'} />
            </IconButton>
            <IconButton
              className='n-float-right n-text-right'
              onClick={() => handleEdit(row.index)}
              aria-label={'edit'}
              size='large'
              clean
            >
              <PencilSquareIconOutline aria-label={'edit'} />
            </IconButton>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { pageIndex, pageSize },
    gotoPage,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageCount,
    pageOptions,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }, // Set initial page index and page size
    },
    usePagination // Enable pagination
  );

  return (
    <div>
      <table {...getTableProps()} style={{ marginBottom: 5, width: '100%' }}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className='pagination'>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type='number'
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ExampleDisplayTable;
