import { IconButton, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { IoAddOutline } from 'react-icons/io5';

type Props = {
  onClick: () => void;
};
export default function PlaceholderButton({ onClick }: Props) {
  return (
    <Tooltip label="Add block">
      <IconButton
        aria-label="Add block"
        onClick={(ev: any) => {
          ev.stopPropagation();
          onClick();
        }}
      >
        <IoAddOutline />
      </IconButton>
    </Tooltip>
  );
}
