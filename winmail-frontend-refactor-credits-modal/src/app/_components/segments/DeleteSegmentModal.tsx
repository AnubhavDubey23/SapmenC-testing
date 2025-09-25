import useDeletesegment from '@/hooks/segment/useDeletesegment';
import usesegments from '@/hooks/segment/usesegments';
import { useAppSelector } from '@/store';
import { Box, Button, Text } from '@chakra-ui/react';
import React from 'react';

type Props = {
  onClose: () => void;
};

const DeletesegmentModal = ({ onClose }: Props) => {
  const { loading, deletesegment } = useDeletesegment();
  const selectedsegmentstate = useAppSelector((state) => state.selectedsegment);
  return (
    <Box>
      <Text>Are you sure to delete {selectedsegmentstate.name} segment?</Text>
      <Box display="flex" justifyContent="center" width="100%" mt={4}>
        <Button
          onClick={async () => {
            await deletesegment(selectedsegmentstate.segmentId);
          }}
          colorScheme="red"
          isLoading={loading}
          isDisabled={loading}
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
};

export default DeletesegmentModal;
