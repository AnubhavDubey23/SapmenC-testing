import { HStack, Stack, useDisclosure } from '@chakra-ui/react';
import { openTemplateEditor } from '@/store/features/template-editor/template-editor-slice';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import {
  setSelectedMainTab,
  setSelectedScreenSize,
  useSelectedMainTab,
  useSelectedScreenSize,
  useDocument,
} from '../../documents/editor/EditorContext';
import useUpdateTemplate from '@/hooks/template/useUpdateTemplate';
import { UpgradePlanModal } from '../../header/UpgradePlanModal';
import useUserPlanDetails from '@/hooks/user/useUserPlanDetails';
import Loader from '../../loaders/Loader';
import BackButton from './BackButton';
import MainTabs from './MainTabs';
import DeviceTabs from './DeviceTabs';
import ActionTabs from './ActionTabs';
import {
  ISelectedTemplateState,
  setActiveTemplate,
} from '@/store/features/selected-template/selected-template-slice';

export default function EditorTopbar() {
  const dispatch = useAppDispatch();
  const document = useDocument();

  const {
    isOpen: isUpgradeModalOpen,
    onOpen: onOpenUpgradeModal,
    onClose: onCloseUpgradeModal,
  } = useDisclosure();

  const selectedTemplate = useAppSelector((state) => state.selectedTemplate);

  const {
    loading: subscriptionLoading,
    subscription,
    getUserPlanDetails,
  } = useUserPlanDetails();

  const isFreePlan = subscription?.name === 'free';

  const selectedMainTab = useSelectedMainTab();
  const selectedScreenSize = useSelectedScreenSize();

  const { loading, updateTemplate } = useUpdateTemplate();

  const handleScreenSizeChange = (value: unknown) => {
    if (isFreePlan) {
      onOpenUpgradeModal();
      return;
    }
    switch (value) {
    case 'mobile':
    case 'desktop':
      setSelectedScreenSize(value);
      return;
    default:
      setSelectedScreenSize('desktop');
    }
  };
  const handleMainTabChange = (idx: number) => {
    if (isFreePlan && (idx === 2 || idx === 3)) {
      onOpenUpgradeModal();
      return;
    }
    switch (idx) {
    case 0:
      return setSelectedMainTab('editor');
    case 1:
      return setSelectedMainTab('preview');
    case 2:
      return setSelectedMainTab('html');
    case 3:
      return setSelectedMainTab('json');
    }
  };

  const handleSaveTemplate = async () => {
    try {
      const body = {
        email_data: document,
      };

      const activeTemplate = {
        ...selectedTemplate,
        email_data: document,
      } as ISelectedTemplateState;

      const res = await updateTemplate(body);

      if (!res) {
        // Add toast here
        return;
      }

      dispatch(setActiveTemplate(activeTemplate));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUserPlanDetails();
  }, []);

  if (subscriptionLoading) {
    return <Loader />;
  }

  return (
    <>
      <UpgradePlanModal
        isOpen={isUpgradeModalOpen}
        handleClose={onCloseUpgradeModal}
        handleClick={() => {}}
        currentPlan={subscription?.name || 'free'}
      />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack
          px={2}
          py={1}
          direction="row"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          <HStack spacing={2}>
            <BackButton
              onClick={() =>
                dispatch(
                  openTemplateEditor({
                    isOpen: false,
                    inspectorDrawerOpen: false,
                  })
                )
              }
            />
            <MainTabs
              selectedMainTab={selectedMainTab}
              onTabChange={handleMainTabChange}
            />
          </HStack>

          <DeviceTabs
            selectedScreenSize={selectedScreenSize}
            onDeviceSizeClick={handleScreenSizeChange}
          />

          <ActionTabs
            isFreePlan={isFreePlan}
            onOpenUpgradeModal={onOpenUpgradeModal}
            onSaveTemplate={handleSaveTemplate}
          />
        </Stack>
      </Stack>
    </>
  );
}
