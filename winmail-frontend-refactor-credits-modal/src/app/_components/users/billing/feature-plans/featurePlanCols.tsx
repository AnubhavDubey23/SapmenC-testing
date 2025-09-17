import { TSubscriptionData } from '@/types/billing.types';
import { CellContext, ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';

function MakeSubscriptionId({ row }: CellContext<TSubscriptionData, unknown>) {
  return <h2>{row.original.subscriptionId}</h2>;
}

function MakePlanName({ row }: CellContext<TSubscriptionData, unknown>) {
  return <h2>{row.original.planName}</h2>;
}

function MakeSubscriptionLink({
  row,
}: CellContext<TSubscriptionData, unknown>) {
  return <h2>{row.original.subscriptionLink}</h2>;
}

function MakePurchasedOn({ row }: CellContext<TSubscriptionData, unknown>) {
  const purchasedOn = dayjs(row.original.purchasedOn).format('DD MMM YYYY');
  return <h2>{purchasedOn}</h2>;
}

function MakeExpiresOn({ row }: CellContext<TSubscriptionData, unknown>) {
  const expiresOn = dayjs(row.original.expiresOn).format('DD MMM YYYY');
  return <h2>{expiresOn}</h2>;
}

function MakeStatus({ row }: CellContext<TSubscriptionData, unknown>) {
  return <h2>{row.original.status}</h2>;
}

export function makeFeaturePlanCols(): ColumnDef<TSubscriptionData>[] {
  return [
    {
      accessorKey: 'subscriptionId',
      header: 'Subscription ID',
    },
    {
      accessorKey: 'planName',
      header: 'Plan Name',
    },
    {
      accessorKey: 'subscriptionLink',
      header: 'Subscription Link',
    },
    {
      accessorKey: 'purchasedOn',
      header: 'Purchased On',
      cell: MakePurchasedOn,
    },
    {
      accessorKey: 'expiresOn',
      header: 'Expires On',
      cell: MakeExpiresOn,
    },
    {
      accessorKey: 'status',
      header: 'Status',
    },
  ];
}
