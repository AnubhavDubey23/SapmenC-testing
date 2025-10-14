import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAppDispatch } from '@/store';
import { setAuthState } from '@/store/features/auth/auth-slice';
import AUTH_API_ENPOINTS from '@/api/auth.api';
import { setProductTour } from '@/store/features/product-tour/product-tour-slice';
import { TApiResponse } from './useMe';
import { setFilter } from '@/store/features/filter/filter-slice';
import { ForgotPasswordPayload } from '@/types/auth.types';

const useForgotPassword = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const forgotPassword = async (body: ForgotPasswordPayload) => {
    setLoading(true);
    try {
      const res: Response = await fetch(AUTH_API_ENPOINTS.FORGOT_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: body.email,
        }),
      });

      const data: TApiResponse = await res.json();
      if (!data.status) {
        throw new Error(data.message);
      }

      return {
        status: true,
      };

      toast({
        description: data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'An error occurred while reset password',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, forgotPassword };
};
export default useForgotPassword;
