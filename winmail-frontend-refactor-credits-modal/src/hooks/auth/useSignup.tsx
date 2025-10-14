import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import AUTH_API_ENPOINTS from '@/api/auth.api';
import { TApiResponse } from './useMe';

const useSignup = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(AUTH_API_ENPOINTS.SIGNUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data: TApiResponse = await res.json();
      if (!data.status) {
        throw new Error(data.message);
      }

      toast({
        title: 'Successfully signed up',
        description: data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return true;
    } catch (error: any) {
      toast({
        title: 'An error occurred while signing up',
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

  return { loading, signup };
};
export default useSignup;
