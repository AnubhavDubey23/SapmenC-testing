'use client';
import { useAppSelector } from '@/store';
import { Box, Flex, Stack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import TemplatePanel from './TemplatePanel';
import InspectorDrawer from './InspectorDrawer';
import { setDocument } from '../documents/editor/EditorContext';
import { useHydrated } from 'react-hydration-provider';
import { TEditorConfiguration } from '../documents/editor/core';
import EMPTY_EMAIL_MESSAGE from '../documents/get-configuration/sample/empty-email-message';

const TemplateEditorApp = () => {
  const hydrated = useHydrated();
  const selectedTemplate = useAppSelector((state) => state.selectedTemplate);
  useEffect(() => {
    if (!selectedTemplate) {
      setDocument(EMPTY_EMAIL_MESSAGE);
      return;
    }
    setDocument(selectedTemplate.email_data as TEditorConfiguration);
  }, [selectedTemplate.templateId]);

  if (!hydrated) return null;

  return (
    <Box color={'text.dark'} flex={'1'} overflowY={'auto'}>
      <Flex direction={'row'} overflowY={'auto'}>
        <Stack flex={0.75}>
          <TemplatePanel />
        </Stack>
        <InspectorDrawer />
      </Flex>
    </Box>
  );
};

export default TemplateEditorApp;
