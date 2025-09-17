import { Box, Input, ResponsiveValue, Text, Textarea } from '@chakra-ui/react';
import React, { useState } from 'react';

// import { InputProps, TextField } from '@mui/material';

type Props = {
  segment: string;
  rows?: number;
  placeholder?: string;
  helperText?: string | JSX.Element;
  InputProps?: any;
  defaultValue: string;
  onChange: (v: string) => void;
};

export default function TextInput({
  helperText,
  segment,
  placeholder,
  rows,
  InputProps,
  defaultValue,
  onChange,
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const isMultiline = typeof rows === 'number' && rows > 1;
  return (
    <Box>
      <Text color={'text.dark'} fontSize={'sm'} fontWeight={'bold'} mb={1}>
        {segment}
      </Text>
      <Textarea
        w="100%"
        rows={rows}
        variant={isMultiline ? 'outlined' : 'standard'}
        placeholder={placeholder}
        value={value}
        onChange={(ev) => {
          const v = ev.target.value;
          setValue(v);
          onChange(v);
        }}
        sx={{
          boxShadow: '0 0 0 1px #6D66C8',
          '&:focus': {
            borderColor: '#6D66C8',
            boxShadow: '0 0 0 2px #6D66C8',
          },
        }}
      />
    </Box>
  );
}
