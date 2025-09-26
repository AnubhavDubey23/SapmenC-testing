import React from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import Swatch from './Swatch';
import { Box, Stack } from '@chakra-ui/react';

const DEFAULT_PRESET_COLORS = [
  '#E11D48',
  '#DB2777',
  '#C026D3',
  '#9333EA',
  '#7C3AED',
  '#4F46E5',
  '#2563EB',
  '#0284C7',
  '#0891B2',
  '#0D9488',
  '#059669',
  '#16A34A',
  '#65A30D',
  '#CA8A04',
  '#D97706',
  '#EA580C',
  '#DC2626',
  '#FFFFFF',
  '#FAFAFA',
  '#F5F5F5',
  '#E5E5E5',
  '#D4D4D4',
  '#A3A3A3',
  '#737373',
  '#525252',
  '#404040',
  '#262626',
  '#171717',
  '#0A0A0A',
  '#000000',
];

type Props = {
  value: string;
  onChange: (v: string) => void;
};
function Picker({ value, onChange }: Props) {
  const handleOnChange = (color: string) => {
    onChange(color);
  };

  return (
    <Stack spacing={5} zIndex={999} position="relative">
      <HexColorPicker
        style={{ width: 'auto' }}
        color={value}
        onChange={handleOnChange}
      />
      <Swatch
        paletteColors={DEFAULT_PRESET_COLORS}
        value={value}
        onChange={handleOnChange}
      />
      <Box pt={1}>
        <HexColorInput prefixed color={value} onChange={handleOnChange} />
      </Box>
    </Stack>
  );
}

export default Picker;
