import { Box, Input, Text } from '@chakra-ui/react';
import React from 'react';

type TextDimensionInputProps = {
  segment: string;
  defaultValue: number | null | undefined | any;
  onChange: (v: number | null) => void;
};
export default function TextDimensionInput({
  segment,
  defaultValue,
  onChange,
}: TextDimensionInputProps) {
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (ev) => {
    const value = parseInt(ev.target.value);
    onChange(isNaN(value) ? null : value);
  };
  return (
    <Box>
      <Text>{segment}</Text>
      <Input
        type="number"
        placeholder="auto"
        onChange={handleChange}
        defaultValue={defaultValue}
      />
    </Box>
  );
}
