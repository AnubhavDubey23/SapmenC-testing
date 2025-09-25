import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import AUTH_API_ENPOINTS from '@/api/auth.api';
import { TApiResponse } from './useMe';
import { VerifyOTPPayload } from '@/types/auth.types';

const useVerifyOTP = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const verifyOTP = async (body: VerifyOTPPayload) => {
    setLoading(true);
    try {
      const res: Response = await fetch(AUTH_API_ENPOINTS.VERIFY_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: body.email,
          otp: body.otp,
        }),
      });

      const data: TApiResponse = await res.json();
      if (!data.status) {
        throw new Error(data.message);
      }

      toast({
        description: data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      return {
        status: true,
      };
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

  return { loading, verifyOTP };
};

export default useVerifyOTP;
