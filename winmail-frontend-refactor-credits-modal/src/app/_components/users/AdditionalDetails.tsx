import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import React from 'react';
import { DeviceCard } from './DeviceCard';
import { TAuthUserDevice } from '@/types/user.types';

interface AdditionalDetailsProps {
  device: TAuthUserDevice[] | null;
}

export function AdditionalDetails({ device }: AdditionalDetailsProps) {
  return (
    <Box flex="1" border="1px" borderColor="#C1C1C1" p={4} rounded="lg" width="100%" borderRadius="20px"  height="100%" maxHeight="625px" display="flex" flexDirection="column">
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Additional Details
      </Text>
      <Box
        overflowY="auto"
        pr={2}
        flex="1"
        sx={{
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <SimpleGrid columns={1} spacing={4}>
          {device &&
            device.map((d, idx) => (
              <DeviceCard
                key={idx}
                browserType={d.details.client.type}
                lastLogin={d.lastLogin}
                browser={d.details.client.name}
                operatingSystem={d.details.os.name}
                deviceType={d.details.device.type}
              />
            ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
