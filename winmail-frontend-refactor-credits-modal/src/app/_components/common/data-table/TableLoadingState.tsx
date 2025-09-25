import { Skeleton, Td, Tr } from '@chakra-ui/react';

interface TableLoadingStateProps {
  colSpan: number;
  rowCount?: number;
}

export function TableLoadingState({
  colSpan,
  rowCount = 6,
}: TableLoadingStateProps) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, index) => (
        <Tr key={index} h={16}>
          {Array.from({ length: colSpan }).map((_, cellIndex) => (
            <Td key={cellIndex}>
              <Skeleton h={4} />
            </Td>
          ))}
        </Tr>
      ))}
    </>
  );
}
