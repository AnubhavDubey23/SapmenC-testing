'use client';

import ReduxProvider from '@/store/redux-provider';
import { ChakraProvider } from '@chakra-ui/react';
import { PaymentProvider } from '@/contexts/PaymentContext';
import { HydrationProvider } from 'react-hydration-provider';
import { extendTheme } from '@chakra-ui/react';
import { I18nextProvider } from '../../node_modules/react-i18next';
import { tabsAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import i18n from './i18n';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

const baseStyle = definePartsStyle({
  tab: {
    borderRadius: 'md',
    backgroundColor: 'primary.light',
    _selected: {
      color: 'text.white',
      backgroundColor: 'primary.light',
      border: 'none',
    },
  },
  tablist: {
    borderRadius: 'md',
    color: 'text.white',
    backgroundColor: 'primary.dark',
    _hover: {
      color: 'primary.light',
    },
  },
});

const tabsTheme = defineMultiStyleConfig({ baseStyle });

export function Providers({ children }: { children: React.ReactNode }) {
  const theme = extendTheme({
    colors: {
      sidebar: {
        bg: '#e5f5e4',
        active: '#C4C3FB',
      },
      header: {
        bg: '#ffffff',
        active: '#232b23',
      },
      text: {
        light: '#6C6C6C',
        dark: '#6D66C8',
        white: '#ffffff',
      },
      content: {
        bg: '#fcfcfc',
      },
      primary: {
        light: '#C4C3FB',
        dark: '#6D66C8',
      },
    },
    components: {
      Tabs: tabsTheme,
    },
    border: {
      primary: '#A9A9A9',
    },
  });
  return (
    <HydrationProvider>
      <ReduxProvider>
        <ChakraProvider theme={theme}>
          <PaymentProvider>
            <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
          </PaymentProvider>
        </ChakraProvider>
      </ReduxProvider>
    </HydrationProvider>
  );
}
