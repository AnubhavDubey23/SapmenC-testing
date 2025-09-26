import { Flex } from '@chakra-ui/react';
import React from 'react';
import TemplateHeaderLeft from './TemplateHeaderLeft';
import TemplateHeaderRight from './TemplateHeaderRight';

const TemplateHeader = () => {
  return (
    <Flex
      h="8vh"
      p={2}
      justifyContent={'space-between'}
      alignItems={'center'}
      w={'100%'}
      bgColor={'text.white'}
    >
      <TemplateHeaderLeft />
      <TemplateHeaderRight />
    </Flex>
  );
};

export default TemplateHeader;
