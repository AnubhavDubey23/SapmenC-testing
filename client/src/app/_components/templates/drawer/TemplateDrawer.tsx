import React from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useAppSelector } from '@/store';
import TemplateStats from './TemplateStats';
import TemplateInfo from './TemplateInfo';
import NotTriggered from './NotTriggered';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const TemplateDrawer = ({ isOpen, onClose }: Props) => {
  const selectedTemplateState = useAppSelector(
    (state) => state.selectedTemplate
  );

  return (
    <Drawer
      size={'sm'}
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      closeOnOverlayClick={true}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          <Text
            fontSize="2xl"
            textAlign={'center'}
            fontWeight="bold"
            color="#6D66C8"
          >
            {selectedTemplateState.name}
          </Text>
        </DrawerHeader>

        <DrawerBody>
          {!selectedTemplateState.is_triggered && <NotTriggered />}

          {selectedTemplateState.is_triggered && (
            <VStack spacing={4}>
              <TemplateInfo template={selectedTemplateState} />
              <TemplateStats template={selectedTemplateState} />
            </VStack>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default TemplateDrawer;
