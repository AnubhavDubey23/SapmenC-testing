import React, { useState } from 'react';
import { RadioGroup, Radio, Stack, Text } from '@chakra-ui/react';
import OptionSelectorInput from './OptionsSelectorInput';

type Props = {
  segment: string;
  defaultValue: string;
  onChange: (value: string) => void;
};

const WEIGHT_OPTIONS = [
  {
    value: 'normal',
    segment: 'Regular',
  },
  {
    value: 'bold',
    segment: 'Bold',
  },
];

export default function FontWeightInput({
  segment,
  defaultValue,
  onChange,
}: Props) {
  const [value, setValue] = useState(defaultValue);
  return (
    <>
      <Text color={'text.dark'} fontSize={'sm'} fontWeight={'bold'} mb={-4}>
        {segment}
      </Text>
      <OptionSelectorInput
        options={WEIGHT_OPTIONS}
        defaultValue={value}
        onChange={(fontWeight) => {
          setValue(fontWeight);
          onChange(fontWeight);
        }}
      />
    </>
  );
}
