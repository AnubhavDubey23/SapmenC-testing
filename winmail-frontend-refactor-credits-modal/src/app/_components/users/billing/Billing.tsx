import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { FeaturePlans } from './feature-plans/FeaturePlans';
import { Credits } from './credits/Credits';
import useTransactions from '@/hooks/transactions/useTransactions';

interface BillingProps {
  onModeChange?: (mode: 'plans' | 'credits') => void;
}

export function Billing({ onModeChange }: BillingProps) {
  const { transactions, loading } = useTransactions();
  const [mode, setMode] = useState<'plans' | 'credits'>('plans');

  return (
    <Box>
      <Tabs
        isFitted
        onChange={(index) => {
          const newMode = index === 0 ? 'plans' : 'credits';
          setMode(newMode);
          onModeChange?.(newMode);
        }}
      >
        <TabList
          display="flex"
          justifyContent="center"
          maxWidth="300px"
          width="100%"
          mx="auto"
          bg="#F8F8F8"
          borderRadius="md"
        >
          <Tab
            _selected={{ color: 'black', bg: 'gray.300' }}
            color="black"
            _focus={{ boxShadow: 'none' }}
          >
            Feature Plans
          </Tab>
          <Tab
            _selected={{ color: 'black', bg: 'gray.300' }}
            color="black"
            _focus={{ boxShadow: 'none' }}
          >
            Credits
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel padding="0px" paddingTop={4}>
            <FeaturePlans data={transactions} loading={loading} />
          </TabPanel>
          <TabPanel padding="0px" paddingTop={4}>
            <Credits data={transactions} loading={loading} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
