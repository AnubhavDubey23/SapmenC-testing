import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import AvatarSidebarPanel from '../input-panels/AvatarSidebarPanel';
import ButtonSidebarPanel from '../input-panels/ButtonSidebarPanel';
import ContainerSidebarPanel from '../input-panels/ContainerSidebarPanel';
import DividerSidebarPanel from '../input-panels/DividerSidebarPanel';
import HeadingSidebarPanel from '../input-panels/HeadingSidebarPanel';
import HtmlSidebarPanel from '../input-panels/HtmlSidebarPanel';
import ImageSidebarPanel from '../input-panels/ImageSidebarPanel';
import SpacerSidebarPanel from '../input-panels/SpacerSidebarPanel';
import TextSidebarPanel from '../input-panels/TextSidebarPanel';
import EmailLayoutSidebarPanel from '../input-panels/EmailLayoutSidebarPanel';
import ColumnsContainerSidebarPanel from '../input-panels/ColumnsContainerSidebarPanel';
import {
  setDocument,
  useDocument,
  useSelectedBlockId,
} from '../../documents/editor/EditorContext';

import { TEditorBlock } from '../../documents/editor/core';
import useUpdateTemplate from '@/hooks/template/useUpdateTemplate';

function renderMessage(val: string) {
  return (
    <Box border={'1px dashed'} borderColor={'#A9A9A9'} p={2}>
      <Text color="text.dark">{val}</Text>
    </Box>
  );
}

export default function ConfigurationPanel() {
  const document = useDocument();
  const selectedBlockId = useSelectedBlockId();

  if (!selectedBlockId) {
    return renderMessage('Click on a block to inspect.');
  }
  const block = document[selectedBlockId];
  if (!block) {
    return renderMessage(
      `Block with id ${selectedBlockId} was not found. Click on a block to reset.`
    );
  }

  const setBlock = (conf: TEditorBlock) => {
    setDocument({ [selectedBlockId]: conf });
  };

  const { data, type } = block;

  switch (type) {
    case 'Avatar':
      return (
        <AvatarSidebarPanel
          key={selectedBlockId}
          data={data}
          setData={(data) => setBlock({ type, data })}
        />
      );
    case 'Button':
      return (
        <ButtonSidebarPanel
          key={selectedBlockId}
          data={data}
          setData={(data) => setBlock({ type, data })}
        />
      );
    case 'ColumnsContainer':
      return (
        <ColumnsContainerSidebarPanel
          key={selectedBlockId}
          data={data}
          setData={(data) => setBlock({ type, data })}
        />
      );
    case 'Container':
      return (
        <ContainerSidebarPanel
          key={selectedBlockId}
          data={data}
          setData={(data) => setBlock({ type, data })}
        />
      );
    case 'Divider':
      return (
        <DividerSidebarPanel
          key={selectedBlockId}
          data={data}
          setData={(data) => setBlock({ type, data })}
        />
      );
    case 'Heading':
      return (
        <HeadingSidebarPanel
          key={selectedBlockId}
          data={data}
          setData={(data) => setBlock({ type, data })}
        />
      );
    case 'Html':
      return (
        <HtmlSidebarPanel
          key={selectedBlockId}
          data={data}
          setData={(data) => setBlock({ type, data })}
        />
      );
    case 'Image':
      return (
        <ImageSidebarPanel
          key={selectedBlockId}
          data={data}
          setData={(data) => setBlock({ type, data })}
        />
      );
    case 'EmailLayout':
      return (
        <EmailLayoutSidebarPanel
          key={selectedBlockId}
          data={data}
          setData={(data) => setBlock({ type, data })}
        />
      );
    case 'Spacer':
      return (
        <SpacerSidebarPanel
          key={selectedBlockId}
          data={data}
          setData={(data) => setBlock({ type, data })}
        />
      );
    case 'Text':
      return (
        <TextSidebarPanel
          key={selectedBlockId}
          data={data}
          setData={(data) => setBlock({ type, data })}
        />
      );
    default:
      return <pre>{JSON.stringify(block, null, '  ')}</pre>;
  }
}
