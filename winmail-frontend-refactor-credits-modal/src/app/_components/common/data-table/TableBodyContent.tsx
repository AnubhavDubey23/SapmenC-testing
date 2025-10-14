import { Td, Tr } from '@chakra-ui/react';
import { flexRender, RowModel } from '@tanstack/react-table';
import React from 'react';

interface TableBodyContentProps<TData> {
  rowModel: RowModel<TData>;
  colSpan: number;
}

export function TableBodyContent<TData>({
  rowModel,
  colSpan,
}: TableBodyContentProps<TData>) {
  return (
    <>
      {rowModel.rows?.length ? (
        rowModel.rows.map((row) => (
          <Tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Td key={cell.id} gap={5}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Td>
            ))}
          </Tr>
        ))
      ) : (
        <Tr>
          <Td colSpan={colSpan}>No records</Td>
        </Tr>
      )}
    </>
  );
}
