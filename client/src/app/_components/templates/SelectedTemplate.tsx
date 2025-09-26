import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useAppSelector } from '@/store';
import TemplateHeader from './template-header/TemplateHeader';
import EmailTemplateViewer from './EmailTemplateViewer';

const SelectedTemplate = () => {
  const { templateId } = useAppSelector((state) => state.selectedTemplate);

  if (!templateId) {
    return (
      <Flex
        align="center"
        justify="center"
        height="100%"
        width="100%"
        fontSize="lg"
      >
        Select a template to view
      </Flex>
    );
  }

  return (
    <Flex
      width={'100%'}
      direction={'column'}
      height={'100%'}
      boxShadow="-2px 20px 20px rgba(0,0,0, 0.25)"
      zIndex={10}
    >
      <TemplateHeader />
      <EmailTemplateViewer />
    </Flex>
  );
};

export default SelectedTemplate;
