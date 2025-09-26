import { Box, Button } from '@chakra-ui/react';
import React from 'react';
import { DeleteAccount } from './DeleteAccount';

export function ProfileActions() {
  return (
    <Box display="flex" flexDirection="column" gap={4} mt={4} width="100%" fontSize={'sm'} >
      <Button colorScheme="purple">Change password</Button>
      <DeleteAccount />
    </Box>
  );
}
