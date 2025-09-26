import { Box, VStack } from '@chakra-ui/react';
import React from 'react';
import useTemplates from '@/hooks/template/useTemplates';
import { useAppSelector } from '@/store';
import Template from './Template';
import { TTemplate } from '@/types/template.types';

const Templates = () => {
  const selectedTemplateState = useAppSelector(
    (state) => state.selectedTemplate
  );
  const { loading, templates } = useTemplates();

  if (loading) {
    return <Box>Loading Templates...</Box>;
  }

  if (!templates || templates.length === 0) {
    return <Box>No Templates Found</Box>;
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
      <VStack align="stretch" overflowY="auto">
        {templates.map((template: TTemplate) => {
          return (
            <Template
              key={template._id}
              isSelected={selectedTemplateState.templateId === template._id}
              templateId={template._id}
              name={template.name}
              createdAt={template.createdAt}
              description={template.description}
              created_by={template.created_by}
              updated_by={template.updated_by}
              email_data={template.email_data}
              is_active={template.is_active}
              updatedAt={template.updatedAt}
              subject={template.subject}
              is_triggered={template.is_triggered}
              stats={template.stats}
              segments_used={template.segments_used}
            />
          );
        })}
      </VStack>
    </Box>
  );
};

export default Templates;
