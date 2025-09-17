import React, { useMemo } from 'react';
import { makeFeaturePlanCols } from './featurePlanCols';
import { DataTable } from '@/app/_components/common/data-table/DataTable';
import { transformTransactionsToSubscriptions } from '@/utils/billing';
import { TTransaction } from '@/types/transaction.types';

interface FeaturePlansProps {
  data: TTransaction[];
  loading: boolean;
}

export function FeaturePlans({ data, loading }: FeaturePlansProps) {
  const columns = useMemo(() => makeFeaturePlanCols(), []);

  const subscriptionsHistory = transformTransactionsToSubscriptions(data);

  return (
    <DataTable
      columns={columns}
      data={subscriptionsHistory}
      loading={loading}
    />
  );
}
