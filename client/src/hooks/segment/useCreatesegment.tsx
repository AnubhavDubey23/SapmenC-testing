import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '@/store';
import segment_API_ENPOINTS from '@/api/segment.api';
import { setActivesegment } from '@/store/features/selected-segment/selected-segment-slice';
import { setActiveTabState } from '@/store/features/active-tab/active-tab-slice';
import usesegments from './usesegments';
import { TApiResponse } from '@/types/api.types';
import { Tsegment } from '@/types/segment.types';

const useCreatesegment = () => {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const { segments, loading: segmentsLoading, getAllsegments } = usesegments();

  const createsegment = async (body: any) => {
    setLoading(true);
    try {
      const res = await fetch(segment_API_ENPOINTS.CREATE_segment, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authState.currentToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data: TApiResponse<Tsegment> = await res.json();
      if (!data.status) {
        throw new Error(data.message);
      }
      dispatch(
        setActivesegment({
          segmentId: data.data._id,
          name: data.data.name,
          description: data.data.description,
          created_by: data.data.created_by,
          updated_by: data.data.updated_by,
          is_active: data.data.is_active,
          createdAt: data.data.createdAt,
          updatedAt: data.data.updatedAt,
          recipients: data.data.recipients,
        })
      );
      dispatch(setActiveTabState({ tabIndex: 1 }));
      await getAllsegments();
      return data.data as Tsegment;
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

  return { loading, createsegment };
};

export default useCreatesegment;
