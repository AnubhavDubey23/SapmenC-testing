import React from 'react';
import { Flex, HStack, Text, useDisclosure } from '@chakra-ui/react';
import { useAppSelector } from '@/store';
import SegmentDrawer from '../LabelDrawer';
import { useTranslation } from 'react-i18next';

const SegmentHeaderLeft = () => {
  const selectedsegment = useAppSelector((state) => state.selectedsegment);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpenUserProfileDrawer = () => {
    onOpen();
  };
  const handleCloseUserProfileDrawer = () => {
    onClose();
  };
  const { t } = useTranslation();

  return (
    <>
      <SegmentDrawer
        key={selectedsegment.name}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={handleCloseUserProfileDrawer}
      />
      <Flex gap={'5'} alignItems={'center'}>
        <HStack cursor={'pointer'} onClick={handleOpenUserProfileDrawer}>
          <Text color={'text.dark'}>{t('Segment')}:</Text>
          <Text color={'text.light'}>{selectedsegment.name}</Text>
        </HStack>
      </Flex>
    </>
  );
};

export default SegmentHeaderLeft;
