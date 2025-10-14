import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Button, useToast, Text } from '@chakra-ui/react';
import { IoCloudUpload } from 'react-icons/io5';

type AttachmentImporterProps = {
  onChangeAttachments: (files: File[]) => void;
  onClose: () => void;
};

export const AttachmentImporter = ({
  onChangeAttachments,
  onClose,
}: AttachmentImporterProps) => {
  const onDrop = useCallback(
    (files: File[]) => {
      onChangeAttachments(files);
      onClose();
    },
    [onChangeAttachments, onClose]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    multiple: true,
  });

  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius={8}
      borderColor="gray.200"
      textAlign="center"
    >
      <>
        <Box
          {...getRootProps()}
          p={4}
          borderWidth={2}
          borderRadius={8}
          borderColor="gray.300"
          borderStyle="dashed"
        >
          <input {...getInputProps()} />
          <Text fontWeight={'bold'} color={'text.dark'}>
            {"Drag 'n' drop files here, or click to select one"}
          </Text>
        </Box>
        <Button
          mt={4}
          onClick={open}
          bgColor="purple.500"
          color={'white'}
          leftIcon={<IoCloudUpload />}
        >
          {'Attach'}
        </Button>
      </>
    </Box>
  );
};
