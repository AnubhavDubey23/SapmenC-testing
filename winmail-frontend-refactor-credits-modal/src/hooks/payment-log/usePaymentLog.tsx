import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAppSelector } from '@/store';
import { TApiResponse } from '../auth/useMe';
import PAYMENT_LOG_API_ENPOINTS from '@/api/payment-log.api';

const usePaymentLog = () => {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const authState = useAppSelector((state) => state.auth);

  const createPaymentLog = async (body: any, authToken?: string) => {
    setLoading(true);
    try {
      const res = await fetch(PAYMENT_LOG_API_ENPOINTS.CREATE_PAYMENT__LOG, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken || authState.currentToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data: TApiResponse = await res.json();
      if (!data.status) {
        throw new Error(data.message);
      }
      return data.data as any;
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

  return { loading, createPaymentLog };
};

export default usePaymentLog;
