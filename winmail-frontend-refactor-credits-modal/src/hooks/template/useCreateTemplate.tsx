import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAppSelector } from '@/store';
import TEMPLATE_API_ENPOINTS from '@/api/template.api';
import { TTemplate } from '@/types/template.types';
import { TApiResponse } from '@/types/api.types';

const useCreateTemplate = () => {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const authState = useAppSelector((state) => state.auth);

  const createTemplate = async (body: any) => {
    setLoading(true);
    try {
      const res = await fetch(TEMPLATE_API_ENPOINTS.CREATE_TEMPLATE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authState.currentToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data: TApiResponse<TTemplate> = await res.json();
      if (!data.status) {
        throw new Error(data.message);
      }

      toast({
        title: data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return data.data as TTemplate;
    } catch (error: any) {
      console.error(error);
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

  return { loading, createTemplate };
};

export default useCreateTemplate;
