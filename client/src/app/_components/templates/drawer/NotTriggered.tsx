import { Button, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { setSidebarTabIdx } from '../../documents/editor/EditorContext';
import { useAppDispatch } from '@/store';
import { openTemplateEditor } from '@/store/features/template-editor/template-editor-slice';

export default function NotTriggered() {
  const dispatch = useAppDispatch();

  const handleOpenTemplateEditor = () => {
    setSidebarTabIdx(2);
    dispatch(
      openTemplateEditor({
        isOpen: true,
        inspectorDrawerOpen: true,
      })
    );
  };

  return (
    <VStack>
      <Text
        fontSize="lg"
        fontWeight="medium"
        textAlign="center"
        color="gray-700"
      >
        Your email template has not been sent yet. Click below to preview and
        edit before sending.
      </Text>

      <Button
        leftIcon={<FaPencilAlt />}
        onClick={handleOpenTemplateEditor}
        borderRadius="20px"
        p="5"
        bgGradient="linear(to-r, #6D66C8, #221E5A)"
        color="white"
        fontSize="16px"
        fontWeight="bold"
        _hover={{
          bgGradient: 'linear(to-r, #5D56B8, #121040)',
        }}
      >
        Send Template
      </Button>
    </VStack>
  );
}
