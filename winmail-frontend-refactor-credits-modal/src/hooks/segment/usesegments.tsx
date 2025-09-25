import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import segment_API_ENPOINTS from '@/api/segment.api';
import { useAppDispatch, useAppSelector } from '@/store';
import useLogout from '../auth/useLogout';
import { setsegments } from '@/store/features/segments/segments-slice';
import { Tsegment } from '@/types/segment.types';
import { TApiResponse } from '@/types/api.types';

const usesegments: () => {
  loading: boolean;
  segments: Tsegment[];
  getAllsegments: () => Promise<Tsegment[] | undefined>;
} = () => {
  const toast = useToast();
  const { logout } = useLogout();
  const authState = useAppSelector((state) => state.auth);
  const searchBarState = useAppSelector((state) => state.search);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const segmentsState = useAppSelector((state) => state.segments);

  const getAllsegments = async () => {
    setLoading(true);
    try {
      const res = await fetch(segment_API_ENPOINTS.GET_ALL_segments, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authState.currentToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data: TApiResponse<Tsegment[]> = await res.json();

      if (!data.status) {
        if (res.status === 401) {
          logout();
          return;
        }
        throw new Error(data.message);
      }
      if (!searchBarState.query) {
        dispatch(setsegments(data.data));
      } else if (searchBarState.query && searchBarState.module === 'segments') {
        // const fuse = new Fuse(segmentsState.segments, {
        //     includeScore: true,
        //     keys: ['name', 'description']
        // })
        // const result = fuse.search(searchBarState.query)
        dispatch(setsegments(data.data));
      } else {
        dispatch(setsegments(data.data));
      }

      return data.data as Tsegment[];
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
    if (authState.authState && segmentsState.segments.length === 0) {
      getAllsegments();
    }
  }, [authState.authState]);

  return { loading, segments: segmentsState.segments, getAllsegments };
};

export default usesegments;
