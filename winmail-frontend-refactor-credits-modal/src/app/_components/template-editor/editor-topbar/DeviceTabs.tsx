import { HStack, Tab, TabList, Tabs, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { MdMonitor, MdPhoneIphone } from 'react-icons/md';

const DEVICE_TABS_DATA = [
  {
    name: 'desktop',
    index: 0,
    segment: 'Desktop View',
    icon: <MdMonitor />,
  },
  {
    name: 'mobile',
    index: 1,
    segment: 'Mobile View',
    icon: <MdPhoneIphone />,
  },
];

interface DeviceTabsProps {
  selectedScreenSize: string;
  onDeviceSizeClick: (device: string) => void;
}

export default function DeviceTabs({
  selectedScreenSize,
  onDeviceSizeClick,
}: DeviceTabsProps) {
  return (
    <HStack spacing={4}>
      <Tabs index={selectedScreenSize === 'desktop' ? 0 : 1} isLazy>
        <TabList>
          {DEVICE_TABS_DATA.map((tab, idx) => (
            <Tooltip key={idx} label={tab.segment}>
              <Tab
                p={2}
                key={idx}
                value={tab.name}
                onClick={() => onDeviceSizeClick(tab.name)}
                cursor={'pointer'}
              >
                {tab.icon}
              </Tab>
            </Tooltip>
          ))}
        </TabList>
      </Tabs>
    </HStack>
  );
}
