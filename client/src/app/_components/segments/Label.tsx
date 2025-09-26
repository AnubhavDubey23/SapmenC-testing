'use client';
import { useAppDispatch } from '@/store';
import {
  ISelectedsegmentstate,
  setActivesegment,
} from '@/store/features/selected-segment/selected-segment-slice';
import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import React from 'react';
import { formatDate } from '@/utils/helpers';

interface IsegmentProps extends Partial<ISelectedsegmentstate> {
  isSelected: boolean;
}

const Segment = ({
  isSelected,
  segmentId,
  name,
  createdAt,
  created_by,
  updated_by,
  description,
  is_active,
  updatedAt,
  recipients,
}: IsegmentProps) => {
  const dispatch = useAppDispatch();
  const handleSetActivesegment = () => {
    dispatch(
      setActivesegment({
        segmentId: segmentId as string,
        name: name as string,
        description: description as string,
        created_by: created_by || { name: '', email: '' },
        updated_by: updated_by || { name: '', email: '' },
        is_active: is_active as boolean,
        createdAt: createdAt as any,
        updatedAt: updatedAt as any,
        recipients: recipients || [],
      })
    );
  };
  return (
    <Flex
      alignItems={'center'}
      onClick={handleSetActivesegment}
      cursor={'pointer'}
      bg={isSelected ? 'gray.200' : 'white'}
      p={2}
      _hover={{ bg: 'gray.100' }}
      color={isSelected ? 'black' : 'gray.500'}
    >
      <Flex alignItems={'center'} justifyContent={'space-between'} w={'100%'}>
        <Box>
          <Text fontSize={'md'} fontWeight={isSelected ? 'bold' : 'normal'}>
            {name}
          </Text>
          <Text fontSize={'xs'} color={'gray.400'}>
            {description}
          </Text>
        </Box>
        <Box>
          <Text fontSize={'xs'} color={'gray.400'}>
            {formatDate(createdAt!)}
          </Text>
          <HStack>
            <Text fontSize={'xs'} color={'gray.400'}>
              {recipients?.length} {'Recipients'}
            </Text>
          </HStack>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Segment;
