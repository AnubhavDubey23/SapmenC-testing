import { useDeleteUser } from '@/hooks/user/useDeleteUser';
import GlobalModalWrapper from '../modals/GlobalModalWrapper';
import { Text, Button, VStack, Box, useToast } from '@chakra-ui/react';

interface DeleteAccountConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteAccountConfirmation({
  isOpen,
  onClose,
}: DeleteAccountConfirmationProps) {
  const { deleteUser, loading } = useDeleteUser();
  const toast = useToast();

  const handleDeleteAccount = async () => {
    try {
      await deleteUser();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast({
        title: 'Could not delete account',
        description: err.message,
        status: 'error',
      });
    }
  };

  return (
    <GlobalModalWrapper
      title="Delete Account"
      isOpen={isOpen}
      onClose={onClose}
    >
      <VStack spacing={4} align="stretch" py={4}>
        <Text>
          Are you sure you want to delete your account? This action cannot be
          undone and all your data will be permanently removed.
        </Text>

        <Box display="flex" justifyContent="flex-end" pt={2}>
          <Button
            colorScheme="red"
            onClick={handleDeleteAccount}
            disabled={loading}
            loadingText="Deleting..."
          >
            Delete Account
          </Button>
        </Box>
      </VStack>
    </GlobalModalWrapper>
  );
}
