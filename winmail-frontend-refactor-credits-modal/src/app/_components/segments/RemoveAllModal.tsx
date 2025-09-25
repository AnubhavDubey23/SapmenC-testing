import React from 'react';
import { Box, Button, Text, useToast } from '@chakra-ui/react';
import { useAppDispatch } from '@/store';
import useGetsegment from '@/hooks/segment/useGetsegment';
import { setActivesegment } from '@/store/features/selected-segment/selected-segment-slice';
import useUpdatesegment from '@/hooks/segment/useUpdatesegment';

interface RemoveAllModalProps {
  onClose: () => void;
}

export default function RemoveAllModal({ onClose }: RemoveAllModalProps) {
  const toast = useToast();
  const dispatch = useAppDispatch();

  const { loading, segment, refetch } = useGetsegment();
  const { loading: updateLoading, updatesegment } = useUpdatesegment();
  const handleRemoveAllRecipients = async () => {
    try {
      if (segment) {
        const res = await updatesegment({ segmentId: segment._id, recipients: [] });
        if (res) {
          toast({
            title: 'All recipients removed successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          refetch(); // call refetch to refresh the data

          dispatch(
            setActivesegment({
              segmentId: segment._id,
              name: segment.name,
              description: segment.description,
              createdAt: segment.createdAt,
              created_by: segment.created_by,
              updatedAt: segment.updatedAt,
              updated_by: segment.updated_by,
              is_active: segment.is_active,
              recipients: [],
            })
          );

          onClose();
        } else {
          toast({
            title: 'Failed to remove all recipients',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: 'Failed to remove all recipients',
          description: 'segment not found',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error('Error removing all recipients', err);
    }
  };

  return (
    <Box>
      <Text>
        Are you sure to delete remove all recipients? This action cannot be
        undone.
      </Text>
      <Box display="flex" justifyContent="center" width="100%" mt={4}>
        <Button
          onClick={handleRemoveAllRecipients}
          colorScheme="red"
          isLoading={updateLoading}
          isDisabled={updateLoading}
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
}
