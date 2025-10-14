import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAppSelector } from '@/store';
import CONTACT_API_ENPOINTS from '@/api/contact.api';
import { TContact } from '@/types/contact.types';
import { TApiResponse } from '@/types/api.types';

const useGetContact = () => {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [contact, setContact] = useState<TContact | null>(null);

  const authState = useAppSelector((state) => state.auth);
  const selectedsegmentstate = useAppSelector((state) => state.selectedsegment);

  const getContact: () => Promise<TContact | undefined> =
    useCallback(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          CONTACT_API_ENPOINTS.GET_CONTACT_BY_ID(
            selectedsegmentstate.segmentId
          ),
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${authState.currentToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data: TApiResponse<TContact> = await res.json();
        if (!data.status) {
          throw new Error(data.message);
        }
        setContact(data.data);
        return data.data as TContact;
      } catch (error: any) {
        console.error(error);
        toast({
          title: 'An error occurred while fetching the segment',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    }, [authState.currentToken, selectedsegmentstate.segmentId, toast]);

  useEffect(() => {
    if (authState.userId && selectedsegmentstate.segmentId) {
      getContact();
    }
  }, [selectedsegmentstate.segmentId, authState.userId, getContact]);

  return { loading, contact, refetch: getContact };
};

export default useGetContact;
