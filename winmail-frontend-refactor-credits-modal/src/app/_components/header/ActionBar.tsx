import { Divider, HStack, Center, Flex } from '@chakra-ui/react';
import React from 'react';
import LogoContainer from './LogoContainer';
import UserProfileIconContainer from './UserProfileIconContainer';
import TabsNavigator from './TabsNavigator';

const ActionBar = () => {
  return (
    <HStack
      zIndex={100}
      bg="text.white"
      w={['90%', '80%', '70%']}
      justify={'space-between'}
      align={'center'}
      padding={2}
      borderRadius={'24px'}
      boxShadow={'0px 4px 30px 0px rgba(0, 0, 0, 0.2)'}
    >
      <Flex>
        <LogoContainer />
        <Center height="50px">
          <Divider
            orientation="vertical"
            borderWidth="1"
            borderColor="gray.500"
          />
        </Center>
      </Flex>
      <TabsNavigator />
      <UserProfileIconContainer />
    </HStack>
  );
};

export default ActionBar;
