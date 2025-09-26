import { useAppDispatch, useAppSelector } from '@/store';
import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {
  IActiveTabState,
  setActiveTabState,
} from '@/store/features/active-tab/active-tab-slice';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import { openTemplateEditor } from '@/store/features/template-editor/template-editor-slice';
import { useTranslation } from 'react-i18next';

const TABS_DATA = [
  {
    name: 'Templates',
    id: 'CreateTemplate',
  },
  {
    name: 'Segments',
    id: 'Createsegment',
  },
];

const TabsNavigator = () => {
  const dispatch = useAppDispatch();
  const [selectedTab, setSelectedTab] = useState(0);

  const activeTabState: IActiveTabState & PersistPartial = useAppSelector(
    (state) => state.activeTab
  );

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
    dispatch(
      setActiveTabState({
        tabIndex: index,
      })
    );
    if (index === 1) {
      dispatch(
        openTemplateEditor({
          isOpen: false,
          inspectorDrawerOpen: false,
        })
      );
    }
  };

  useEffect(() => {
    handleTabChange(activeTabState.tabIndex);
  }, [activeTabState.tabIndex]);

  const { t } = useTranslation();

  return (
    <Tabs
      w={'50%'}
      index={selectedTab}
      onChange={handleTabChange}
      isLazy
      isFitted
    >
      <TabList p={1} borderRadius="3xl">
        {TABS_DATA.map((tab, idx) => (
          <Tab
            border="0px"
            borderRadius="3xl"
            className={tab.id}
            w="85px"
            key={tab.id}
            fontWeight="bold"
            m={0}
          >
            {t(tab.name)}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
};

export default TabsNavigator;
