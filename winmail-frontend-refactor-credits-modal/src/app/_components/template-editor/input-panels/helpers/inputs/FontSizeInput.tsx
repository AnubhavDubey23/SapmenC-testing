import React, { useState } from 'react';
// import { Inputsegment, Stack } from '@mui/material';

import RawSliderInput from './raw/RawSliderInput';
import { MdTextFields } from 'react-icons/md';
import { Stack, Text } from '@chakra-ui/react';
import SliderInput from './SliderInput';

type Props = {
  segment: string;
  defaultValue: number;
  onChange: (v: number) => void;
};
export default function FontSizeInput({
  segment,
  defaultValue,
  onChange,
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const handleChange = (value: number) => {
    setValue(value);
    onChange(value);
  };
  return (
    <Stack spacing={1} alignItems="flex-start" w={'100%'}>
      <SliderInput
        segment={segment}
        iconsegment={<MdTextFields />}
        defaultValue={value}
        onChange={handleChange}
        units="px"
        step={1}
        min={10}
        max={48}
      />
    </Stack>
  );
}
