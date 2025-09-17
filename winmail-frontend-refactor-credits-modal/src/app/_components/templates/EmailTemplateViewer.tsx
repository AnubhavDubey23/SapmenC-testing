import { useAppSelector } from '@/store';
import { Box, Flex, VStack } from '@chakra-ui/react';
import React from 'react';
import useGetTemplate from '@/hooks/template/useGetTemplate';
import { Reader } from '@usewaypoint/email-builder';
import { TReaderDocument } from '@usewaypoint/email-builder';
import Loader from '../loaders/Loader';

const EmailTemplateViewer = () => {
  const { loading } = useGetTemplate();

  const { email_data } = useAppSelector((state) => state.selectedTemplate);
  if (email_data === undefined || Object.keys(email_data).length === 0) {
    return (
      <Flex justify={'center'} align={'center'} h={'100%'}>
        {'Select a template to view'}
      </Flex>
    );
  }

  if (loading) {
    return (
      <Flex justify={'center'} align={'center'} h={'100%'}>
        <Loader />
      </Flex>
    );
  }

  return (
    <Box flex={'1'} overflowY={'auto'}>
      <VStack spacing={4} align="stretch">
        <Reader document={email_data as TReaderDocument} rootBlockId="root" />
      </VStack>
    </Box>
  );
};

export default EmailTemplateViewer;
