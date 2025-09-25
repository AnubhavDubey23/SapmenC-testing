import React, { useState } from 'react';

import RawSliderInput from './raw/RawSliderInput';
import { Stack, Text } from '@chakra-ui/react';

type SliderInputProps = {
  segment: string;
  iconsegment: JSX.Element;

  step?: number;
  marks?: boolean;
  units: string;
  min?: number;
  max?: number;

  defaultValue: number;
  onChange: (v: number) => void;
};

export default function SliderInput({
  segment,
  defaultValue,
  onChange,
  ...props
}: SliderInputProps) {
  const [value, setValue] = useState(defaultValue);
  return (
    <Stack spacing={1} alignItems="flex-start" width="80%">
      <Text color={'text.dark'} fontSize={'sm'} fontWeight={'bold'} mb={2}>
        {segment}
      </Text>
      <RawSliderInput
        value={value}
        setValue={(value: number) => {
          setValue(value);
          onChange(value);
        }}
        {...props}
      />
    </Stack>
  );
}
