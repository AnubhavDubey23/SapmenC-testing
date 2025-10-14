import React, { useState } from 'react';
import { Radio, RadioGroup, Stack, Text } from '@chakra-ui/react';
import {
  MdFormatAlignCenter,
  MdFormatAlignLeft,
  MdFormatAlignRight,
} from 'react-icons/md';
import OptionSelectorInput from './OptionsSelectorInput';

type Props = {
  segment: string;
  defaultValue: string | null;
  onChange: (value: string | null) => void;
};

const ALIGN_OPTIONS = [
  { value: 'left', segment: <MdFormatAlignLeft fontSize="medium" /> },
  { value: 'center', segment: <MdFormatAlignCenter fontSize="medium" /> },
  { value: 'right', segment: <MdFormatAlignRight fontSize="medium" /> },
];

export default function TextAlignInput({
  segment,
  defaultValue,
  onChange,
}: Props) {
  const [value, setValue] = useState(defaultValue ?? 'left');

  return (
    <>
      <Text color={'text.dark'} fontSize={'sm'} fontWeight={'bold'} mb={-4}>
        {segment}
      </Text>
      <OptionSelectorInput
        options={ALIGN_OPTIONS}
        defaultValue={value}
        onChange={(value) => {
          setValue(value);
          onChange(value);
        }}
      />
    </>
  );
}
