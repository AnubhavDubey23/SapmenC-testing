import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAppSelector } from '@/store';
import USER_API_ENPOINTS from '@/api/user.api';
import { TAuthUserDevice, TAuthUserProfile } from '@/types/user.types';

export type TApiResponse = {
  status: boolean;
  message: string;
  data: TAuthUserProfile | null;
  device: TAuthUserDevice[] | null;
};

const useMe = () => {
  const [user, setUser] = useState<TAuthUserProfile | null>(null);
  const [device, setDevice] = useState<TAuthUserDevice[] | null>(null);
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const authState = useAppSelector((state) => state.auth);

  const getUser: () => Promise<TApiResponse | undefined> = async () => {
    setLoading(true);
    try {
      const res = await fetch(USER_API_ENPOINTS.ME, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authState.currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data: TApiResponse = await res.json();

      if (!data.status) {
        throw new Error(data.message);
      }
      const user = data.data as TAuthUserProfile;
      const device = data.device as TAuthUserDevice[];

      setUser(user);
      setDevice(device);

      return data;
    } catch (error: any) {
      console.error(error);
      if (error.message === 'Unauthorized') {
        return;
      }
      toast({
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
      getUser();
    }
  }, [authState.authState]);

  return { loading, user, device, getUser };
};

export default useMe;
