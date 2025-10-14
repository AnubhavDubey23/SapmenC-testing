import { Tab, TabList, Tabs, Tooltip } from '@chakra-ui/react';
import React from 'react';
import { MdCode, MdDataObject, MdEdit, MdPreview } from 'react-icons/md';

const TABS_DATA = [
  {
    name: 'Editor',
    index: 0,
    segment: 'Edit',
    icon: <MdEdit />,
  },
  {
    name: 'Preview',
    index: 1,
    segment: 'Preview',
    icon: <MdPreview />,
  },
  {
    name: 'HTML',
    index: 2,
    segment: 'HTML',
    icon: <MdCode />,
  },
  {
    name: 'JSON',
    index: 3,
    segment: 'JSON',
    icon: <MdDataObject />,
  },
];

interface MainTabsProps {
  selectedMainTab: 'html' | 'editor' | 'preview' | 'json';
  onTabChange: (idx: number) => void;
}

export default function MainTabs({
  selectedMainTab,
  onTabChange,
}: MainTabsProps) {
  return (
    <Tabs
      index={
        selectedMainTab === 'editor'
          ? 0
          : selectedMainTab === 'preview'
            ? 1
            : selectedMainTab === 'html'
              ? 2
              : selectedMainTab === 'json'
                ? 3
                : 0
      }
      onChange={onTabChange}
      isLazy
    >
      <TabList>
        {TABS_DATA.map((tab, idx) => (
          <Tooltip key={idx} label={tab.name}>
            <Tab p={2} key={idx} value={tab.index}>
              {tab.icon}
            </Tab>
          </Tooltip>
        ))}
      </TabList>
    </Tabs>
  );
}
