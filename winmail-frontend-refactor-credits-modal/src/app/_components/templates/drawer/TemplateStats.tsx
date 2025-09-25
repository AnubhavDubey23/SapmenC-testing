import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import TableStats from './TableStats';
import PieChartStats from './PieChartStats';
import { ISelectedTemplateState } from '@/store/features/selected-template/selected-template-slice';

type TemplateStatsProps = {
  template: Partial<ISelectedTemplateState>;
};

export default function TemplateStats({ template }: TemplateStatsProps) {
  const [tab, setTab] = useState(0);

  const handleTabChange = (index: number) => {
    setTab(index);
  };

  return (
    <Box w={'88%'}>
      <Text my={2} fontSize="lg" fontWeight="bold" color="#6D66C8">
        Stats:
      </Text>
      <Tabs index={tab} onChange={handleTabChange} isLazy isFitted>
        <TabList>
          <Tab>{'Table'}</Tab>
          <Tab>{'Pie'}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <TableStats template={template} />
          </TabPanel>
          <TabPanel>
            <PieChartStats template={template} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
