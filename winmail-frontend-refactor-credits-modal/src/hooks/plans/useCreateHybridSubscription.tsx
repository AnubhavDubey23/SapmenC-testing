import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAppSelector } from '@/store';
import PAYMENT_API_ENPOINTS from '@/api/payment.api';
import { TApiResponse } from '@/types/api.types';
import { TAuthUserProfile } from '@/types/user.types';

interface HybridSubscriptionResponse {
  user: TAuthUserProfile;
  subscription: any;
  order: any; // Razorpay order for enhanced UI
  transaction: any;
}

const useCreateHybridSubscription = () => {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const authState = useAppSelector((state) => state.auth);

  const createHybridSubscription = async (
    planId: string,
    authToken?: string
  ) => {
    setLoading(true);
    try {
      const res = await fetch(
        PAYMENT_API_ENPOINTS.CREATE_HYBRID_SUBSCRIPTION(planId),
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken || authState.currentToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // Additional data for hybrid approach
            enhanced_ui: true,
            create_order: true,
          }),
        }
      );

      const data: TApiResponse<HybridSubscriptionResponse> = await res.json();

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

  return { loading, createHybridSubscription };
};

export default useCreateHybridSubscription;
