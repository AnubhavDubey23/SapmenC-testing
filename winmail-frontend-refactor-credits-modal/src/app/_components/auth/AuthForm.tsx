"use client";
import React from 'react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Flex,
  useMediaQuery,
} from '@chakra-ui/react';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';
import styles from './styles.module.css';
// import Lottie from 'lottie-react';
import animationData from '../../../../public/login.json';
import LogoContainer from './VerticalLogoContainer';
import SapmenC from '../../../../public/SapmenC.png';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import dynamic from "next/dynamic";

const AuthForm = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 769px)');
  const { t } = useTranslation();
  const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

  const TABS_DATA = [
    {
      title: t('Login'),
    },
    {
      title: t('Signup'),
    },
  ];

  return (
    <Box className={styles.main}>
      <Flex
        className={styles.container}
        flexDirection={isLargerThan768 ? 'row' : 'column'}
        position="relative"
      >
        <Box
          className={`${styles.lottieContainer} ${!isLargerThan768 ? styles.lottieContainerMobile : ''}`}
        >
          <Lottie animationData={animationData} loop={true} />
        </Box>
        <Flex flexDirection="column" flex={1} position="relative">
          <Box className={styles.formContainer} flex={1}>
            <Tabs isFitted colorScheme="purple">
              <TabList mb="4em" p={1} borderRadius="3xl">
                {TABS_DATA.map((tab, index) => (
                  <Tab key={index} borderRadius="3xl" mb={0}>
                    {tab.title}
                  </Tab>
                ))}
              </TabList>
              <div className={styles.center_logo}>
                <LogoContainer />
              </div>
              <TabPanels>
                <TabPanel>
                  <SignInForm />
                </TabPanel>
                <TabPanel>
                  <SignUpForm />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
          <Box
            className={styles.logoContainer}
            alignSelf={isLargerThan768 ? 'flex-end' : 'center'}
            mt={isLargerThan768 ? 0 : 4}
            mb={isLargerThan768 ? 4 : 0}
            mr={isLargerThan768 ? 4 : 0}
          >
            <Link href="https://sapmenc.com/" target="_blank">
              <Image
                src={SapmenC}
                alt="SapmenC Logo"
                width={isLargerThan768 ? 100 : 80}
                height={isLargerThan768 ? 100 : 80}
              />
            </Link>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default AuthForm;
