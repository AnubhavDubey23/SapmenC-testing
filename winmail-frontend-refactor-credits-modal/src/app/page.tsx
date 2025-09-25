'use client';
import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';
import MainContent from './_components/main-content/MainContent';
import { useAppSelector } from '@/store';
import i18n from './i18n';

export default function Home() {
  const languageState = useAppSelector((state) => state.language);
  useEffect(() => {
    i18n.changeLanguage(languageState.language);
  }, [languageState.language]);
  
  return (
    <Box
      position={'fixed'}
      left={0}
      h="92vh"
      w="100%"
      bg={'content.bg'}
      as="div"
    >
      <MainContent />
    </Box>
  );
}
