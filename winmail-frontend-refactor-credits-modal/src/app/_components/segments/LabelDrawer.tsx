import React from 'react';
import { openTemplateEditor } from '@/store/features/template-editor/template-editor-slice';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
  Text,
  Flex,
  VStack,
  useToast,
  Button,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '@/store';
import dayjs from 'dayjs';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { CgCopy } from 'react-icons/cg';
import { FaPencilAlt } from 'react-icons/fa';

type Props = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const SegmentDrawer = ({ isOpen, onOpen, onClose }: Props) => {
  const toast = useToast();
  const selectedsegmentstate = useAppSelector((state) => state.selectedsegment);
  const handleCopyTemplateId = () => {
    navigator.clipboard.writeText(selectedsegmentstate.segmentId);
    toast({
      title: 'Template Id copied',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };
  return (
    <Drawer
      size={'sm'}
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      closeOnOverlayClick={true}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          <Text
            fontSize="2xl"
            textAlign={'center'}
            fontWeight="bold"
            color="#6D66C8"
          >
            {selectedsegmentstate.name}
          </Text>
        </DrawerHeader>

        <DrawerBody>
          <VStack spacing={4}>
            <Box>
              <VStack spacing={2}>
                <Text my={2} fontSize="lg" fontWeight="bold">
                  Details
                </Text>
                <Flex
                  justifyContent={'start'}
                  alignItems={'center'}
                  w={'100%'}
                  gap={3}
                >
                  <Text color="#6D66C8" fontWeight="bold" fontSize="lg">
                    Template ID:
                  </Text>
                  <Text>{selectedsegmentstate.segmentId}</Text>
                  <CgCopy
                    onClick={handleCopyTemplateId}
                    style={{ cursor: 'pointer' }}
                  />
                </Flex>
                <Flex
                  justifyContent={'start'}
                  alignItems={'center'}
                  w={'100%'}
                  gap={3}
                >
                  <Text color="#6D66C8" fontWeight="bold" fontSize="lg">
                    Created On:
                  </Text>
                  <Text>
                    {dayjs(selectedsegmentstate.createdAt).format(
                      'DD/MM/YYYY | HH:mm a'
                    )}
                  </Text>
                </Flex>
                <Flex
                  justifyContent={'start'}
                  alignItems={'center'}
                  w={'100%'}
                  gap={3}
                >
                  <Text color="#6D66C8" fontWeight="bold" fontSize="lg">
                    Updated On:
                  </Text>
                  <Text>
                    {dayjs(selectedsegmentstate.updatedAt).format(
                      'DD/MM/YYYY | HH:mm a'
                    )}
                  </Text>
                </Flex>
                <Flex
                  justifyContent={'start'}
                  alignItems={'center'}
                  w={'100%'}
                  gap={3}
                >
                  <Text color="#6D66C8" fontWeight="bold" fontSize="lg">
                    {'Created By:'}
                  </Text>
                  <Text>{selectedsegmentstate?.created_by?.name}</Text>
                </Flex>
                <Flex
                  justifyContent={'start'}
                  alignItems={'center'}
                  w={'100%'}
                  gap={3}
                >
                  <Text color="#6D66C8" fontWeight="bold" fontSize="lg">
                    {'Updated By:'}
                  </Text>
                  <Text>{selectedsegmentstate?.updated_by?.name}</Text>
                </Flex>
                <Flex
                  justifyContent={'start'}
                  alignItems={'center'}
                  w={'100%'}
                  gap={3}
                >
                  <Text color="#6D66C8" fontWeight="bold" fontSize="lg">
                    {'Description:'}
                  </Text>
                  <Text>{selectedsegmentstate?.description}</Text>
                </Flex>
              </VStack>
            </Box>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SegmentDrawer;
