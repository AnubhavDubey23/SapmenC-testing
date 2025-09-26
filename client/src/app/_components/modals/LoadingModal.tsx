import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';
import Loader from '../loaders/Loader';

interface LoadingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoadingModal({ isOpen, onClose }: LoadingModalProps) {
  return (
    <Modal size="full" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent bg="transparent">
        <ModalBody p={0}>
          <Flex
            alignItems={'center'}
            justifyContent={'center'}
            minHeight="100vh"
          >
            <Box>
              <Loader />
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
