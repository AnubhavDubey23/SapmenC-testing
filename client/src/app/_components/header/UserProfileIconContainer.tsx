'use client';

import React, { useState, useMemo, useCallback } from 'react';
import {
  HStack,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Avatar,
  Box,
  Divider,
  Text,
  Image,
} from '@chakra-ui/react';
import GlobalModalWrapper from '../modals/GlobalModalWrapper';
import NodemailerConfigForm from '../client-nodemailer-config/NodemailerConfigForm';
import LogoutModal from '../auth/LogoutModal';
import SubscriptionModal from './SubscriptionModal';
import LanguageSwitcher from '../language/LanguageSwitcher';
import { IoLanguage } from 'react-icons/io5';
import { IconType } from 'react-icons';
import { FaUser } from 'react-icons/fa';
import useProfilePicture from '@/hooks/user/useProfilePicture';
import { MyProfile } from '../users/MyProfile';

interface HeaderItem {
  id: string;
  name: string;
  segment: string;
  iconPath: string | IconType;
  modalChildren: (onClose: () => void, onOpen?: () => void) => React.ReactNode;
  modalSize: string;
}

const UserProfileIconContainer: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<HeaderItem | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { profilePicture, updateProfilePicture } = useProfilePicture();

  const handleCloseModal = () => {
    onClose();
    setSelectedItem(null);
  };

  const modalContent = useMemo(() => {
    if (!selectedItem) return null;
    return (
      <GlobalModalWrapper
        title={selectedItem.segment}
        isOpen={isOpen}
        onClose={handleCloseModal}
        size={selectedItem.modalSize}
      >
        {selectedItem.modalChildren(handleCloseModal)}
      </GlobalModalWrapper>
    );
  }, [selectedItem, isOpen]);

  const handleSetProfilePicture = useCallback(
    async (newProfilePicture: string) => {
      await updateProfilePicture(newProfilePicture);
    },
    [updateProfilePicture]
  );

  const HEADER_ITEMS: HeaderItem[] = useMemo(
    () => [
      {
        id: 'Profile',
        name: 'Profile',
        segment: 'My Profile',
        iconPath: '/Profile.svg',
        modalChildren: (onClose) => (
          <MyProfile
            key={profilePicture}
            onClose={onClose}
            setProfilePicture={handleSetProfilePicture}
            profilePicture={profilePicture}
            onOpenPaymentModal={onClose}
          />
        ),
        modalSize: '3xl',
      },
      {
        id: 'Settings',
        name: 'Settings',
        segment: 'Mail Settings',
        iconPath: '/Settings.svg',
        modalChildren: () => <NodemailerConfigForm onClose={onClose} />,
        modalSize: '5xl',
      },
      {
        id: 'Language',
        name: 'Language',
        segment: 'Language',
        iconPath: IoLanguage,
        modalChildren: () => <LanguageSwitcher />,
        modalSize: 'md',
      },
      {
        id: 'Subscription',
        name: 'Subscription',
        segment: 'Subscription',
        iconPath: '/Subscriptions.svg',
        modalChildren: (onClose) => <SubscriptionModal onClose={onClose} />,
        modalSize: '2xl',
      },
      {
        id: 'Logout',
        name: 'Logout',
        segment: 'Logout',
        iconPath: '/logout.svg',
        modalChildren: (onClose) => <LogoutModal onClose={onClose} />,
        modalSize: 'md',
      },
    ],
    [handleSetProfilePicture, profilePicture]
  );

  const handleItemClick = (item: HeaderItem) => {
    setSelectedItem(item);
    onOpen();
  };

  const renderMenuItem = (item: HeaderItem, index: number) => (
    <Box key={item.id}>
      <MenuItem
        borderRadius="xl"
        icon={
          typeof item.iconPath === 'string' ? (
            <Image
              src={item.iconPath}
              alt={`${item.name} icon`}
              width="18px"
              height="19px"
            />
          ) : (
            <Box as={item.iconPath as IconType} />
          )
        }
        onClick={() => handleItemClick(item)}
        py={1}
      >
        <Text color="#6C6C6C">{item.segment}</Text>
      </MenuItem>
      {index === HEADER_ITEMS.length - 2 && <Divider my={2} />}
    </Box>
  );

  return (
    <>
      {modalContent}
      <HStack spacing={4}>
        <Menu offset={[-100, 8]}>
          <MenuButton
            as={Button}
            pr={4}
            bg="transparent"
            _hover={{ bg: 'transparent' }}
            _active={{ bg: 'transparent' }}
          >
            {profilePicture ? (
              <Avatar size="md" src={profilePicture} />
            ) : (
              <FaUser />
            )}
          </MenuButton>
          <MenuList
            boxShadow="0px 0px 20px rgba(0, 0, 0, 0.25)"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="3xl"
          >
            {HEADER_ITEMS.map(renderMenuItem)}
          </MenuList>
        </Menu>
      </HStack>
    </>
  );
};

export default UserProfileIconContainer;
