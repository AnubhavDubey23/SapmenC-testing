import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { RxCross2 } from 'react-icons/rx';

interface AttachmentProps {
  attachment: File;
  idx: number;
  onRemove: (idx: number) => void;
}

export function Attachment({ attachment, idx, onRemove }: AttachmentProps) {
  return (
    <Box
      borderColor="black"
      borderWidth="1px"
      width="80%"
      px={1}
      py={0.5}
      borderRadius="lg"
    >
      <Flex direction="row" alignItems="center" justifyContent="space-between">
        <Text>{attachment.name}</Text>
        <Box
          cursor="pointer"
          onClick={() => {
            onRemove(idx);
          }}
        >
          <RxCross2 color="red" />
        </Box>
      </Flex>
    </Box>
  );
}
