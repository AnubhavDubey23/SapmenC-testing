'use client';

import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAppSelector } from '@/store';
import ACTIVITY_LOG_API_ENDPOINTS from '@/api/activity-log.api';
import { TApiResponse } from '@/types/api.types';
import { TActivityLog } from '@/types/activity-log.types';

const useActivityLog = () => {
  const toast = useToast();
  const [activityLogs, setActivityLogs] = useState<TActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const authState = useAppSelector((state) => state.auth);

  const fetchActivityLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(ACTIVITY_LOG_API_ENDPOINTS.GET_ACTIVITY, {
        headers: {
          Authorization: `Bearer ${authState.currentToken}`,
        },
      });

      const data: TApiResponse<TActivityLog[]> = await res.json();
      if (!data.status) {
        throw new Error(data.message);
      }

      setActivityLogs(data.data);
    } catch (err: any) {
      console.error(err);
      toast({
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [authState.currentToken, toast]);

  useEffect(() => {
    if (authState.authState) {
      fetchActivityLogs();
    }
  }, [authState.authState, fetchActivityLogs]);

  return { loading, activityLogs };
};

export default useActivityLog;
