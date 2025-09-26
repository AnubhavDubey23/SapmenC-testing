import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface DeleteTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteTemplateModal: React.FC<DeleteTemplateModalProps> = ({
  isOpen,
  onClose,
  onDelete,
}) => {
  const { t } = useTranslation();
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        bg="white"
        borderRadius="md"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        maxWidth="400px"
      >
        <ModalHeader color="#5D5FEF" fontSize="3xl" fontWeight="bold">
          Delete Template
        </ModalHeader>
        <ModalCloseButton color="#5D5FEF" />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            <Text color="#4A4A4A" fontSize="16px">
              Are you sure? You can&apos;t undo this action afterwards.
            </Text>
            <Button
              onClick={onDelete}
              bg="#D20000"
              color="white"
              _hover={{ bg: '#C82333' }}
              fontWeight="bold"
              borderRadius="xl"
              mt={4}
              px="8"
            >
              {t('Delete')}
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DeleteTemplateModal;
