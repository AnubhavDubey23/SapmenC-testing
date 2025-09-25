import { Box, Button, Text, useDisclosure, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { PiPaperclipHorizontal } from 'react-icons/pi';
import GlobalModalWrapper from '../modals/GlobalModalWrapper';
import { LoadingModal } from '../modals/LoadingModal';
import { AttachmentImporter } from '../importers/AttachmentImporter';
import { Attachment } from './Attachment';

interface AttachmentsProps {
  onChangeAttachments: (files: File[]) => void;
  onRemoveAttachment: (idx: number) => void;
  attachments: File[];
}

export function Attachments({
  onChangeAttachments,
  onRemoveAttachment,
  attachments,
}: AttachmentsProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false);

  if (loading) {
    return <LoadingModal isOpen={loading} onClose={() => setLoading(false)} />;
  }

  return (
    <>
      <GlobalModalWrapper
        title={'Attach Files'}
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
      >
        <AttachmentImporter
          onChangeAttachments={onChangeAttachments}
          onClose={onClose}
        />
      </GlobalModalWrapper>
      <Box my={2}>
        <VStack align="left">
          <Text>Attachments</Text>
          <Box>
            <Button
              colorScheme="purple"
              size="xs"
              onClick={onOpen}
              borderRadius={'3xl'}
              leftIcon={<PiPaperclipHorizontal />}
              disabled={attachments.length > 0}
            >
              Attach Files (Max: 25MB)
            </Button>
          </Box>

          {attachments.length > 0 && (
            <Box maxHeight="200px" overflowY="auto">
              {attachments.map((attachment, idx) => (
                <Box mb={1} key={idx}>
                  <Attachment
                    attachment={attachment}
                    idx={idx}
                    onRemove={onRemoveAttachment}
                  />
                </Box>
              ))}
            </Box>
          )}
        </VStack>
      </Box>
    </>
  );
}
