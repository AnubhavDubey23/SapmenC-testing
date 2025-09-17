import {
  Box,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { CgImport } from 'react-icons/cg';
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi';
import GlobalModalWrapper from '../../modals/GlobalModalWrapper';
import FileImporter from '../../importers/FileImporter';
import { MdAdd, MdDelete, MdSend } from 'react-icons/md';
import CreateContactForm from '../../contact/CreateContactForm';
import DeletesegmentModal from '../DeleteSegmentModal';
import MailSenderForm from '../../mail/MailSenderForm';
import RemoveAllModal from '../RemoveAllModal';
import { IoIosRemoveCircle } from 'react-icons/io';
import { LoadingModal } from '../../modals/LoadingModal';
import ContactImporter from '../../importers/ContactImporter';

const SegmentHeaderRight = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = useState<boolean>(false);
  const [modal_children, set_modal_children] = useState<React.ReactNode>(
    <FileImporter onClose={onClose} setLoading={setLoading} />
  );
  const [modal_title, set_modal_title] = useState('Import Contacts');

  const handleOpenImportContactsModal = () => {
    set_modal_title('Import Contacts');
    set_modal_children(
      // <FileImporter onClose={onClose} setLoading={setLoading} />
      <ContactImporter onClose={onClose} setLoading={setLoading} />
    );
    onOpen();
  };

  const handleOpenAddContactModal = () => {
    set_modal_title('Add Contact');
    set_modal_children(<CreateContactForm onClose={onClose} />);
    onOpen();
  };

  const handleOpenSendMailModal = () => {
    set_modal_title('Send Mail');
    set_modal_children(<MailSenderForm source="segment" onClose={onClose} />);
    onOpen();
  };

  const handleOpenDeletesegmentModal = () => {
    set_modal_title('Delete Segment');
    set_modal_children(<DeletesegmentModal onClose={onClose} />);
    onOpen();
  };

  const handleRemoveAllRecipientsModal = () => {
    set_modal_title('Remove All Recipients');
    set_modal_children(<RemoveAllModal onClose={onClose} />);
    onOpen();
  };

  const MENU_ITEMS = [
    {
      segment: 'Add Contact',
      icon: <MdAdd />,
      onclick: handleOpenAddContactModal,
    },
    {
      segment: 'Send Mail',
      icon: <MdSend />,
      onclick: handleOpenSendMailModal,
    },
    {
      segment: 'Delete Segment',
      icon: <MdDelete />,
      onclick: handleOpenDeletesegmentModal,
    },
    {
      segment: 'Remove All Recipients',
      icon: <IoIosRemoveCircle />,
      onclick: handleRemoveAllRecipientsModal,
    },
  ];

  if (loading) {
    return <LoadingModal isOpen={loading} onClose={() => setLoading(false)} />;
  }

  return (
    <>
      <GlobalModalWrapper
        title={modal_title}
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
        size="4xl"
      >
        {modal_children}
      </GlobalModalWrapper>
      <Flex alignItems={'center'} gap={4}>
        <Box>
          <Button
            leftIcon={<CgImport />}
            onClick={handleOpenImportContactsModal}
            colorScheme="green"
          >
            {'Import'}
          </Button>
        </Box>
        <Box cursor={'pointer'} color={'text.dark'}>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<PiDotsThreeOutlineVerticalFill />}
              variant="outline"
            ></MenuButton>
            <MenuList zIndex={9999}>
              {MENU_ITEMS.map((item, idx) => {
                return (
                  <MenuItem onClick={item.onclick} key={idx} icon={item.icon}>
                    {item.segment}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
        </Box>
      </Flex>
    </>
  );
};

export default SegmentHeaderRight;
