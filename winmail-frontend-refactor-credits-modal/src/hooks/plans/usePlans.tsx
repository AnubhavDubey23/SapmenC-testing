import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAppSelector } from '@/store';
import useLogout from '../auth/useLogout';
import PLAN_API_ENPOINTS from '@/api/plan.api';
import { TApiResponse } from '../auth/useMe';
import CONFIG from '../../config';

const usePlans: () => {
  loading: boolean;
  plans: any;
} = () => {
  const authState = useAppSelector((state) => state.auth);
  const { logout } = useLogout();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState<any>([]);
  const getAllPlans = async () => {
    setLoading(true);

    const planType = CONFIG.type === 'development' ? 'test' : 'prod';

    try {
      const res = await fetch(PLAN_API_ENPOINTS.GET_ALL_PLANS(planType), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authState.currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data: TApiResponse = await res.json();

      if (!data.status) {
        if (res.status === 401) {
          logout();
          return;
        }
        throw new Error(data.message);
      }
      setPlans(Array.isArray(data.data) ? data.data : []);
    } catch (error: any) {
      toast({
        title: 'An error occurred while fetching plans list',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authState.authState) {
      getAllPlans();
    }
  }, [authState.authState]);

  return { loading, plans };
};

export default usePlans;
