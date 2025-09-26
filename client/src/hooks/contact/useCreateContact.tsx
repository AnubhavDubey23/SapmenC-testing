import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setActiveTabState } from '@/store/features/active-tab/active-tab-slice';
import CONTACT_API_ENPOINTS from '@/api/contact.api';
import usesegments from '../segment/usesegments';
import { TContact } from '@/types/contact.types';
import { TApiResponse } from '@/types/api.types';

const useCreateContact = () => {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const authState = useAppSelector((state) => state.auth);
  const { getAllsegments, segments } = usesegments();

  const createContact = async (body: any) => {
    setLoading(true);
    try {
      const res = await fetch(CONTACT_API_ENPOINTS.CREATE_CONTACT, {
        method: 'POST',
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

      await getAllsegments();
      dispatch(setActiveTabState({ tabIndex: 1 }));
      return data.data as TContact;
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

  return { loading, createContact };
};

export default useCreateContact;
