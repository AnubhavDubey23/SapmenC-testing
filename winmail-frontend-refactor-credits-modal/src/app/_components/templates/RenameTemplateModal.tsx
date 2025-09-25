import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface RenameTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newName: string) => void;
  currentName: string;
}

const RenameTemplateModal: React.FC<RenameTemplateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentName,
}) => {
  const [newName, setNewName] = useState(currentName);

  const handleSave = () => {
    onSave(newName);
    onClose();
  };

  const { t } = useTranslation();

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        bg="white"
        borderRadius="md"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
      >
        <ModalHeader color="#6D66C8" fontSize="3xl" fontWeight="bold">
          Rename Template
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new template name"
              focusBorderColor="#6D66C8"
              autoFocus
            />
          </VStack>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <Button
            onClick={handleSave}
            bg="#0C9100"
            color="white"
            _hover={{ bg: '#0C9100' }}
            borderRadius="xl"
            px="10"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
            }}
          >
            {t('Save')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RenameTemplateModal;
