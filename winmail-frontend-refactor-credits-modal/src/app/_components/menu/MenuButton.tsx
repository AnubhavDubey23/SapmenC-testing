import { Box, Tooltip, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { MdNewLabel } from 'react-icons/md';
import { ImInsertTemplate } from 'react-icons/im';
import OutsideClickHandler from 'react-outside-click-handler';
import GlobalModalWrapper from '../modals/GlobalModalWrapper';
import CreatesegmentForm from '../segments/CreateSegmentForm';
import CreateContactForm from '../contact/CreateContactForm';
import CreateTemplateForm from '../templates/CreateTemplateForm';

const MenuButton = () => {
  const [modal_children, set_modal_children] = useState<React.ReactNode>(null);
  const [title, setTitle] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleOpenModal = (module: string) => {
    try {
      if (module === 'segment') {
        setTitle('New Segment');
        set_modal_children(<CreatesegmentForm onClose={onClose} />);
        onOpen();
      }
      if (module === 'contact') {
        setTitle('Create Contact');
        set_modal_children(<CreateContactForm onClose={onClose} />);
        onOpen();
      }
      if (module === 'template') {
        setTitle('New Email Template');
        set_modal_children(<CreateTemplateForm onClose={onClose} />);
        onOpen();
      }
    } catch (err: any) {
      console.error('Error in handleOpenModal', err);
    }
  };
  return (
    <>
      <GlobalModalWrapper isOpen={isOpen} onClose={onClose} title={title}>
        {modal_children}
      </GlobalModalWrapper>
      <OutsideClickHandler
        onOutsideClick={() => {
          // const el = document.getElementById('button-menu-id')
          // if (el) {
          //     el.click();
          // }
        }}
      >
        <Box
          cursor={'pointer'}
          position={'absolute'}
          bottom={0}
          right={0}
          bgColor={'primary.dark'}
          color={'text.white'}
          w="50px"
          h="50px"
          borderRadius="50%"
          boxShadow="2xl"
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          zIndex={1200}
        >
          <FaPlus className="button-menu" />
          <input id="button-menu-id" className="checkbox" type="checkbox" />
          <Tooltip label="New Segment">
            <button
              onClick={() => {
                handleOpenModal('segment');
              }}
              className="option-a option"
            >
              <MdNewLabel />
            </button>
          </Tooltip>
          <Tooltip label="Create Template">
            <button
              onClick={() => {
                handleOpenModal('template');
              }}
              className="option-b option"
            >
              <ImInsertTemplate />
            </button>
          </Tooltip>
          {/* <Tooltip label="Create Contact">
            <button
              onClick={() => {
                handleOpenModal("contact");
              }}
              className="option-c option"
            >
              <MdContactMail />
            </button>
          </Tooltip> */}
        </Box>
      </OutsideClickHandler>
    </>
  );
};

export default MenuButton;
