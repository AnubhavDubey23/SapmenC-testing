import { Box, IconButton } from '@chakra-ui/react';
import React, { useEffect, useState, useCallback } from 'react';
import { IoAddOutline } from 'react-icons/io5';

type Props = {
  buttonElement: HTMLElement | null;
  onClick: () => void;
};

export default function DividerButton({ buttonElement, onClick }: Props) {
  const [visible, setVisible] = useState(false);

  const handleMouseMove = useCallback(
    ({ clientX, clientY }: MouseEvent) => {
      if (!buttonElement) return;

      const rect = buttonElement.getBoundingClientRect();
      const isWithinYRange = Math.abs(clientY - rect.y) < 20;
      const isWithinXRange = rect.x < clientX && clientX < rect.x + rect.width;

      setVisible(isWithinYRange && isWithinXRange);
    },
    [buttonElement]
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <Box
      position="absolute"
      top="-12px"
      left="50%"
      transform="translateX(-10px)"
      zIndex={1}
      opacity={visible ? 1 : 0}
      transition="opacity 0.2s"
      pointerEvents={visible ? 'auto' : 'none'}
    >
      <IconButton
        size="xs"
        icon={<IoAddOutline size="sm" />}
        aria-label="Add divider"
        sx={{
          p: 0.12,
          bgColor: '#6D66C8',
          color: '#FFFFFF',
          '&:hover, &:active, &:focus': {
            bgColor: '#6D66C8',
            color: '#FFFFFF',
          },
        }}
        borderRadius="full"
        onClick={(ev) => {
          ev.stopPropagation();
          onClick();
        }}
      />
    </Box>
  );
}
