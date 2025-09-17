import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody } from '@chakra-ui/react';

interface IAuthModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose, children }: IAuthModalProps) => {
  return (
    <Modal
      size={['full', 'full', 'full', 'full']}
      isOpen={isOpen}
      onClose={onClose}
      onOverlayClick={onClose}
    >
      <ModalOverlay />
      <ModalContent className="auth-modal-bg">
        <ModalBody p={0}>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;
