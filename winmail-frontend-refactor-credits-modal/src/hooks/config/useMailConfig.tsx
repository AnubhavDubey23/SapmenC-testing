import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import USER_API_ENPOINTS from '@/api/user.api';
import { useAppSelector } from '@/store';
import { UserNodemailerConfigDTO } from '@/types/config.types';
import { TAuthUserProfile } from '@/types/user.types';
import { TApiResponse } from '@/types/api.types';

const useMailConfig: () => {
  loading: boolean;
  updateMailConfig: (body: UserNodemailerConfigDTO) => Promise<any>;
} = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const authState = useAppSelector((state) => state.auth);

  const updateMailConfig = async (body: UserNodemailerConfigDTO) => {
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
          nodemailer_config: body,
        }),
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

  return { loading, updateMailConfig };
};

export default useMailConfig;
