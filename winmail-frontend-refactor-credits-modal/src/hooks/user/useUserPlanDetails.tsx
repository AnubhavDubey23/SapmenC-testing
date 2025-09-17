import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import USER_API_ENPOINTS from '@/api/user.api';
import { useAppSelector } from '@/store';
import { TApiResponse } from '@/types/api.types';

type TSubscriptionDetails = {
  id: string;
  isExpired: boolean;
  price: number;
  segment: string;
  name: string;
  remainingDays: number;
  type: string;
};

const useUserPlanDetails: () => {
  loading: boolean;
  getUserPlanDetails: () => Promise<TSubscriptionDetails>;
  subscription: TSubscriptionDetails | null;
} = () => {
  const [subscription, setSubscription] = useState<TSubscriptionDetails | null>(
    null
  );
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const authState = useAppSelector((state) => state.auth);
  const getUserPlanDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch(USER_API_ENPOINTS.PLAN_DETAILS, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authState.currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data: TApiResponse<{ plan: any; subscription: any }> =
        await res.json();
      if (!data.status) {
        throw new Error(data.message);
      }

      setSubscription(data.data.plan);
      return data.data.plan;
    } catch (error: any) {
      toast({
        title: 'An error occurred while fetching users',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, getUserPlanDetails, subscription };
};

export default useUserPlanDetails;
