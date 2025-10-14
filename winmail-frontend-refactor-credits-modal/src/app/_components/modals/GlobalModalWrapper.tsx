import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
} from '@chakra-ui/react';

interface IAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: string;
}

const GlobalModalWrapper = ({
  title,
  isOpen,
  onClose,
  children,
  size,
}: IAuthModalProps) => {
  return (
    <Modal
      scrollBehavior="inside"
      isOpen={isOpen}
      onClose={onClose}
      onOverlayClick={onClose}
      isCentered
      size={size ? size : 'md'}
    >
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />

      <ModalContent>
        <ModalHeader color="#6D66C8" fontSize="3xl" fontWeight="bold">
          {title}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GlobalModalWrapper;
