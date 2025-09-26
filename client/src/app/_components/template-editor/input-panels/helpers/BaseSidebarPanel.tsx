import { Box, Stack, Text, Flex } from '@chakra-ui/react';
import React from 'react';

type SidebarPanelProps = {
  title: string;
  children: React.ReactNode;
};
export default function BaseSidebarPanel({
  title,
  children,
}: SidebarPanelProps) {
  return (
    <Box px={2}>
      <Text color="text.dark" fontSize="xl">
        {title}
      </Text>
      <Stack spacing={5} mt={3} mb={8}>
        <Flex
          flexDirection="column"
          gap={8}
          alignItems={'start'}
          justifyContent={'center'}
        >
          {children}
        </Flex>
      </Stack>
    </Box>
  );
}
