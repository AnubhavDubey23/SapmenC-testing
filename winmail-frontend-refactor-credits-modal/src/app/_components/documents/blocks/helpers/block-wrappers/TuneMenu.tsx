import React from 'react';
import { TEditorBlock } from '../../../editor/core';
import { ColumnsContainerProps } from '../../ColumnsContainer/ColumnsContainerPropsSchema';
import { FiArrowDown, FiArrowUp, FiDelete, FiTrash2 } from 'react-icons/fi';
import { Box, IconButton, Stack, Tooltip } from '@chakra-ui/react';
import {
  resetDocument,
  setSelectedBlockId,
  useDocument,
} from '../../../editor/EditorContext';

const sx = {
  position: 'absolute',
  top: 0,
  left: -25,
  borderRadius: 64,
  paddingX: 0.5,
  paddingY: 1,
  zIndex: 12,
  backgroundColor: 'white',
  boxShadow:
    '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
};

type Props = {
  blockId: string;
};
export default function TuneMenu({ blockId }: Props) {
  const document = useDocument();

  const handleDeleteClick = () => {
    const filterChildrenIds = (childrenIds: string[] | null | undefined) => {
      if (!childrenIds) {
        return childrenIds;
      }
      return childrenIds.filter((f) => f !== blockId);
    };
    const nDocument: typeof document = { ...document };
    for (const [id, b] of Object.entries(nDocument)) {
      const block = b as TEditorBlock;
      if (id === blockId) {
        continue;
      }
      switch (block.type) {
      case 'EmailLayout':
        nDocument[id] = {
          ...block,
          data: {
            ...block.data,
            childrenIds: filterChildrenIds(block.data.childrenIds),
          },
        };
        break;
      case 'Container':
        nDocument[id] = {
          ...block,
          data: {
            ...block.data,
            props: {
              ...block.data.props,
              childrenIds: filterChildrenIds(block.data.props?.childrenIds),
            },
          },
        };
        break;
      case 'ColumnsContainer':
        nDocument[id] = {
          type: 'ColumnsContainer',
          data: {
            style: block.data.style,
            props: {
              ...block.data.props,
              columns: block.data.props?.columns?.map((c) => ({
                childrenIds: filterChildrenIds(c.childrenIds),
              })),
            },
          } as ColumnsContainerProps,
        };
        break;
      default:
        nDocument[id] = block;
      }
    }
    delete nDocument[blockId];
    resetDocument(nDocument);
  };

  const handleMoveClick = (direction: 'up' | 'down') => {
    const moveChildrenIds = (ids: string[] | null | undefined) => {
      if (!ids) {
        return ids;
      }
      const index = ids.indexOf(blockId);
      if (index < 0) {
        return ids;
      }
      const childrenIds = [...ids];
      if (direction === 'up' && index > 0) {
        [childrenIds[index], childrenIds[index - 1]] = [
          childrenIds[index - 1],
          childrenIds[index],
        ];
      } else if (direction === 'down' && index < childrenIds.length - 1) {
        [childrenIds[index], childrenIds[index + 1]] = [
          childrenIds[index + 1],
          childrenIds[index],
        ];
      }
      return childrenIds;
    };
    const nDocument: typeof document = { ...document };
    for (const [id, b] of Object.entries(nDocument)) {
      const block = b as TEditorBlock;
      if (id === blockId) {
        continue;
      }
      switch (block.type) {
      case 'EmailLayout':
        nDocument[id] = {
          ...block,
          data: {
            ...block.data,
            childrenIds: moveChildrenIds(block.data.childrenIds),
          },
        };
        break;
      case 'Container':
        nDocument[id] = {
          ...block,
          data: {
            ...block.data,
            props: {
              ...block.data.props,
              childrenIds: moveChildrenIds(block.data.props?.childrenIds),
            },
          },
        };
        break;
      case 'ColumnsContainer':
        nDocument[id] = {
          type: 'ColumnsContainer',
          data: {
            style: block.data.style,
            props: {
              ...block.data.props,
              columns: block.data.props?.columns?.map((c) => ({
                childrenIds: moveChildrenIds(c.childrenIds),
              })),
            },
          } as ColumnsContainerProps,
        };
        break;
      default:
        nDocument[id] = block;
      }
    }

    resetDocument(nDocument);
    setSelectedBlockId(blockId);
  };

  return (
    <Box sx={sx} onClick={(ev: React.MouseEvent) => ev.stopPropagation()}>
      {' '}
      <Stack spacing={1}>
        <Tooltip label="Move up" placement="left">
          <IconButton
            aria-label="Move up"
            icon={<FiArrowUp />}
            size="sm"
            onClick={() => handleMoveClick('up')}
            variant="ghost"
          />
        </Tooltip>
        <Tooltip label="Move down" placement="left">
          <IconButton
            aria-label="Move down"
            icon={<FiArrowDown />}
            size="sm"
            onClick={() => handleMoveClick('down')}
            variant="ghost"
          />
        </Tooltip>
        <Tooltip label="Delete" placement="left">
          <IconButton
            aria-label="Delete"
            icon={<FiTrash2 />}
            size="sm"
            onClick={handleDeleteClick}
            variant="ghost"
          />
        </Tooltip>
      </Stack>
    </Box>
  );
}
