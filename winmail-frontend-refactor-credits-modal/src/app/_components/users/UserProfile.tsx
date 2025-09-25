'use client';

import { Box, Text, VStack, Flex, Divider } from '@chakra-ui/react';
import useMe from '@/hooks/auth/useMe';
import { AdditionalDetails } from './AdditionalDetails';
import { AccountDetails } from './AccountDetails';
import { CreditsDetails } from './CreditsDetails';
import { AvatarSection } from './AvatarSection';
import { ProfileActions } from './ProfileActions';

interface UserProfileProps {
  onClose: () => void;
  setProfilePicture: (image: string) => Promise<void>;
  profilePicture: string | null;
}

const UserProfile = ({
  onClose,
  setProfilePicture,
  profilePicture,
}: UserProfileProps) => {
  const { loading, user, device } = useMe();

  if (loading) {
    return <Text>Loading User Profile...</Text>;
  }

  if (!user) {
    return <Text>User not found or not logged in.</Text>;
  }

  return (
    <Box>
      <Box>
        <Flex
          direction={['column', 'row']}
          gap={6}
          color="#262d25"
          maxW="4xl"
          overflow="hidden"
        >
          <Box flex="1">
            <VStack spacing={2} align="start">
              <AvatarSection
                profilePicture={profilePicture}
                setProfilePicture={setProfilePicture}
                username={user?.name}
              />
              <CreditsDetails
                credits={user.credits}
                onOpenPaymentModal={onClose}
              />
              <AccountDetails user={user} />
              <ProfileActions />
            </VStack>
          </Box>

          <Divider orientation="vertical" />

          <AdditionalDetails device={device} />
        </Flex>
      </Box>
    </Box>
  );
};

export default UserProfile;
