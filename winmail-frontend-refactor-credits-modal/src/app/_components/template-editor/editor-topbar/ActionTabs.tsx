import { Button, HStack, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { MdSave } from 'react-icons/md';
import DownloadJson from './DownloadJson';
import ImportJson from './ImportJson';

interface ActionTabsProps {
  isFreePlan: boolean;
  onOpenUpgradeModal: () => void;
  onSaveTemplate: () => void;
}

export default function ActionTabs({
  isFreePlan,
  onOpenUpgradeModal,
  onSaveTemplate,
}: ActionTabsProps) {
  return (
    <HStack spacing={4}>
      <DownloadJson
        isFreePlan={isFreePlan}
        onOpenUpgradeModal={onOpenUpgradeModal}
      />
      <ImportJson
        isFreePlan={isFreePlan}
        onOpenUpgradeModal={onOpenUpgradeModal}
      />
      <Tooltip label="Save Template">
        <Button onClick={onSaveTemplate} colorScheme="green">
          <MdSave color="white" />
        </Button>
      </Tooltip>
    </HStack>
  );
}
