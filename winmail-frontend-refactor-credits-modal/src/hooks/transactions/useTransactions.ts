'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAppSelector } from '@/store';
import { TApiResponse } from '@/types/api.types';
import { TTransaction } from '@/types/transaction.types';
import TRANSACTION_API_ENDPOINTS from '@/api/transaction.api';

const useTransactions = () => {
  const toast = useToast();
  const [transactions, setTransactions] = useState<TTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const authState = useAppSelector((state) => state.auth);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch(TRANSACTION_API_ENDPOINTS.GET_TRANSACTIONS, {
        headers: {
          Authorization: `Bearer ${authState.currentToken}`,
        },
      });

      const data: TApiResponse<TTransaction[]> = await res.json();
      if (!data.status) {
        throw new Error(data.message);
      }

      setTransactions(data.data);
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
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return { loading, transactions };
};

export default useTransactions;
