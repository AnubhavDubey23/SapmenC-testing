import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import USER_API_ENPOINTS from '@/api/user.api';

const useUsers: () => {
  loading: boolean;
  getAllUsers: () => Promise<void>;
} = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const getAllUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(USER_API_ENPOINTS.GET_ALL_USERS, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
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
      return data.data;
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

  return { loading, getAllUsers };
};

export default useUsers;
