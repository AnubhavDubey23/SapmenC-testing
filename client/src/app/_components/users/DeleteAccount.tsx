import { Button, useDisclosure } from '@chakra-ui/react';
import { DeleteAccountConfirmation } from './DeleteAccountConfirmation';

export function DeleteAccount() {
  const disclosure = useDisclosure();
  return (
    <>
      <DeleteAccountConfirmation {...disclosure} />
      <Button colorScheme="red" onClick={disclosure.onOpen} fontSize={'sm'} >
        Delete Account
      </Button>
      ;
    </>
  );
}
