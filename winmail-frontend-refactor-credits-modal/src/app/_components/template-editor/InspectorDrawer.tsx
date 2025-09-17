import { Stack } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import ConfigurationPanel from './inspector-drawer/ConfigurationPanel';
import StylesPanel from './inspector-drawer/StylesPanel';
import EmailDetailsPanel from './EmailDetailsPanel';
import {
  setSidebarTab,
  setSidebarTabIdx,
  sidebarTabMappingItoA,
  TSidebarTab,
  TSelectedSidebarTabIdx,
  useSelectedSidebarTabIdx,
} from '../documents/editor/EditorContext';

const InspectorDrawer = () => {
  const selectedSidebarTabIdx = useSelectedSidebarTabIdx();

  const handleTabChange = (index: number) => {
    const idx = index as TSelectedSidebarTabIdx;
    setSidebarTab(sidebarTabMappingItoA[idx] as TSidebarTab);
    setSidebarTabIdx(idx);
  };

  const TABS_DATA = [
    {
      name: 'Styles',
      component: <StylesPanel />,
    },
    {
      name: 'Inspect',
      component: <ConfigurationPanel />,
    },
    {
      name: 'Details',
      component: <EmailDetailsPanel />,
    },
  ];

  return (
    <Stack flex={0.25} h="92vh" overflowY={'auto'}>
      <Tabs
        index={selectedSidebarTabIdx}
        onChange={handleTabChange}
        isLazy
        isFitted
      >
        <TabList p={1}>
          {TABS_DATA.map((tab, idx) => (
            <Tab key={idx}>{tab.name}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {TABS_DATA.map((tab, idx) => (
            <TabPanel key={idx}>{tab.component}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Stack>
  );
};

export default InspectorDrawer;
