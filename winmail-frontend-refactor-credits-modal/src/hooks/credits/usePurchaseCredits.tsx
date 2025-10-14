import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAppSelector } from '@/store';
import PAYMENT_API_ENPOINTS from '@/api/payment.api';
import { TApiResponse } from '@/types/api.types';
import { TAuthUserProfile } from '@/types/user.types';
import { TTransaction } from '@/types/transaction.types';

const usePurchaseCredits = () => {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const authState = useAppSelector((state) => state.auth);

  const purchaseCredits = async (credits: number, authToken?: string) => {
    setLoading(true);
    try {
      const token = authToken || authState.currentToken;
      if (!token) {
        throw new Error('Authentication token missing');
      }

      const res = await fetch(PAYMENT_API_ENPOINTS.PURCHASE_CREDITS, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken || authState.currentToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: credits * 100, // Convert credits to paise
        }),
      });

      // Check for HTTP errors first
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Server error: ${res.status} ${res.statusText}`
        );
      }

      const data: TApiResponse<{
        user: TAuthUserProfile;
        order: any;
        transaction: TTransaction;
      }> = await res.json();
      if (!data.status) {
        throw new Error(data.message);
      }

      return data.data;
    } catch (err: any) {
      console.error(err);
      toast({
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, purchaseCredits };
};

export default usePurchaseCredits;
