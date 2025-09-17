import React, { CSSProperties, useState } from 'react';
import { useCurrentBlockId } from '../../../editor/EditorBlock';
import {
  setSelectedBlockId,
  useSelectedBlockId,
} from '../../../editor/EditorContext';

import TuneMenu from './TuneMenu';
import { Box } from '@chakra-ui/react';

type TEditorBlockWrapperProps = {
  children: JSX.Element;
};

export default function EditorBlockWrapper({
  children,
}: TEditorBlockWrapperProps) {
  const selectedBlockId = useSelectedBlockId();
  const [mouseInside, setMouseInside] = useState(false);
  const blockId = useCurrentBlockId();

  let outline: CSSProperties['outline'];
  if (selectedBlockId === blockId) {
    outline = '2px solid #6D66C8';
  } else if (mouseInside) {
    outline = '2px solid #C4C3FB';
  }

  const renderMenu = () => {
    if (selectedBlockId !== blockId) {
      return null;
    }
    return <TuneMenu blockId={blockId} />;
  };

  return (
    <Box
      sx={{
        position: 'relative',
        maxWidth: '100%',
        outlineOffset: '-1px',
      }}
      outline={outline}
      onMouseEnter={(ev) => {
        setMouseInside(true);
        ev.stopPropagation();
      }}
      onMouseLeave={() => {
        setMouseInside(false);
      }}
      onClick={(ev) => {
        setSelectedBlockId(blockId);
        ev.stopPropagation();
        ev.preventDefault();
      }}
    >
      {renderMenu()}
      {children}
    </Box>
  );
}
