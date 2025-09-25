import React from 'react';
import GlobalModalWrapper from '../../modals/GlobalModalWrapper';
import ImportJsonModal from './ImportJsonModal';
import { Box, Tooltip, useDisclosure } from '@chakra-ui/react';
import { MdFileUpload } from 'react-icons/md';

interface ImportJsonProps {
  isFreePlan: boolean;
  onOpenUpgradeModal: () => void;
}

function ImportJson({ isFreePlan, onOpenUpgradeModal }: ImportJsonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <GlobalModalWrapper
        isOpen={isOpen}
        onClose={onClose}
        title="Import JSON"
        key={'import-json'}
      >
        <ImportJsonModal onClose={onClose} />
      </GlobalModalWrapper>

      <Tooltip label="Import JSON">
        <Box
          onClick={() => {
            if (isFreePlan) {
              onOpenUpgradeModal();
              return;
            }

            onOpen();
          }}
          cursor={'pointer'}
          as="button"
        >
          <MdFileUpload cursor={'pointer'} />
        </Box>
      </Tooltip>
    </>
  );
}

export default ImportJson;
