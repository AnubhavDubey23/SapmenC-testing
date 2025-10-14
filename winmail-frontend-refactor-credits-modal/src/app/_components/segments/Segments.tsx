import { Box } from '@chakra-ui/react';
import React from 'react';
import { useAppSelector } from '@/store';
import Segment from './Label';
import usesegments from '@/hooks/segment/usesegments';
import { Tsegment } from '@/types/segment.types';

const Segments = () => {
  const selectedsegmentstate = useAppSelector((state) => state.selectedsegment);

  const { loading, segments } = usesegments();

  if (loading) {
    return <Box>Loading segments...</Box>;
  }

  return (
    <Box
      __css={{
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'gray.300',
          borderRadius: '24px',
        },
      }}
      flex={1}
      overflowY={'auto'}
    >
      {segments?.map((segment: Tsegment) => {
        return (
          <Segment
            isSelected={selectedsegmentstate.segmentId === segment?._id}
            segmentId={segment?._id}
            name={segment?.name}
            key={segment?._id}
            createdAt={segment?.createdAt}
            description={segment?.description}
            created_by={segment?.created_by}
            updated_by={segment?.updated_by}
            is_active={segment?.is_active}
            updatedAt={segment?.updatedAt}
            recipients={segment?.recipients}
          />
        );
      })}
    </Box>
  );
};

export default Segments;
