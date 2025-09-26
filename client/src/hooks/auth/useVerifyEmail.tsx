import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAppDispatch } from '@/store';
import AUTH_API_ENPOINTS from '@/api/auth.api';
import { setProductTour } from '@/store/features/product-tour/product-tour-slice';
import { VerifyEmailPayload } from '@/types/auth.types';
import { TAuthUserProfile } from '@/types/user.types';
import { TApiResponse } from '@/types/api.types';

const useVerifyEmail = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const verifyEmail = async (body: VerifyEmailPayload) => {
    setLoading(true);
    try {
      const res: Response = await fetch(AUTH_API_ENPOINTS.VERIFY_EMAIL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data: TApiResponse<TAuthUserProfile> = await res.json();
      if (!data.status) {
        throw new Error(data.message);
      }

      toast({
        title: 'Login successful',
        description: data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      if (!data.data.is_product_tour_seen) {
        dispatch(
          setProductTour({
            isOpen: true,
          })
        );
      }

      return data.status;
    } catch (error: any) {
      toast({
        title: 'An error occurred while logging in',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, verifyEmail };
};
export default useVerifyEmail;
