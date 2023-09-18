import React from 'react';
import { useTable, usePagination } from 'react-table';
import { IconButton } from '@neo4j-ndl/react';
import {
  TrashIconOutline,
  PencilSquareIconOutline,
  ChevronDoubleLeftIconOutline,
  ChevronLeftIconOutline,
  ChevronRightIconOutline,
  ChevronDoubleRightIconOutline,
} from '@neo4j-ndl/react/icons';

const RemoveButton = ({ onClick }) => (
  <IconButton
    className='n-float-right n-text-right'
    style={{ color: 'red' }}
    aria-label='remove'
    onClick={onClick}
    size='medium'
    clean
  >
    <TrashIconOutline aria-label={'remove'} />
  </IconButton>
);

const EditButton = ({ onClick }) => (
  <IconButton className='n-float-right n-text-right' onClick={onClick} aria-label={'edit'} size='medium' clean>
    <PencilSquareIconOutline aria-label={'edit'} />
  </IconButton>
);

const ExampleDisplayTable = ({ examples, deleteModelExample, handleEdit }) => {
  const data = React.useMemo(() => examples, [examples]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Prompt',
        accessor: 'question',
      },
      {
        Header: 'Cypher Query',
        accessor: 'answer',
      },
      {
        Header: '',
        accessor: 'actions',
        Cell: ({ row }) => (
          <div className='n-float-right n-text-right n-w-[100px]'>
            <RemoveButton onClick={() => deleteModelExample(row.index)} />
            <EditButton onClick={() => handleEdit(row.index)} />
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
    pageCount,
    pageOptions,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 }, // Set initial page index and page size
    },
    usePagination
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
                  return (
                    <td className='n-px-[5px]' {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className='pagination n-flex n-place-content-center n-my-[20px]'>
        <IconButton
          className='n-place-content-center'
          onClick={() => gotoPage(0)}
          aria-label={'edit'}
          size='medium'
          clean
        >
          <ChevronDoubleLeftIconOutline className='n-py-0' aria-label={'firstPage'} />
        </IconButton>
        <IconButton
          className='n-place-content-center'
          onClick={() => previousPage()}
          aria-label={'previousPage'}
          size='medium'
          clean
        >
          <ChevronLeftIconOutline className='n-py-0' aria-label={'firstPage'} />
        </IconButton>
        <span className='n-mt-[6px]'>
          &nbsp;Page&nbsp;
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
          &nbsp;
        </span>
        <span className='n-mt-[5px]'>&nbsp; | &nbsp;</span>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          className='n-float-right'
          style={{
            marginTop: '6px',
            marginLeft: '3px',
            marginRight: '3px',
            height: '26px',
            padding: '1px 5px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
        >
          {[5, 10, 20].map((pageSize) => (
            <option
              key={pageSize}
              value={pageSize}
              style={{
                padding: '5px',
                fontSize: '14px',
                backgroundColor: 'white',
              }}
            >
              Show {pageSize}
            </option>
          ))}
        </select>
        <IconButton
          className='n-place-content-center'
          onClick={() => nextPage()}
          aria-label={'nextPage'}
          size='medium'
          clean
        >
          <ChevronRightIconOutline className='n-py-0' aria-label={'firstPage'} />
        </IconButton>
        <IconButton
          className='n- n-place-content-center n-mr-[3px]'
          onClick={() => gotoPage(pageCount - 1)}
          aria-label={'lastPage'}
          size='medium'
          clean
        >
          <ChevronDoubleRightIconOutline className='n-py-0' aria-label={'firstPage'} />
        </IconButton>
      </div>
    </div>
  );
};

export default ExampleDisplayTable;
