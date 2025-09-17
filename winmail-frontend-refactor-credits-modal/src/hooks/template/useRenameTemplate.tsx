import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAppSelector } from '@/store';
import TEMPLATE_API_ENPOINTS from '@/api/template.api';
import useTemplates from './useTemplates';
import { TTemplate } from '@/types/template.types';
import { TApiResponse } from '@/types/api.types';

const useRenameTemplate: () => {
  loading: boolean;
  renameTemplate: (template: TTemplate) => Promise<TTemplate | undefined>;
} = () => {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const { getAllTemplates } = useTemplates();

  const authState = useAppSelector((state) => state.auth);

  const renameTemplate = async (template: TTemplate) => {
    setLoading(true);
    try {
      const res = await fetch(
        TEMPLATE_API_ENPOINTS.UPDATE_TEMPLATE(template._id),
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${authState.currentToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(template),
        }
      );

      const data: TApiResponse<TTemplate> = await res.json();
      if (!data.status) {
        throw new Error(data.message);
      }
      toast({
        description: data.message,
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      await getAllTemplates();
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

  return { loading, renameTemplate };
};

export default useRenameTemplate;
