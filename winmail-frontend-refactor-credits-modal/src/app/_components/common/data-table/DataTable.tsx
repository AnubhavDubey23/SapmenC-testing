import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import React from 'react';
import { TableHeader } from './TableHeader';
import { TableBodyContent } from './TableBodyContent';
import { Box, Table, TableContainer, Tbody } from '@chakra-ui/react';
import { TableLoadingState } from './TableLoadingState';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const headerGroups = table.getHeaderGroups();
  const rowModel = table.getRowModel();

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHeader headerGroups={headerGroups} />
          <Tbody>
            {loading ? (
              <TableLoadingState colSpan={columns.length} />
            ) : (
              <TableBodyContent rowModel={rowModel} colSpan={columns.length} />
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
