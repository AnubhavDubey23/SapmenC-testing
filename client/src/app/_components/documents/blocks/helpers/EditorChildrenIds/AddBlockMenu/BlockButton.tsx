import { Box, Button, Text, Tooltip } from '@chakra-ui/react';
import React from 'react';

type BlockMenuButtonProps = {
  segment: string;
  icon: React.ReactNode;
  onClick: () => void;
};

export default function BlockButton({
  segment,
  icon,
  onClick,
}: BlockMenuButtonProps) {
  return (
    <Tooltip label={segment}>
      <Button display="flex" flexDirection="column" p={2} onClick={onClick}>
        <Box w="100%" display="flex" justifyContent="center">
          {icon}
        </Box>
      </Button>
    </Tooltip>
  );
}
