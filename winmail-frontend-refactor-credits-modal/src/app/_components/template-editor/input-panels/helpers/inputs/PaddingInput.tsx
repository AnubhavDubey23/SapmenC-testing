import React, { useState } from 'react';

// import {
//   AlignHorizontalLeftOutlined,
//   AlignHorizontalRightOutlined,
//   AlignVerticalBottomOutlined,
//   AlignVerticalTopOutlined,
// } from '@mui/icons-material';
// import { Inputsegment, Stack } from '@mui/material';

import RawSliderInput from './raw/RawSliderInput';
import { Stack, Text } from '@chakra-ui/react';
import {
  MdAlignHorizontalLeft,
  MdAlignHorizontalRight,
  MdAlignVerticalBottom,
  MdAlignVerticalTop,
} from 'react-icons/md';

type TPaddingValue = {
  top: number;
  bottom: number;
  right: number;
  left: number;
};
type Props = {
  segment: string;
  defaultValue: TPaddingValue | null;
  onChange: (value: TPaddingValue) => void;
};
export default function PaddingInput({
  segment,
  defaultValue,
  onChange,
}: Props) {
  const [value, setValue] = useState(() => {
    if (defaultValue) {
      return defaultValue;
    }
    return {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    };
  });

  function handleChange(internalName: keyof TPaddingValue, nValue: number) {
    const v = {
      ...value,
      [internalName]: nValue,
    };
    setValue(v);
    onChange(v);
  }

  return (
    <Stack spacing={8} alignItems="flex-start" pb={1} width="80%">
      <Text color={'text.dark'} fontSize={'sm'} fontWeight={'bold'} mb={-4}>
        {segment}
      </Text>

      <RawSliderInput
        iconsegment={<MdAlignVerticalTop />}
        value={value.top}
        setValue={(num) => handleChange('top', num)}
        units="px"
        step={4}
        min={0}
        max={80}
        marks
      />

      <RawSliderInput
        iconsegment={<MdAlignVerticalBottom />}
        value={value.bottom}
        setValue={(num) => handleChange('bottom', num)}
        units="px"
        step={4}
        min={0}
        max={80}
        marks
      />

      <RawSliderInput
        iconsegment={<MdAlignHorizontalLeft />}
        value={value.left}
        setValue={(num) => handleChange('left', num)}
        units="px"
        step={4}
        min={0}
        max={80}
        marks
      />

      <RawSliderInput
        iconsegment={<MdAlignHorizontalRight />}
        value={value.right}
        setValue={(num) => handleChange('right', num)}
        units="px"
        step={4}
        min={0}
        max={80}
        marks
      />
    </Stack>
  );
}
