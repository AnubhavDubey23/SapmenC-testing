import { Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';
import LogoImage from '../../../assets/images/logo.svg';

const LogoContainer = () => {
  return (
    <VStack w={['200px']} cursor={'pointer'} spacing={0}>
      <Image src={LogoImage} alt="Win Mail Logo" width={120} height={120} />
      <Text
        as="h1"
        whiteSpace="nowrap"
        className="header-logo"
        fontSize="4xl"
        fontWeight="bold"
      >
        {'MailerOne'}
      </Text>
    </VStack>
  );
};

export default LogoContainer;
