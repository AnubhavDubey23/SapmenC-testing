import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAppSelector } from '@/store';
import CONTACT_API_ENPOINTS from '@/api/contact.api';
import { TContact } from '@/types/contact.types';
import { TApiResponse } from '@/types/api.types';

const useUpdateContact = () => {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const authState = useAppSelector((state) => state.auth);
  const selectedsegmentstate = useAppSelector((state) => state.selectedsegment);

  const updateContact = async (contactId: string, body: any) => {
    setLoading(true);
    try {
      const res = await fetch(CONTACT_API_ENPOINTS.UPDATE_CONTACT(contactId), {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${authState.currentToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data: TApiResponse<TContact> = await res.json();
      if (!data.status) {
        throw new Error(data.message);
      }
      return data.data as TContact;
    } catch (err: any) {
      console.error(err);
      toast({
        title: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, updateContact };
};

export default useUpdateContact;
