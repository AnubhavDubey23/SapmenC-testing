import React, { useMemo } from 'react';
import { makeAccountHistoryCols } from './accountHistoryCols';
import useActivityLog from '@/hooks/activity-log/useActivityLog';
import { DataTable } from '../../common/data-table/DataTable';
import { transformActivityLogsToAccountHistory } from '@/utils/account-history';

export function AccountHistory() {
  const columns = useMemo(() => makeAccountHistoryCols(), []);
  const { activityLogs, loading } = useActivityLog();

  const data = transformActivityLogsToAccountHistory(activityLogs);

  return <DataTable columns={columns} data={data} loading={loading} />;
}
