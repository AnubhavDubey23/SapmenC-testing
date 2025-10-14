import { Box, Flex, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import MenuButton from '../menu/MenuButton';
import React from 'react';
import Templates from '../templates/Templates';
import SearchBar from '../search/SearchBar';
import Segments from '../segments/Segments';

type TabPanelContentProps = {
  selectedTab: number;
  handleTabChange: (index: number) => void;
};

export default function TabPanelContent(props: TabPanelContentProps) {
  const { selectedTab, handleTabChange } = props;

  return (
    <Box flex={0.25} h="92vh" boxShadow={'xl'}>
      <Tabs index={selectedTab} onChange={handleTabChange} isLazy>
        <TabPanels>
          <TabPanel p={2}>
            <Flex
              width={'100%'}
              direction={'column'}
              height={'100%'}
              position={'relative'}
              gap={2}
              h="85vh"
              p={0}
            >
              <SearchBar
                module="templates"
                placeholder="Search by template name"
              />
              <Templates />
              <MenuButton />
            </Flex>
          </TabPanel>
          <TabPanel p={2}>
            <Flex
              width={'100%'}
              direction={'column'}
              height={'100%'}
              position={'relative'}
              gap={2}
              h="85vh"
              p={0}
            >
              <SearchBar
                module="segments"
                placeholder="Search by segment name"
              />
              <Segments />
              <MenuButton />
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
