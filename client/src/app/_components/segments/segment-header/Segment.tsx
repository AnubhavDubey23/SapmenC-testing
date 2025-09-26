import { Flex } from '@chakra-ui/react';
import React from 'react';
import SegmentHeaderLeft from './SegmentHeaderLeft';
import SegmentHeaderRight from './SegmentHeaderRight';

const SegmentHeader = () => {
  return (
    <Flex
      h="8vh"
      p={2}
      justifyContent={'space-between'}
      alignItems={'center'}
      w={'100%'}
      bgColor={'text.white'}
    >
      <SegmentHeaderLeft />
      <SegmentHeaderRight />
    </Flex>
  );
};

export default SegmentHeader;
