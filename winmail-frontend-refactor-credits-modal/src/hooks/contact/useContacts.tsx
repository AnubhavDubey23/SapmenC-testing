import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAppSelector } from '@/store';
import CONTACT_API_ENPOINTS from '@/api/contact.api';
import { TApiResponse } from '@/types/api.types';
import { TContact } from '@/types/contact.types';

const useContacts: () => {
  loading: boolean;
  segments: TContact[];
} = () => {
  const authState = useAppSelector((state) => state.auth);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [segments, setContacts] = useState<TContact[]>([]);
  const selectedsegment = useAppSelector((state) => state.selectedsegment);
  const getAllContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        CONTACT_API_ENPOINTS.GET_ALL_CONTACTS(selectedsegment.segmentId),
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authState.currentToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data: TApiResponse<TContact[]> = await res.json();
      if (!data.status) {
        throw new Error(data.message);
      }

      setContacts(data.data);
      return data.data;
    } catch (error: any) {
      toast({
        title: 'An error occurred while fetching segments',
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
    if (segments.length === 0) {
      getAllContacts();
    }
  }, []);

  return { loading, segments };
};

export default useContacts;
