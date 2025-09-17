import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { setActiveTabState } from '@/store/features/active-tab/active-tab-slice';

const useTabState = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const activeTabState = useAppSelector((state) => state.activeTab);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setSelectedTab(activeTabState.tabIndex);
  }, [activeTabState.tabIndex]);

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
    dispatch(setActiveTabState({ tabIndex: index }));
  };

  return { selectedTab, handleTabChange };
};

export default useTabState;
