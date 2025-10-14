import { TOPBAR_TABS } from '@/consts/tabs';
import { useAppDispatch } from '@/store';
import { setActiveTabState } from '@/store/features/active-tab/active-tab-slice';
import { setActivesegment } from '@/store/features/selected-segment/selected-segment-slice';
import { ISelectedTemplateState } from '@/store/features/selected-template/selected-template-slice';
import { Tsegment } from '@/types/segment.types';
import {
  Box,
  Flex,
  HStack,
  Tag,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import React from 'react';
import { CgCopy } from 'react-icons/cg';

type TemplateInfoProps = {
  template: Partial<ISelectedTemplateState>;
};

export default function TemplateInfo({ template }: TemplateInfoProps) {
  const toast = useToast();
  const dispatch = useAppDispatch();

  const handleCopyTemplateId = () => {
    navigator.clipboard.writeText(template.templateId ?? '');
    toast({
      title: 'Template Id copied',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const handleTagClick = (segment: Tsegment) => {
    // Set the active segment and then switch tabs
    dispatch(
      setActivesegment({
        segmentId: segment._id,
        name: segment.name,
        description: segment.description,
        created_by: segment.created_by,
        createdAt: segment.createdAt,
        updatedAt: segment.updatedAt,
        updated_by: segment.updated_by,
        is_active: segment.is_active,
        recipients: segment.recipients,
      })
    );

    dispatch(setActiveTabState({ tabIndex: TOPBAR_TABS.SEGMENT }));
  };

  return (
    <Box>
      <VStack spacing={2}>
        <Text my={2} fontSize="lg" fontWeight="bold">
          Details
        </Text>
        <Flex justifyContent={'start'} alignItems={'center'} w={'100%'} gap={3}>
          <Text color="#6D66C8" fontWeight="bold" fontSize="lg">
            Template ID:
          </Text>
          <Text>{template.templateId}</Text>
          <CgCopy
            onClick={handleCopyTemplateId}
            style={{ cursor: 'pointer' }}
          />
        </Flex>
        <Flex justifyContent={'start'} alignItems={'center'} w={'100%'} gap={3}>
          <Text color="#6D66C8" fontWeight="bold" fontSize="lg">
            Created On:
          </Text>
          <Text>
            {dayjs(template.createdAt).format('DD/MM/YYYY | HH:mm a')}
          </Text>
        </Flex>
        <Flex justifyContent={'start'} alignItems={'center'} w={'100%'} gap={3}>
          <Text color="#6D66C8" fontWeight="bold" fontSize="lg">
            Updated On:
          </Text>
          <Text>
            {dayjs(template.updatedAt).format('DD/MM/YYYY | HH:mm a')}
          </Text>
        </Flex>
        <Flex justifyContent={'start'} alignItems={'center'} w={'100%'} gap={3}>
          <Text color="#6D66C8" fontWeight="bold" fontSize="lg">
            {'Status:'}
          </Text>
          {template.is_triggered ? (
            <Text color="#00BA1E" fontWeight="bold" fontSize="lg">
              {'Sent'}
            </Text>
          ) : (
            <Text color="yellow.500" fontWeight="bold" fontSize="lg">
              {'Draft'}
            </Text>
          )}
        </Flex>
        <Flex justifyContent={'start'} alignItems={'center'} w={'100%'} gap={3}>
          <Text color="#6D66C8" fontWeight="bold" fontSize="lg">
            {'Segments:'}
          </Text>
          {template.segments_used ? (
            <HStack gap={2}>
              {template.segments_used.map((segment: Tsegment) => (
                <Tag
                  key={segment._id || segment.name}
                  variant="solid"
                  colorScheme="yellow"
                  cursor="pointer"
                  onClick={() => handleTagClick(segment)}
                >
                  {segment.name}
                </Tag>
              ))}
            </HStack>
          ) : null}
        </Flex>
      </VStack>
    </Box>
  );
}
