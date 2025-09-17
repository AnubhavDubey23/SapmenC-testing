import React from 'react';
import { TEditorBlock } from '../../../../editor/core';
import BlockButton from './BlockButton';
import { BUTTONS } from './buttons';
import { Box, Menu, MenuButton, MenuList, Text, Flex } from '@chakra-ui/react';

type BlocksMenuProps = {
  anchorEl: HTMLElement | null;
  setAnchorEl: (v: HTMLElement | null) => void;
  onSelect: (block: TEditorBlock) => void;
};

export default function BlocksMenu({
  anchorEl,
  setAnchorEl,
  onSelect,
}: BlocksMenuProps) {
  const onClose = () => {
    setAnchorEl(null);
  };

  const onClick = (block: TEditorBlock) => {
    onSelect(block);
    setAnchorEl(null);
  };

  if (anchorEl === null) {
    return null;
  }

  return (
    <Menu isOpen={true} onClose={onClose} offset={[150, 25]}>
      <MenuButton as={Box} />
      <MenuList zIndex={2}>
        <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={6} p={2}>
          {BUTTONS.map((k, i) => (
            <Flex
              direction="column"
              justifyContent="center"
              alignItems="center"
              key={i}
            >
              <BlockButton
                segment={k.segment}
                icon={k.icon}
                onClick={() => onClick(k.block())}
              />
              <Text as="p" fontSize="xs">
                {k.segment}
              </Text>
            </Flex>
          ))}
        </Box>
      </MenuList>
    </Menu>
  );
}
