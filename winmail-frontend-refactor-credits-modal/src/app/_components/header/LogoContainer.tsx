import { HStack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';
import LogoImage from '@/assets/images/logo.svg';

const LogoContainer = () => {
  return (
    <HStack w={['200px']} cursor={'pointer'}>
      <Image src={LogoImage} alt="Win Mail Logo" width={50} height={50} />
      <Text as="h1" whiteSpace="nowrap" className="header-logo">
        {'MailerOne'}
      </Text>
    </HStack>
  );
};

export default LogoContainer;
