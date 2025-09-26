import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import USER_API_ENPOINTS from '@/api/user.api';
import { useAppSelector } from '@/store';
import { TApiResponse } from '../auth/useMe';
import { TAuthUserProfile } from '@/types/user.types';

const useUpdateUser: () => {
  loading: boolean;
  updateUser: (body: Partial<TAuthUserProfile>) => Promise<void>;
} = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const authState = useAppSelector((state) => state.auth);

  const updateUser = async (body: Partial<TAuthUserProfile>) => {
    setLoading(true);
    try {
      if (!authState.userId || !authState.currentToken) {
        throw new Error('User not authenticated');
      }
      const res = await fetch(USER_API_ENPOINTS.UPDATE_USER(authState.userId), {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authState.currentToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...body,
        }),
      });

      const data: TApiResponse = await res.json();
      if (!data.status) {
        throw new Error(data.message);
      }

      toast({
        title: 'Success',
        description: data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
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

  return { loading, updateUser };
};

export default useUpdateUser;
