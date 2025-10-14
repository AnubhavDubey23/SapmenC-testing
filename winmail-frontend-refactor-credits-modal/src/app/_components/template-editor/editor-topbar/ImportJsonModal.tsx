import {
  Alert,
  Button,
  HStack,
  Link,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { resetDocument } from '../../documents/editor/EditorContext';
import validateTextAreaValue from './validateJsonStringValue';
import { MdFileUpload } from 'react-icons/md';

type ImportJsonDialogProps = {
  onClose: () => void;
};
export default function ImportJsonModal({ onClose }: ImportJsonDialogProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (ev) => {
    const v = ev.currentTarget.value;
    setValue(v);
    const { error } = validateTextAreaValue(v);
    setError(error ?? null);
  };

  let errorAlert = null;
  if (error) {
    errorAlert = <Alert>{error}</Alert>;
  }

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        const { error, data } = validateTextAreaValue(value);
        setError(error ?? null);
        if (!data) {
          return;
        }
        resetDocument(data);
        onClose();
      }}
    >
      <VStack spacing={4} align="stretch">
        <Text color="text.dark">Copy and paste JSON code</Text>

        {error && <Alert status="error">{error}</Alert>}

        <Textarea
          bg="#F3F5F7"
          border="1px"
          borderColor="#D6D6D6"
          value={value}
          onChange={handleChange}
          variant="outlined"
          rows={10}
        />

        <HStack justify={'center'}>
          <Button
            type="submit"
            disabled={error !== null}
            colorScheme="green"
            width="100%"
          >
            <MdFileUpload style={{ marginRight: '5px' }} />
            Import
          </Button>
        </HStack>
      </VStack>
    </form>
  );
}
