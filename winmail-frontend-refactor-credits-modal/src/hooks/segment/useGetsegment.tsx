import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '@/store';
import segment_API_ENPOINTS from '@/api/segment.api';
import { setActivesegment } from '@/store/features/selected-segment/selected-segment-slice';
import { Tsegment } from '@/types/segment.types';
import { TApiResponse } from '@/types/api.types';

const useGetsegment = () => {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [segment, setsegment] = useState<Tsegment | null>(null);

  const authState = useAppSelector((state) => state.auth);
  const selectedsegmentstate = useAppSelector((state) => state.selectedsegment);

  const getsegment: () => Promise<Tsegment | undefined> =
    useCallback(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          segment_API_ENPOINTS.GET_segment_BY_ID(
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

        const data: TApiResponse<Tsegment> = await res.json();
        if (!data.status) {
          throw new Error(data.message);
        }
        setsegment(data.data as Tsegment);
        dispatch(
          setActivesegment({
            segmentId: data.data._id,
            name: data.data.name,
            description: data.data.description,
            createdAt: data.data.createdAt,
            created_by: data.data.created_by,
            updatedAt: data.data.updatedAt,
            updated_by: data.data.updated_by,
            is_active: data.data.is_active,
            recipients: data.data.recipients,
          })
        );
        return data.data as Tsegment;
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
    }, [authState.currentToken, selectedsegmentstate.segmentId, toast, dispatch]);

  useEffect(() => {
    if (authState.userId && selectedsegmentstate.segmentId) {
      getsegment();
    }
  }, [selectedsegmentstate.segmentId, authState.userId, getsegment]);

  return { loading, segment, refetch: getsegment };
};

export default useGetsegment;
