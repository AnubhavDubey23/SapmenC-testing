import { Box, Button } from '@chakra-ui/react';
import React from 'react';

type Props = {
  paletteColors: string[];
  value: string;
  onChange: (value: string) => void;
};

export default function Swatch({ paletteColors, value, onChange }: Props) {
  const renderButton = (colorValue: string) => {
    return (
      <Button
        key={colorValue}
        onClick={() => onChange(colorValue)}
        bgColor={colorValue}
        borderColor={value === colorValue ? 'black' : 'grey.200'}
        borderWidth={1}
        display="inline-flex"
        _hover={{
          transform: 'scale(1.1)',
        }}
      />
    );
  };
  return (
    <Box
      width="100%"
      sx={{
        display: 'grid',
        gap: 1,
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
      }}
    >
      {paletteColors.map((c) => renderButton(c))}
    </Box>
  );
}
