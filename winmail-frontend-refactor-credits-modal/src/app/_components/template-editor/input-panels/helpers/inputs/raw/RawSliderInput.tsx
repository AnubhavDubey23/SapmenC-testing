import { Box, Stack, Text, Flex } from '@chakra-ui/react';
import React from 'react';

import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';

type SliderInputProps = {
  iconsegment: JSX.Element;

  step?: number;
  marks?: boolean;
  units: string;
  min?: number;
  max?: number;

  value: number;
  setValue: (v: number) => void;
};

export default function RawSliderInput({
  iconsegment,
  value,
  setValue,
  units,
  ...props
}: SliderInputProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={2}
      justifyContent="space-between"
      width="100%"
    >
      <Box sx={{ minWidth: 8, lineHeight: 1, flexShrink: 0 }}>
        {iconsegment}
      </Box>
      <Slider
        value={value}
        onChange={(val: number) => {
          if (typeof val !== 'number') {
            throw new Error(
              'RawSliderInput values can only receive numeric values'
            );
          }
          setValue(val);
        }}
        aria-label="slider-ex-1"
        defaultValue={30}
      >
        <SliderTrack>
          <SliderFilledTrack bg={'purple.500'} />
        </SliderTrack>
        <SliderThumb bg={'purple.500'} />
      </Slider>
      <Box sx={{ minWidth: 12, textAlign: 'right', flexShrink: 0 }}>
        <Text color="text.dark" sx={{ lineHeight: 1 }}>
          {value}
          {units}
        </Text>
      </Box>
    </Stack>
  );
}
