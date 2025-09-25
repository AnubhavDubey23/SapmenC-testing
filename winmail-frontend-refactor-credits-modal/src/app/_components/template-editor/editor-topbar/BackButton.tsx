import { Button, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { FaChevronLeft } from 'react-icons/fa';

interface BackButtonProps {
  onClick: () => void;
}

const BackButton = ({ onClick }: BackButtonProps) => {
  return (
    <Tooltip title="Back">
      <Button color={'text.dark'} onClick={() => onClick()}>
        <FaChevronLeft />
      </Button>
    </Tooltip>
  );
};

export default BackButton;
