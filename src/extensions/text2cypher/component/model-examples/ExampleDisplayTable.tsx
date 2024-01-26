import React, { useEffect, useState } from 'react';
import {
  TrashIconOutline,
  PencilSquareIconOutline,
  ChevronDoubleLeftIconOutline,
  ChevronLeftIconOutline,
  ChevronDoubleRightIconOutline,
  ChevronRightIconOutline,
} from '@neo4j-ndl/react/icons';
import ShowMoreText from 'react-show-more-text';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { IconButton } from '@neo4j-ndl/react';
import { getModelExamples } from '../../state/QueryTranslatorSelector';
import { deleteModelExample } from '../../state/QueryTranslatorActions';
import { connect } from 'react-redux';

type Example = {
  question: string;
  answer: string;
};

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

function ExampleDisplayTable({ examples, deleteModelExample, handleEdit }) {
  const columnHelper = createColumnHelper<Example>();

  // Buttons that will be used inside the table
  const RowButtons = (index) => (
    <div className='n-float-right n-text-right n-w-[100px]'>
      <RemoveButton onClick={() => deleteModelExample(index)} />
      <EditButton onClick={() => handleEdit(index)} />
    </div>
  );

  const columns = React.useMemo(
    () => [
      columnHelper.accessor('question', {
        cell: (info) => <ShowMoreText lines={3}>{info.getValue()}</ShowMoreText>,
        header: () => 'Question',
      }),
      columnHelper.accessor('answer', {
        cell: (info) => (
          <div>
            <ShowMoreText lines={3}>{info.getValue()}</ShowMoreText>
          </div>
        ),
        header: 'Answer',
      }),
      {
        header: '',
        id: 'actions',
        cell: ({ row }) => RowButtons(row.index),
      },
    ],
    []
  );

  const data = React.useMemo(() => examples, [examples]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const [cellWidth, setCellWidth] = useState('600px');

  // For screens with 1080 x pixels or less
  useEffect(() => {
    const updateCellWidth = () => {
      if (window.innerWidth <= 1080) {
        // Example breakpoint for smaller screens
        setCellWidth('463px');
      } else {
        setCellWidth('600px');
      }
    };

    window.addEventListener('resize', updateCellWidth);
    updateCellWidth(); // Initialize on component mount

    return () => window.removeEventListener('resize', updateCellWidth);
  }, []);

  return (
    <div className='n-flex n-flex-col n-gap-2 n-mb-[15px]'>
      <div className='ndl-table-root n-rounded-lg' style={{ maxWidth: '100%', overflowX: 'auto' }}>
        <table className='ndl-div-table'>
          <thead className='ndl-table-thead'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                className='ndl-table-tr'
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 120px',
                  textAlign: 'left', // Aligns text to the left
                }}
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => (
                  <th
                    className='ndl-table-th ndl-focusable-cell ndl-header-group ndl-header-cell'
                    key={header.id}
                    style={{
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      borderBottom: '1px solid #ccc', // Adds bottom border to each cell
                      padding: '8px', // Adds padding for readability
                      maxWidth: cellWidth,
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className='ndl-table-tbody'>
            {table.getRowModel().rows.map((row) => (
              <tr
                className='ndl-table-tr'
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 120px',
                }}
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    className='ndl-table-td ndl-focusable-cell'
                    key={cell.id}
                    style={{
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      padding: '8px', // Adds padding for readability
                      maxWidth: cellWidth,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className='paginaton n-flex n-place-content-center n-my-[14px] n-pt-[14px]'>
          <IconButton
            className='n-place-content-left'
            onClick={() => table.setPageIndex(0)}
            aria-label={'edit'}
            size='medium'
            clean
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronDoubleLeftIconOutline className='n-py-0' aria-label={'firstPage'} />
          </IconButton>

          <IconButton
            className='n-place-content-left'
            onClick={() => table.previousPage()}
            aria-label={'previousPage'}
            size='medium'
            clean
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIconOutline className='n-py-0' aria-label={'firstPage'} />
          </IconButton>

          <span className='n-mt-[6px]'>
            &nbsp;Page&nbsp;
            <strong>
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </strong>
            &nbsp;
          </span>

          <IconButton
            className='n-place-content-center'
            onClick={() => table.nextPage()}
            aria-label={'nextPage'}
            size='medium'
            clean
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIconOutline className='n-py-0' aria-label={'firstPage'} />
          </IconButton>

          <IconButton
            className='n- n-place-content-center n-mr-[3px]'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            aria-label={'lastPage'}
            size='medium'
            clean
            disabled={!table.getCanNextPage()}
          >
            <ChevronDoubleRightIconOutline className='n-py-0' aria-label={'firstPage'} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  examples: getModelExamples(state),
});

// Function to launch an action to modify the state
const mapDispatchToProps = (dispatch) => ({
  deleteModelExample: (index) => dispatch(deleteModelExample(index)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ExampleDisplayTable);
