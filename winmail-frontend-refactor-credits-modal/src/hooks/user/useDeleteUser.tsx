'use client';

import USER_API_ENPOINTS from '@/api/user.api';
import { useAppSelector } from '@/store';
import { TApiResponse } from '@/types/api.types';
import { TAuthUserProfile } from '@/types/user.types';
import { useToast } from '@chakra-ui/react';
import { useState } from 'react';
import useLogout from '../auth/useLogout';

export function useDeleteUser() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const authState = useAppSelector((state) => state.auth);
  const { logout } = useLogout();

  const deleteUser = async () => {
    setLoading(true);
    try {
      if (!authState.userId || !authState.currentToken) {
        throw new Error('User not authenticated');
      }
      const res = await fetch(USER_API_ENPOINTS.DELETE_USER(authState.userId), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authState.currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data: TApiResponse<TAuthUserProfile> = await res.json();
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

      // Log out user after account deletion
      logout();
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

  return { loading, deleteUser };
}
