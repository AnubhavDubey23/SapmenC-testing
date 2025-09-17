'use client';
import { Box, Flex } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useHydrated } from 'react-hydration-provider';
import SelectedTemplate from '../templates/SelectedTemplate';
import Selectedsegment from '../segments/Selectedsegment';
import { useAppDispatch, useAppSelector } from '@/store';
import { setProductTour } from '@/store/features/product-tour/product-tour-slice';
import TemplateEditorApp from '../template-editor/TemplateEditorApp';
import useTemplates from '@/hooks/template/useTemplates';
import usesegments from '@/hooks/segment/usesegments';
import NoModule from '../common/NoModule';
import { MdAdd } from 'react-icons/md';
import CreateTemplateImage from '@/assets/images/create-template.svg';
import CreatesegmentImage from '@/assets/images/create-segment.svg';
import useUpdateUser from '@/hooks/user/useUpdateUser';
import TabPanelContent from '../tab-panel/TabPanelContent';
import useTabState from '@/hooks/useTabState';
import ProductTour from '../tour/ProductTour';

const MainContent = () => {
  const { selectedTab, handleTabChange } = useTabState();
  const authState = useAppSelector((state) => state.auth);
  const productTourState = useAppSelector((state) => state.productTour);
  const templateEditorState = useAppSelector((state) => state.templateEditor);
  const dispatch = useAppDispatch();

  const { templates: allTemplates } = useTemplates();
  const { segments } = usesegments();
  const { updateUser } = useUpdateUser();

  const templates = allTemplates.filter((template) => template.is_active);

  useEffect(() => {}, [authState.authState]);

  const isHydrated = useHydrated();

  if (!isHydrated) {
    return null;
  }

  const handleRequestClose = async () => {
    dispatch(
      setProductTour({
        isOpen: false,
      })
    );
    await updateUser({ is_product_tour_seen: true });
  };

  const renderContent = () => {
    if (templateEditorState.isOpen) {
      return <TemplateEditorApp />;
    }

    if (selectedTab === 0 && templates.length === 0) {
      return (
        <NoModule
          image_src={CreateTemplateImage.src}
          btn_text="Create Template"
          btn_icon={<MdAdd />}
          module="template"
          title="No Templates created yet!"
          key={'Create Template'}
        />
      );
    }

    if (selectedTab === 1 && segments.length === 0) {
      return (
        <NoModule
          image_src={CreatesegmentImage.src}
          btn_text="Create Segment"
          btn_icon={<MdAdd />}
          module="segment"
          title="No Segments created yet!"
          key={'Create Segment'}
        />
      );
    }

    if (segments.length > 0 || templates.length > 0) {
      return (
        <>
          <TabPanelContent
            selectedTab={selectedTab}
            handleTabChange={handleTabChange}
          />
          <Box flex={0.75} h={'92vh'} py={2} pr={2} zIndex={10}>
            {selectedTab === 0 ? <SelectedTemplate /> : <Selectedsegment />}
          </Box>
        </>
      );
    }

    return null;
  };

  return (
    <>
      <ProductTour
        isOpen={productTourState.isOpen}
        onRequestClose={handleRequestClose}
      />
      <Flex
        alignItems={'center'}
        justifyContent={'center'}
        gap={0}
        w={'100%'}
        h="100%"
      >
        {renderContent()}
      </Flex>
    </>
  );
};

export default MainContent;
