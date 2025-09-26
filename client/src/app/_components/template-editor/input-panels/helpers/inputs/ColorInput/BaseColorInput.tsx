import { Button, Stack, Text } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';
import Picker from './Picker';
import OutsideClickHandler from 'react-outside-click-handler';
import { debounce } from '@/utils/debounce';

type Props =
  | {
      nullable: true;
      segment: string;
      onChange: (value: string | null) => void;
      defaultValue: string | null;
    }
  | {
      nullable: false;
      segment: string;
      onChange: (value: string) => void;
      defaultValue: string;
    };
export default function ColorInput({
  segment,
  defaultValue,
  onChange,
  nullable,
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const [showPicker, setShowPicker] = useState(false);

  const handleClickOpen = (event: any) => {
    event.stopPropagation();
    setShowPicker(true);
  };

  const renderResetButton = () => {
    if (!nullable) {
      return null;
    }
    if (typeof value !== 'string' || value.trim().length === 0) {
      return null;
    }
    return (
      <MdClose
        color="black"
        onClick={() => {
          setValue(null);
          onChange(null);
        }}
      />
    );
  };

  const renderOpenButton = () => {
    if (value) {
      return (
        <Button
          onClick={handleClickOpen}
          bgColor={value}
          border="1px solid #A9A9A9"
          width="32px"
          height="32px"
          borderRadius="4px"
        />
      );
    }
    return (
      <div
        style={{
          backgroundColor: '#6D66C8',
          borderRadius: '10%',
          width: '42px',
          height: '35px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        role="button"
        onClick={handleClickOpen}
      >
        <MdAdd color="white" />
      </div>
    );
  };

  const debouncedOnChange = useCallback(
    debounce((v) => {
      setValue(v);
      onChange(v);
    }, 250),
    [onChange, setValue]
  );

  return (
    <Stack alignItems="flex-start" gap={2}>
      <Text color={'text.dark'} fontSize={'sm'} fontWeight={'bold'}>
        {segment}
      </Text>
      <Stack direction="row" spacing={1}>
        {renderOpenButton()}
        {renderResetButton()}
      </Stack>

      {showPicker && (
        <OutsideClickHandler
          onOutsideClick={() => {
            setShowPicker(false);
          }}
        >
          <Picker value={value || ''} onChange={debouncedOnChange} />
        </OutsideClickHandler>
      )}
    </Stack>
  );
}
