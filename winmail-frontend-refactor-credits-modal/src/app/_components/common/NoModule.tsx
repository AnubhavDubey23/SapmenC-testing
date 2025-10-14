import { Button, Image, Text, useDisclosure, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import GlobalModalWrapper from '../modals/GlobalModalWrapper';
import CreateTemplateForm from '../templates/CreateTemplateForm';
import CreatesegmentForm from '../segments/CreateSegmentForm';

type Props = {
  title: string;
  image_src: any;
  module: string;
  btn_text: string;
  btn_icon: any;
};

const NoModule = ({ btn_text, image_src, module, title, btn_icon }: Props) => {
  const [modal_children, set_modal_children] = useState<React.ReactNode>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    if (module === 'template') {
      set_modal_children(<CreateTemplateForm onClose={onClose} />);
    }
    if (module === 'segment') {
      set_modal_children(<CreatesegmentForm onClose={onClose} />);
    }
  }, [module, onClose]);
  const handleOpenModal = () => {
    onOpen();
  };
  return (
    <>
      <GlobalModalWrapper
        isOpen={isOpen}
        onClose={onClose}
        title={
          module == 'template'
            ? 'Create your first template'
            : 'Create your first segment'
        }
        key={'Create Template Modal'}
      >
        {modal_children}
      </GlobalModalWrapper>
      <VStack h="80vh" justify={'center'}>
        <Image src={image_src} alt="" width={220} height={220} />
        <Text>{title}</Text>
        <Button
          leftIcon={btn_icon}
          bgColor="#6D66C8"
          color="white"
          onClick={handleOpenModal}
          borderRadius="xl"
          px="10"
          fontWeight="bold"
        >
          {btn_text}
        </Button>
      </VStack>
    </>
  );
};

export default NoModule;
