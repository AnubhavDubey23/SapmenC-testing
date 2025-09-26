import { Center, Th, Thead, Tr, Wrap } from '@chakra-ui/react';
import { flexRender, HeaderGroup } from '@tanstack/react-table';

interface TableHeaderProps<TData> {
  headerGroups: HeaderGroup<TData>[];
  
}

export function TableHeader<TData>({ headerGroups }: TableHeaderProps<TData>) {
  return (
    <Thead  >
      {headerGroups.map((headerGroup) => (
        <Tr   key={headerGroup.id} >
          {headerGroup.headers.map((header) => (
            <Th key={header.id} textAlign="left" >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </Th>
          ))}
        </Tr>
      ))}
    </Thead>
  );
}
