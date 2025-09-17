import React from 'react';
import { Tooltip, Box, IconButton } from '@chakra-ui/react';
import { MdFileDownload } from 'react-icons/md';
import { useDocument } from '../../documents/editor/EditorContext';

interface DownloadJsonProps {
  isFreePlan: boolean;
  onOpenUpgradeModal: () => void;
}

export default function DownloadJson({
  isFreePlan,
  onOpenUpgradeModal,
}: DownloadJsonProps) {
  const doc = useDocument();

  const handleDownload = () => {
    if (isFreePlan) {
      onOpenUpgradeModal();
      return;
    }

    const jsonString = JSON.stringify(doc, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'emailTemplate.json';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Tooltip label={'Download JSON file'}>
      <Box as="span">
        <IconButton
          onClick={handleDownload}
          aria-label="Download JSON"
          icon={<MdFileDownload />}
          variant="ghost"
        />
      </Box>
    </Tooltip>
  );
}
