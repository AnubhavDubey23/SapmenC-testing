import { TAccountHistoryData } from '@/types/activity-log.types';
import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { ActivityDrawer } from './ActivityDrawer';

function MakeDate({ row }: CellContext<TAccountHistoryData, unknown>) {
  const date = dayjs(row.original.date).format('DD MMM YYYY');
  return <h2>{date}</h2>;
}

function MakeTime({ row }: CellContext<TAccountHistoryData, unknown>) {
  const date = dayjs(row.original.date).format('hh:mm a');
  return <h2>{date}</h2>;
}

function MakeActivityType({ row }: CellContext<TAccountHistoryData, unknown>) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const activity = row.original;

  return (
    <Box>
      <Button onClick={onOpen}>{row.original.activityType}</Button>
      <ActivityDrawer onClose={onClose} isOpen={isOpen} activity={activity} />
    </Box>
  );
}

export function makeAccountHistoryCols(): ColumnDef<TAccountHistoryData>[] {
  return [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: MakeDate,
    },
    {
      accessorKey: 'time',
      header: 'Time',
      cell: MakeTime,
    },
    {
      accessorKey: 'activityType',
      header: 'Activity Type',
      cell: MakeActivityType,
    },
  ];
}
