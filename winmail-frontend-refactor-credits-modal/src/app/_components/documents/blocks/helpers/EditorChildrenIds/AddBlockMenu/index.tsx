import React, { useState } from 'react';

import { TEditorBlock } from '../../../../editor/core';

import BlocksMenu from './BlocksMenu';
import DividerButton from './DividerButton';
import PlaceholderButton from './PlaceholderButton';
import { Box } from '@chakra-ui/react';

type Props = {
  placeholder?: boolean;
  onSelect: (block: TEditorBlock) => void;
};
export default function AddBlockButton({ onSelect, placeholder }: Props) {
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [buttonElement, setButtonElement] = useState<HTMLElement | null>(null);

  const handleButtonClick = () => {
    setMenuAnchorEl(buttonElement);
  };

  const renderButton = () => {
    if (placeholder) {
      return <PlaceholderButton onClick={handleButtonClick} />;
    } else {
      return (
        <DividerButton
          buttonElement={buttonElement}
          onClick={handleButtonClick}
        />
      );
    }
  };

  return (
    <>
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        ref={setButtonElement}
        style={{ position: 'relative' }}
      >
        {renderButton()}
      </Box>
      <BlocksMenu
        anchorEl={menuAnchorEl}
        setAnchorEl={setMenuAnchorEl}
        onSelect={onSelect}
      />
    </>
  );
}
