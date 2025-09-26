'use client';
import React from 'react';
import { Flex } from '@chakra-ui/react';
import { useHydrated } from 'react-hydration-provider';
import ActionBar from './ActionBar';

type Props = {};

function Header({}: Props) {
  const isHydrated = useHydrated();
  if (!isHydrated) return null;
  return (
    <Flex w={'100vw'} h="8vh" alignItems={'center'} justifyContent={'center'}>
      <ActionBar />
    </Flex>
  );
}

export default Header;
