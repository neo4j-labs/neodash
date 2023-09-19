import React from 'react';
import { TrashIconOutline, PencilSquareIconOutline } from '@neo4j-ndl/react/icons';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { IconButton } from '@neo4j-ndl/react';

type Example = {
  question: string;
  answer: string;
  index: number
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

function ExampleDisplayTable2({ examples, deleteModelExample, handleEdit }) {
  const columnHelper = createColumnHelper<Example>();

  const columns = React.useMemo(
    () => [
      columnHelper.accessor('question', {
        cell: (info) => info.getValue(),
        header: () => <span>Question</span>,
      }),
      columnHelper.accessor('answer', {
        cell: (info) => info.getValue(),
        header: () => <span>Answer</span>,
      }),
      {
        feader: '',
        id: 'actions',
        cell: ({ row }) => (
          <div className='n-float-right n-text-right n-w-[100px]'>
            <RemoveButton onClick={() => deleteModelExample(row.index)} />
            <EditButton onClick={() => handleEdit(row.index)} />
          </div>
        ),
      }
 
    ],
    []
  );

  const data = React.useMemo(() => examples, [examples]);
  const rerender = React.useReducer(() => ({}), {})[1];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='p-2'>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className='h-4' />
    </div>
  );
}

export default ExampleDisplayTable2;
