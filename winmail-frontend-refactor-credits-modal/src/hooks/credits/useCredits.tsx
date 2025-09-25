import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAppSelector } from '@/store';
import PAYMENT_API_ENPOINTS from '@/api/payment.api';
import { TApiResponse } from '@/types/api.types';
import { TTransaction } from '@/types/transaction.types';

const useCredits = () => {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const authState = useAppSelector((state) => state.auth);

  const incrementCredits = async (body: any, authToken?: string) => {
    setLoading(true);
    try {
      const res = await fetch(PAYMENT_API_ENPOINTS.VERIFY_PURCHASE_CREDITS, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken || authState.currentToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data: TApiResponse<{
        transaction: TTransaction;
      }> = await res.json();
      if (!data.status) {
        throw new Error(data.message);
      }

      toast({
        description: 'Credits incremented',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      return data.data;
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

  return { loading, incrementCredits };
};

export default useCredits;
