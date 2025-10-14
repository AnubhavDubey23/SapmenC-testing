import React, { useState } from 'react';
import {
  Grid,
  Button,
  Image,
  VStack,
  HStack,
  useToast,
  Box,
} from '@chakra-ui/react';
import GlobalModalWrapper from '../modals/GlobalModalWrapper';

type AvatarOption = string;

const avatarOptions: AvatarOption[] = [
  'https://ik.imagekit.io/qxqwvk1m1/MailerOne_Avatars/8063764_63457%201.svg?updatedAt=1727696371717',
  'https://ik.imagekit.io/qxqwvk1m1/MailerOne_Avatars/8063764_63457%202.svg?updatedAt=1727696371721',
  'https://ik.imagekit.io/qxqwvk1m1/MailerOne_Avatars/8063764_63457%204.svg?updatedAt=1727696371684',
  'https://ik.imagekit.io/qxqwvk1m1/MailerOne_Avatars/8063764_63457%205.svg?updatedAt=1727696372193',
  'https://ik.imagekit.io/qxqwvk1m1/MailerOne_Avatars/8063764_63457%206.svg?updatedAt=1727696371671',
  'https://ik.imagekit.io/qxqwvk1m1/MailerOne_Avatars/8063764_63457%203.svg?updatedAt=1727696371679',
  'https://ik.imagekit.io/qxqwvk1m1/MailerOne_Avatars/8063764_63457%207.svg?updatedAt=1727696371711',
  'https://ik.imagekit.io/qxqwvk1m1/MailerOne_Avatars/8063764_63457%208.svg?updatedAt=1727696372214',
  'https://ik.imagekit.io/qxqwvk1m1/MailerOne_Avatars/8063764_63457%209.svg?updatedAt=1727696372192',
];

interface ChooseAvatarProps {
  isOpen: boolean;
  onClose: () => void;
  setProfilePicture: (image: string) => Promise<void>;
}

export default function ChooseAvatar({
  isOpen,
  onClose,
  setProfilePicture,
}: ChooseAvatarProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarOption | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleAvatarSelect = (avatar: AvatarOption) => {
    setSelectedAvatar(avatar);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      if (selectedAvatar) {
        await setProfilePicture(selectedAvatar);
        onClose();
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlobalModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Your Avatar"
      size="xl"
    >
      <VStack spacing={6}>
        <Grid templateColumns="repeat(3, 1fr)" gap={8}>
          {avatarOptions.map((avatar, index) => (
            <Box
              key={index}
              onClick={() => handleAvatarSelect(avatar)}
              role="button"
              borderWidth={selectedAvatar === avatar ? '4px' : '0px'}
              borderColor="purple.500"
              borderRadius="md"
              _hover={{ transform: 'scale(1.05)' }}
              cursor="pointer"
            >
              <Image
                src={avatar}
                alt={`Avatar option ${index + 1}`}
                boxSize="100px"
                objectFit="cover"
                borderRadius="md"
                loading="eager"
                fetchPriority="high"
              />
            </Box>
          ))}
        </Grid>
        <HStack spacing={4} justifyContent="center" width="100%">
          <Button onClick={onClose} variant="ghost">
            {'Cancel'}
          </Button>
          <Button
            onClick={handleConfirm}
            isDisabled={!selectedAvatar}
            colorScheme="green"
            isLoading={loading}
            loadingText="Confirming..."
          >
            {'Confirm'}
          </Button>
        </HStack>
      </VStack>
    </GlobalModalWrapper>
  );
}
