import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  RadioGroup,
  Radio,
  VStack,
  Box,
  Text,
  Button,
  Flex,
} from '@chakra-ui/react';
import { useAppSelector } from '@/store';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFilter: (filter: 'all' | 'draft' | 'sent') => Promise<boolean>;
  currentFilter: 'all' | 'draft' | 'sent';
}
const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onFilter,
  currentFilter,
}) => {
  const filter = useAppSelector((state) => state.filter.currentFilter);
  const [tempFilter, setTempFilter] = useState<
    'all' | 'draft' | 'sent' | string
  >(currentFilter);

  const handleApply = async () => {
    const _filter = tempFilter as 'all' | 'draft' | 'sent';
    const success = await onFilter(_filter);
    if (!success) {
      setTempFilter(filter);
    }
    onClose();
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        bg="white"
        borderRadius="md"
        boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
        maxWidth="400px"
      >
        <ModalHeader padding="20px 20px 0">
          <Text fontSize="3xl" fontWeight="bold" color="#6D66C8">
            Filter Templates By:
          </Text>
        </ModalHeader>
        <ModalCloseButton color="#333" top="20px" right="20px" />
        <ModalBody pb={6}>
          <Box>
            <RadioGroup
              value={tempFilter}
              onChange={setTempFilter}
              defaultValue="all"
            >
              <VStack align="all" spacing={3}>
                <Radio value="all" colorScheme="purple">
                  <Text fontSize="xl" color="#6C6C6C">
                    All Templates
                  </Text>
                </Radio>
                <Radio value="sent" colorScheme="purple">
                  <Text fontSize="xl" color="#6C6C6C">
                    Sent Templates
                  </Text>
                </Radio>
                <Radio value="draft" colorScheme="purple">
                  <Text fontSize="xl" color="#6C6C6C">
                    Draft Templates
                  </Text>
                </Radio>
              </VStack>
            </RadioGroup>
          </Box>
          <Flex justifyContent="center" mt={6}>
            <Button
              bgColor="#0C9100"
              color="white"
              onClick={handleApply}
              fontSize="xl"
              fontWeight="bold"
              borderRadius="xl"
              px="12"
            >
              Filter
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default FilterModal;
