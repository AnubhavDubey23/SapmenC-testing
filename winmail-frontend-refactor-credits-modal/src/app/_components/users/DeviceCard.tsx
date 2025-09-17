import React from 'react';
import { Text, VStack, Card, CardBody } from '@chakra-ui/react';
import dayjs from 'dayjs';

interface DeviceCardProps {
  browserType: string;
  lastLogin: Date;
  browser: string;
  operatingSystem: string;
  deviceType: string;
}

export function DeviceCard({
  browserType,
  lastLogin,
  browser,
  operatingSystem,
  deviceType,
}: DeviceCardProps) {
  return (
    <Card>
      <CardBody>
        <VStack spacing={2} align="start">
          <Text fontSize="sm">
            <b>Browser Type:</b> {browserType}
          </Text>
          <Text fontSize="sm">
            <b>Last Login:</b> {dayjs(lastLogin).format('MMMM D, YYYY HH:mm')}
          </Text>
          <Text fontSize="sm">
            <b>Browser:</b> {browser}
          </Text>
          <Text fontSize="sm">
            <b>Operating System:</b> {operatingSystem}
          </Text>
          <Text fontSize="sm">
            <b>Device:</b> {deviceType}
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
}
