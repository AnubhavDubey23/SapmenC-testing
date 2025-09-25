import { FONT_FAMILIES } from '@/app/_components/documents/blocks/helpers/fontFamily';
import { Select, Text } from '@chakra-ui/react';
import React, { useState } from 'react';

// import { MenuItem, TextField } from '@mui/material';

// import { FONT_FAMILIES } from '../../../../../../documents/blocks/helpers/fontFamily';

const OPTIONS = FONT_FAMILIES.map((option) => (
  <option key={option.key} value={option.key}>
    {option.segment}
  </option>
));

type NullableProps = {
  segment: string;
  onChange: (value: null | string) => void;
  defaultValue: null | string;
};
export function NullableFontFamily({
  segment,
  onChange,
  defaultValue,
}: NullableProps) {
  const [value, setValue] = useState(defaultValue ?? 'inherit');
  return (
    <>
      <Text color={'text.dark'} fontSize={'sm'} fontWeight={'bold'} mb={-4}>
        {segment}
      </Text>
      <Select
        // select
        // variant="standard"
        // segment={segment}
        value={value}
        onChange={(ev) => {
          const v = ev.target.value;
          setValue(v);
          onChange(v === null ? null : v);
        }}
      >
        {/* <MenuItem value="inherit">Match email settings</MenuItem> */}
        {OPTIONS}
      </Select>
    </>
  );
}
