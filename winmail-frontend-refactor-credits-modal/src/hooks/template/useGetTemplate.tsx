import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAppSelector } from '@/store';
import TEMPLATE_API_ENPOINTS from '@/api/template.api';
import { TApiResponse } from '@/types/api.types';
import { TTemplate } from '@/types/template.types';

const useGetTemplate = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const authState = useAppSelector((state) => state.auth);
  const selectedTemplateState = useAppSelector(
    (state) => state.selectedTemplate
  );

  const getTemplate: () => Promise<
    TApiResponse<TTemplate> | undefined
  > = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        TEMPLATE_API_ENPOINTS.GET_TEMPLATE_BY_ID(
          selectedTemplateState.templateId
        ),
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.currentToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data: TApiResponse<TTemplate> = await res.json();
      if (!data.status) {
        throw new Error(data.message);
      }
      return data;
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

  useEffect(() => {
    if (authState.userId && selectedTemplateState.templateId) {
      getTemplate();
    }
  }, [selectedTemplateState.templateId, authState.userId]);

  return { loading, getTemplate };
};

export default useGetTemplate;
