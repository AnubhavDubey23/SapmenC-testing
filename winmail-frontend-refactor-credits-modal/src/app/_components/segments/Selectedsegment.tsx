import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useAppSelector } from '@/store';
import SegmentHeader from './segment-header/Segment';
import EmailsListViewer from './EmailsListViewer';

const Selectedsegment = () => {
  const { segmentId, recipients } = useAppSelector(
    (state) => state.selectedsegment
  );

  if (!segmentId) {
    return (
      <Flex
        align="center"
        justify="center"
        height="100%"
        width="100%"
        fontSize="lg"
      >
        {'Select a segment to view'}
      </Flex>
    );
  }

  const segmentRecipients = [...recipients].reverse();

  return (
    <Flex
      width={'100%'}
      direction={'column'}
      height={'100%'}
      gap={4}
      boxShadow="-2px 20px 20px rgba(0,0,0,0.25)"
    >
      <SegmentHeader />
      <EmailsListViewer recipients={segmentRecipients} />
    </Flex>
  );
};

export default Selectedsegment;
