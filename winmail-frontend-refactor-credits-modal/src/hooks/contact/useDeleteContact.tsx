import { useAppDispatch, useAppSelector } from '@/store';
import { useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { setActivesegment } from '@/store/features/selected-segment/selected-segment-slice';
import { setActiveTabState } from '@/store/features/active-tab/active-tab-slice';
import CONTACT_API_ENPOINTS from '@/api/contact.api';
import { TApiResponse } from '@/types/api.types';
import { TContact } from '@/types/contact.types';

const useDeletesegment = () => {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  const deletesegment = async (id: string) => {
    setLoading(true);
    try {
      // Add your delete logic here
      const res = await fetch(CONTACT_API_ENPOINTS.DELETE_CONTACT(id), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authState.currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data: TApiResponse<TContact> = await res.json();
      if (!data.status) {
        throw new Error(data.message);
      }
      dispatch(
        setActivesegment({
          segmentId: '',
          name: '',
          description: '',
          created_by: {
            name: '',
            email: '',
          },
          updated_by: {
            name: '',
            email: '',
          },
          is_active: false,
          createdAt: '',
          updatedAt: '',
          recipients: [],
        })
      );
      dispatch(setActiveTabState({ tabIndex: 1 }));
      return data.data as TContact;
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'An error occurred while deleting segment',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, deletesegment };
};

export default useDeletesegment;
