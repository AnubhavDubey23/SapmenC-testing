import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { useAppSelector } from '@/store';
import { useTranslation } from 'react-i18next';

const TemplateHeaderLeft = () => {
  const selectedTemplate = useAppSelector((state) => state.selectedTemplate);
  const { t } = useTranslation();
  return (
    <Flex gap={'5'} alignItems={'center'}>
      <Text color={'text.dark'}>
        {t('Subject')}
        {': '}
      </Text>
      <Text color={'text.light'}>{selectedTemplate.subject}</Text>
    </Flex>
  );
};

export default TemplateHeaderLeft;
