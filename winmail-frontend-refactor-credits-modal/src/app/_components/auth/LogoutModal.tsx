import useLogout from '@/hooks/auth/useLogout';
import { persistor } from '@/store';
import { Box, Button } from '@chakra-ui/react';
import React from 'react';

type Props = {
  onClose: () => void;
};

const LogoutModal = ({ onClose }: Props) => {
  const { loading: logoutLoading, logout } = useLogout();
  const handleLogout = (e: any) => {
    e.preventDefault();
    logout();
    persistor.pause();
    persistor.flush().then(() => {
      return persistor.purge();
    });
    onClose();
  };
  return (
    <Box p={4} bg={'header.bg'} borderRadius="md">
      <p>{'Are you sure you want to logout?'}</p>
      <Box display="flex" justifyContent="start" width="100%" mt={4}>
        <Button
          onClick={handleLogout}
          colorScheme="red"
          loadingText="Logging out..."
          isLoading={logoutLoading}
        >
          {'Logout'}
        </Button>
      </Box>
    </Box>
  );
};

export default LogoutModal;
