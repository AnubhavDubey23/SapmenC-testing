'use client';

import React, { useState } from 'react';
import { useAppDispatch } from '@/store';
import {
  ISelectedTemplateState,
  setActiveTemplate,
} from '@/store/features/selected-template/selected-template-slice';
import { Box, Flex, Text, Fade } from '@chakra-ui/react';
import TemplateActionDropdown from './TemplateActionDropdown';
import { formatDate, generateNewTemplateName } from '@/utils/helpers';
import useCreateTemplate from '@/hooks/template/useCreateTemplate';
import useDeleteTemplate from '@/hooks/template/useDeleteTemplate';
import useTemplates from '@/hooks/template/useTemplates';
import useRenameTemplate from '@/hooks/template/useRenameTemplate';
import { TTemplate } from '@/types/template.types';

interface ISelectedTemplateProps extends ISelectedTemplateState {
  isSelected: boolean;
}

const Template = ({
  templateId,
  name,
  description,
  created_by,
  createdAt,
  isSelected,
  email_data,
  is_active,
  updated_by,
  updatedAt,
  subject,
  is_triggered,
  stats,
  segments_used,
}: ISelectedTemplateProps) => {
  const dispatch = useAppDispatch();

  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { renameTemplate } = useRenameTemplate();
  const { createTemplate } = useCreateTemplate();
  const { getAllTemplates } = useTemplates();

  const handleDropdownToggle = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen);
  };

  const handleSetActiveTemplate = () => {
    dispatch(
      setActiveTemplate({
        templateId: templateId,
        created_by: created_by,
        name: name,
        description: description,
        createdAt: createdAt,
        email_data: email_data,
        is_active: is_active,
        updated_by: updated_by,
        updatedAt: updatedAt,
        subject: subject,
        is_triggered: is_triggered,
        stats: stats,
        segments_used: segments_used,
      })
    );
  };

  const handleRename = async (newName: string) => {
    // Implement edit functionality
    try {
      const templateBody: TTemplate = {
        _id: templateId as string,
        created_by: created_by as object,
        name: newName as string,
        description: description as string,
        createdAt: createdAt as string,
        email_data: email_data as object,
        is_active: is_active as boolean,
        updated_by: updated_by as object,
        updatedAt: updatedAt as string,
        subject: subject as string,
        is_triggered: is_triggered as boolean,
        stats: stats,
        segments_used: [],
      };
      await renameTemplate(templateBody);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleCopy = async () => {
    // Implement copy functionality
    const newName = generateNewTemplateName(name as string);
    try {
      const templateBody: Partial<TTemplate> = {
        name: newName as string,
        description: description as string,
        email_data: email_data as object,
        subject: subject as string,
      };
      const res = await createTemplate(templateBody);
      await getAllTemplates();
      if (res !== undefined) {
        dispatch(
          setActiveTemplate({
            ...res,
            templateId: res._id,
          })
        );
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const { deleteTemplate } = useDeleteTemplate();

  const handleDelete: () => Promise<void> = async () => {
    await deleteTemplate(templateId as string);
    await getAllTemplates();
  };

  if (!is_active) {
    return null;
  }

  return (
    <Flex
      alignItems={'center'}
      onClick={handleSetActiveTemplate}
      cursor={'pointer'}
      bg={isSelected ? 'primary.light' : 'white'}
      p={2}
      _hover={{
        bg: isSelected ? 'primary.light' : 'gray.100',
        color: isSelected ? 'white' : 'black',
      }}
      color={isSelected ? 'text.white' : 'gray.500'}
      justifyContent={'space-between'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Box>
        <Flex alignItems="center">
          {!is_triggered && (
            <Box w="8px" h="8px" borderRadius="full" bg="#FDB913" mr={2} />
          )}{' '}
          <Flex flexDirection={'column'}>
            <Box
              fontSize={'md'}
              fontWeight={isSelected ? 'bold' : 'normal'}
              color={isSelected ? 'black' : 'gray.500'}
              p="4"
            >
              {name}
            </Box>
          </Flex>
        </Flex>
      </Box>
      <Box>
        <Flex flexDirection="column" alignItems="end">
          <Text as="p" color="gray.500" fontSize="xs">
            {formatDate(createdAt!)}
          </Text>
          {(isHovered || isDropdownOpen) && (
            <Fade
              in={true}
              transition={{ exit: { delay: 1 }, enter: { duration: 0.6 } }}
            >
              <TemplateActionDropdown
                templateName={name || ''}
                onRename={handleRename}
                onCopy={handleCopy}
                onDelete={handleDelete}
                onDropdownToggle={handleDropdownToggle}
              />
            </Fade>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};

export default Template;
