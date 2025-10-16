import {
  Avatar,
  Box,
  Button,
  HStack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { FaEdit, FaUser } from 'react-icons/fa';
import ChooseAvatar from './ChooseAvatar';

interface AvatarSectionProps {
  username: string;
  profilePicture: string | null;
  setProfilePicture: (image: string) => Promise<void>;
}

export function AvatarSection({
  username,
  profilePicture,
  setProfilePicture,
}: AvatarSectionProps) {
  const {
    onClose: onCloseAvatarModal,
    onOpen: onOpenAvatarModal,
    isOpen: isAvatarModalOpen,
  } = useDisclosure();
  return (
    <Box>
      <ChooseAvatar
        isOpen={isAvatarModalOpen}
        onClose={onCloseAvatarModal}
        setProfilePicture={setProfilePicture}
      />
      <HStack spacing={4} align="center">
        {profilePicture ? (
          <Avatar 
            size="xl" 
            src={profilePicture}
            onError={() => {
              console.warn('Avatar image failed to load:', profilePicture);
            }}
          />
        ) : (
          <FaUser size={50} />
        )}

        <VStack spacing={1} align="start">
          <Text fontSize="lg" fontWeight="semibold">
            {username}
          </Text>
          <Button
            leftIcon={<FaEdit size={12} />}
            onClick={onOpenAvatarModal}
            background="#C4C3FB"
            color="#FFFFFF"
            fontWeight={400}
            lineHeight="100%"
            fontSize="12px"
            height="31px"
            width="102px"
            borderRadius="15px"
            px={0}
            py={0}
            _hover={{ bg: '#B2B1F0' }}
          >
            Edit Avatar
          </Button>
        </VStack>
      </HStack>
    </Box>
  );
}
