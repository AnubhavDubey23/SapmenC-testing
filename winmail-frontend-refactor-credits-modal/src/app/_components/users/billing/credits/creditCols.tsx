import { TCreditData } from '@/types/billing.types';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';

function MakeOrderId({ row }: CellContext<TCreditData, unknown>) {
  return <h2>{row.original.orderId}</h2>;
}

function MakeAmount({ row }: CellContext<TCreditData, unknown>) {
  return <h2>{row.original.amount}</h2>;
}

function MakeCredits({ row }: CellContext<TCreditData, unknown>) {
  return <h2>{row.original.credits}</h2>;
}

function MakeDate({ row }: CellContext<TCreditData, unknown>) {
  const date = dayjs(row.original.date).format('DD MMM YYYY');

  return <h2>{date}</h2>;
}

function MakeStatus({ row }: CellContext<TCreditData, unknown>) {
  return <h2>{row.original.status}</h2>;
}

export function makeCreditCols(): ColumnDef<TCreditData>[] {
  return [
    {
      accessorKey: 'orderId',
      header: 'Order ID',
      cell: MakeOrderId,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: MakeAmount,
    },
    {
      accessorKey: 'credits',
      header: 'No. of Credits',
      cell: MakeCredits,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: MakeDate,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: MakeStatus,
    },
  ];
}
