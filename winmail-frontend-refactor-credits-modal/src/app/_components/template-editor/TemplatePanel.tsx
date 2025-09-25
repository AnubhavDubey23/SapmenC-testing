'use client';
import React from 'react';
import {
  useDocument,
  useSelectedMainTab,
  useSelectedScreenSize,
} from '../documents/editor/EditorContext';
import { Box, useDisclosure } from '@chakra-ui/react';
import EditorBlock from '../documents/editor/EditorBlock';
import { Reader } from '@usewaypoint/email-builder';
import HtmlPanel from './panels/HtmlPanel';
import JsonPanel from './panels/JsonPanel';
import MailSenderForm from '../mail/MailSenderForm';
import EditorTopbar from './editor-topbar/EditorTopbar';
import GlobalModalWrapper from '../modals/GlobalModalWrapper';

const TemplatePanel = () => {
  const { isOpen: isOpenModal, onClose: onCloseModal } = useDisclosure();

  const document = useDocument();

  const selectedMainTab = useSelectedMainTab();
  const selectedScreenSize = useSelectedScreenSize();

  const renderMainPanel = () => {
    switch (selectedMainTab) {
    case 'editor':
      return (
        <Box sx={mainBoxSx}>
          <EditorBlock key={'root'} id="root" />
        </Box>
      );
    case 'preview':
      return (
        <Box sx={mainBoxSx}>
          <Reader document={document} rootBlockId="root" />
        </Box>
      );
    case 'html':
      return <HtmlPanel />;
    case 'json':
      return <JsonPanel />;
    }
  };

  let mainBoxSx: {
    [key: string]: string | number;
  } = {
    height: '100%',
  };

  if (selectedScreenSize === 'mobile') {
    mainBoxSx = {
      ...mainBoxSx,
      margin: '32px auto',
      width: 370,
      height: 800,
      boxShadow:
        'rgba(33, 36, 67, 0.04) 0px 10px 20px, rgba(33, 34, 67, 0.04) 0px 2px 6px, rgba(33, 36, 67, 0.04) 0px 0px 1px',
    };
  }

  return (
    <>
      <GlobalModalWrapper
        title={'Send Mail'}
        isOpen={isOpenModal}
        onClose={() => onCloseModal()}
      >
        <MailSenderForm source="template" onClose={onCloseModal} />
      </GlobalModalWrapper>
      <Box h="92vh" overflowY={'auto'}>
        <EditorTopbar />
        <Box pb={'5'}>{renderMainPanel()}</Box>
      </Box>
    </>
  );
};

export default TemplatePanel;
