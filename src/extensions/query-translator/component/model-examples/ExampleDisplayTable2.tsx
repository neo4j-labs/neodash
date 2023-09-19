import React from 'react'

import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  Table as ReactTable,
  PaginationState,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table'

type Example = {
  question: string
  example: string
  index: number
}


const columnHelper = createColumnHelper<Example>()



const ExampleDisplayTable2 = ({ examples, deleteModelExample, handleEdit }) => {

  const data = React.useMemo(() => examples, [examples]);
  const rerender = React.useReducer(() => ({}), {})[1]

  const columns = React.useMemo<ColumnDef<Example>[]>(()=> [
    columnHelper.accessor(‘question, {
      // cell: info => info.getValue(),
      header: () => <span>Question</span>,
    }),
    columnHelper.accessor(‘answer’, {
      header: () => <span>Last Name</span>,
    }),
  ], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-4" />
    </div>
  );
};

export default ExampleDisplayTable2;

