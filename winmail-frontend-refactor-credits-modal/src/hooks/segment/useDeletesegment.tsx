import segment_API_ENPOINTS from '@/api/segment.api';
import { useAppDispatch, useAppSelector } from '@/store';
import { useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { setActivesegment } from '@/store/features/selected-segment/selected-segment-slice';
import { setActiveTabState } from '@/store/features/active-tab/active-tab-slice';
import usesegments from './usesegments';

const useDeletesegment = () => {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { getAllsegments: refetch } = usesegments();
  const authState = useAppSelector((state) => state.auth);

  const deletesegment = async (id: string) => {
    setLoading(true);
    try {
      // Add your delete logic here
      const res = await fetch(segment_API_ENPOINTS.DELETE_segment(id), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authState.currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status !== 204) {
        throw new Error("Error! Couldn't delete segment");
      }

      await refetch();

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

      toast({
        title: 'Successfully deleted segment!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      return;
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
