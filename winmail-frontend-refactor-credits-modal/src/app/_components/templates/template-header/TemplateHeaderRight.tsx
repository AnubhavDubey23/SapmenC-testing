import { useAppDispatch, useAppSelector } from '@/store';
import { openTemplateEditor } from '@/store/features/template-editor/template-editor-slice';
import { Box, Button, Tag, Flex, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { HiChevronDoubleLeft } from 'react-icons/hi';
import MailSenderForm from '../../mail/MailSenderForm';
import GlobalModalWrapper from '../../modals/GlobalModalWrapper';
import TemplateDrawer from '../drawer/TemplateDrawer';
import { useTranslation } from '../../../../../node_modules/react-i18next';
import useGetTemplate from '@/hooks/template/useGetTemplate';
import { setActiveTemplateStats } from '@/store/features/selected-template/selected-template-slice';

const TemplateHeaderRight = () => {
  const { t } = useTranslation();
  const selectedTemplateState = useAppSelector(
    (state) => state.selectedTemplate
  );
  const dispatch = useAppDispatch();
  const { isOpen: isOpenModal, onClose: onCloseModal } = useDisclosure();
  const {
    isOpen: isOpenDrawer,
    onOpen: onOpenDrawer,
    onClose: onCloseDrawer,
  } = useDisclosure();

  const handleOpenTemplateEditor = (e: any) => {
    dispatch(
      openTemplateEditor({
        isOpen: true,
        inspectorDrawerOpen: true,
      })
    );
  };

  const handleOpen = async () => {
    const res = await getTemplate();
    if (res) {
      dispatch(setActiveTemplateStats(res.data.stats));
      onOpenDrawer();
    } else {
      console.error('error');
      return;
    }
  };
  const handleClose = () => {
    try {
      onCloseDrawer();
    } catch (err) {
      console.error('error', err);
    }
  };

  const { getTemplate } = useGetTemplate();

  return (
    <>
      <TemplateDrawer
        key={'drawer'}
        isOpen={isOpenDrawer}
        onClose={handleClose}
      />
      <GlobalModalWrapper
        title={'Send Mail'}
        isOpen={isOpenModal}
        onClose={() => {
          onCloseModal();
        }}
      >
        <MailSenderForm source="template" onClose={onCloseModal} />
      </GlobalModalWrapper>
      <Box
        onClick={handleOpen}
        fontSize={'28px'}
        cursor={'pointer'}
        color={'text.dark'}
      >
        <Flex alignItems="center" gap="25">
          {!selectedTemplateState.is_triggered && (
            <Button
              leftIcon={<FaPencilAlt />}
              onClick={handleOpenTemplateEditor}
              borderRadius="20px"
              p="5"
              bgGradient="linear(to-r, #6D66C8, #221E5A)"
              color="white"
              fontSize="16px"
              fontWeight="bold"
              _hover={{
                bgGradient: 'linear(to-r, #5D56B8, #121040)',
              }}
            >
              {t('Edit')}
            </Button>
          )}
          {selectedTemplateState.is_triggered ? (
            <Tag color={'text.dark'}>{t('Triggered')}</Tag>
          ) : null}
          <HiChevronDoubleLeft />
        </Flex>
      </Box>
    </>
  );
};

export default TemplateHeaderRight;
