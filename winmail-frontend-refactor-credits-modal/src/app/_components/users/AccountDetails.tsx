import useUpdateUser from '@/hooks/user/useUpdateUser';
import { TAuthUserProfile } from '@/types/user.types';
import {
  VStack,
  Badge,
  Box,
  Button,
  Flex,
  Input,
  Text,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

interface AccountDetailsProps {
  user: TAuthUserProfile;
}

export function AccountDetails({ user }: AccountDetailsProps) {
  const { updateUser, loading } = useUpdateUser();
  const [phoneNumber, setPhoneNumber] = useState<string>(user.phone || '');
  const [isFirstSave, setIsFirstSave] = useState<boolean>(!user.phone);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  useEffect(() => {
    if (phoneNumber !== user.phone) {
      setIsDirty(true);
    } else {
      setIsDirty(false);
    }
  }, [phoneNumber, user.phone]);

  const handlePhoneNumberSave = async () => {
    try {
      if (user.phone === phoneNumber) return;

      await updateUser({ phone: phoneNumber });
      setIsFirstSave(false);
      setIsDirty(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      border="1px"
      borderColor="#C1C1C1"
      p={4}
      rounded="lg"
      width="100%"
      borderRadius="20px"
    >
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Account Details
      </Text>
      <VStack spacing={2} align="start">
        <Box>
          <Text fontSize="md" fontWeight="bold">
            Email:
          </Text>
          <Text fontSize="sm">{user.email}</Text>
        </Box>

        <Box>
          <Text fontSize="md" fontWeight="bold">
            Phone:
          </Text>
          <Flex gap="3">
            <Input
              type="text"
              fontSize={'sm'}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Button
              fontSize="sm"
              disabled={!isDirty || loading}
              colorScheme={isFirstSave ? (isDirty ? 'green' : 'gray') : 'blue'}
              variant={isDirty ? 'solid' : 'outline'}
              opacity={!isDirty && isFirstSave ? 0.6 : 1}
              cursor={!isDirty && isFirstSave ? 'not-allowed' : 'pointer'}
              onClick={handlePhoneNumberSave}
            >
              {isFirstSave ? 'Save' : 'Edit'}
            </Button>
          </Flex>
        </Box>

        <Box>
          <Text fontSize="md" fontWeight="bold">
            Status:
          </Text>
          <Text fontSize="sm">
            {user.is_active ? (
              <Badge colorScheme="green">Active</Badge>
            ) : (
              <Badge colorScheme="red">Inactive</Badge>
            )}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
