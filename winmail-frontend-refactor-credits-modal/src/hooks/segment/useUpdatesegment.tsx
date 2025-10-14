import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAppSelector } from '@/store';
import segment_API_ENPOINTS from '@/api/segment.api';
import usesegments from './usesegments';
import { Tsegment } from '@/types/segment.types';
import { TApiResponse } from '@/types/api.types';

const useUpdatesegment = () => {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const authState = useAppSelector((state) => state.auth);
  const selectedsegmentstate = useAppSelector((state) => state.selectedsegment);
  const { getAllsegments } = usesegments();

  const updatesegment = async (body: any) => {
    setLoading(true);
    try {
      const res = await fetch(
        segment_API_ENPOINTS.UPDATE_segment(selectedsegmentstate.segmentId),
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${authState.currentToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      const data: TApiResponse<Tsegment> = await res.json();
      if (!data.status) {
        throw new Error(data.message);
      }
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

  return { loading, updatesegment };
};

export default useUpdatesegment;
