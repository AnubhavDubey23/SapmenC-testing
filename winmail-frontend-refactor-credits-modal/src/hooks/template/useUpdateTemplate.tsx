import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAppSelector } from '@/store';
import TEMPLATE_API_ENPOINTS from '@/api/template.api';
import useTemplates from './useTemplates';
import { TApiResponse } from '@/types/api.types';
import { TTemplate } from '@/types/template.types';

const useUpdateTemplate: () => {
  loading: boolean;
  updateTemplate: (body: any) => Promise<TTemplate | undefined>;
} = () => {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const { getAllTemplates } = useTemplates();

  const authState = useAppSelector((state) => state.auth);
  const selectedTemplateState = useAppSelector(
    (state) => state.selectedTemplate
  );

  const updateTemplate = async (body: any) => {
    setLoading(true);
    try {
      const res = await fetch(
        TEMPLATE_API_ENPOINTS.UPDATE_TEMPLATE(selectedTemplateState.templateId),
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${authState.currentToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
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

  return { loading, updateTemplate };
};

export default useUpdateTemplate;
