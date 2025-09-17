import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAppSelector } from '@/store';
import { SendMailDTO } from '@/app/_dto/mail.dto';
import MAIL_API_ENPOINTS from '@/api/mail.api';

const useSendMail = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const authState = useAppSelector((state) => state.auth);
  const selectedTemplateState = useAppSelector(
    (state) => state.selectedTemplate
  );
  const sendMail: (body: SendMailDTO) => Promise<any> = async (
    body: SendMailDTO
  ) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append(
        'jsonData',
        JSON.stringify({
          templateId: selectedTemplateState.templateId,
          segmentIds: body.segmentIds,
        })
      );

      body.attachments.forEach((attachment) => {
        formData.append('attachments', attachment);
      });

      const res = await fetch(
        MAIL_API_ENPOINTS.SEND_MAIL(selectedTemplateState.templateId),
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authState.currentToken}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (!data.status) {
        throw new Error(data.message);
      }
      toast({
        title: data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return data;
    } catch (error: any) {
      toast({
        title: 'An error occurred while sending mail',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendMail };
};

export default useSendMail;
