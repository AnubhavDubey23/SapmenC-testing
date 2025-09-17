import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { planColorMap, planFeaturesMap } from '@/utils/plan-features';
import Script from 'next/script';
import { CALENDLY_URL } from '@/lib/calendly';

interface EnterprisePlanProps {
  maxPoints: number;
}

export function EnterprisePlan({ maxPoints }: EnterprisePlanProps) {
  let planFeatures = planFeaturesMap.get('enterprise') as string[];
  const headerColor = planColorMap.get('enterprise') as string;
  const headerBgColor = useColorModeValue(headerColor, `${headerColor}90`);
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const gradientFrom = useColorModeValue('black', 'white');
  const gradientTo = useColorModeValue('#999999', '#666666');

  useEffect(() => {
    const head = document.querySelector('head');
    const script = document.createElement('script');
    script.setAttribute(
      'src',
      'https://assets.calendly.com/assets/external/widget.js'
    );
    head?.appendChild(script);
  }, []);

  const openCalendly = () => {
    // @ts-ignore
    window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    return false;
  };

  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        type="text/javascript"
        async
      />
      <link
        href="https://assets.calendly.com/assets/external/widget.css"
        rel="stylesheet"
      />

      <Box
        rounded="xl"
        boxShadow="2xl"
        display="flex"
        flexDirection="column"
        width="full"
        maxWidth="md"
        gridColumn={{ md: 'span 2', lg: 'span 1' }}
      >
        <Box
          rounded="xl"
          roundedBottom="3xl"
          px={4}
          pt={6}
          pb={4}
          bg={headerBgColor}
        >
          <Heading
            as="h1"
            fontSize={{ base: '3xl', sm: '4xl' }}
            bgGradient={`linear(to-b, ${gradientFrom}, ${gradientTo})`}
            bgClip="text"
            fontWeight="bold"
          >
            Enterprise
          </Heading>
          <Heading
            as="h2"
            fontSize={{ base: 'xl', sm: '2xl' }}
            color={textColor}
            fontWeight="bold"
            pt={2}
          >
            Let&apos;s talk
          </Heading>
          <Text fontSize={{ base: 'sm', sm: 'md' }} color={textColor} mt={4}>
            This payment is for the Enterprise plan in MailerOne, a product by
            SapMen C. Pvt. Ltd.
          </Text>
        </Box>
        <Flex
          flexGrow={1}
          flexDirection="column"
          justifyContent="space-between"
        >
          <VStack align="start" spacing={{ base: 3, sm: 4 }} p={4}>
            {[...Array(maxPoints)].map((_, index) => (
              <Flex
                key={index}
                align="center"
                justify="start"
                gap={{ base: 3, sm: 4 }}
                height="6"
              >
                {planFeatures[index] ? (
                  <>
                    <Image
                      width={24}
                      height={24}
                      src="/green-check.svg"
                      alt="Check"
                    />
                    <Text fontSize={{ base: 'sm', sm: 'md' }} color={textColor}>
                      {planFeatures[index]}
                    </Text>
                  </>
                ) : (
                  <Box visibility="hidden"></Box>
                )}
              </Flex>
            ))}
          </VStack>
          <Box mt={4}>
            <Button
              onClick={() => openCalendly()}
              width="full"
              fontWeight="bold"
              fontSize={{ base: 'lg', sm: 'xl' }}
              color="white"
              bgGradient="linear(to-r, #6D66C8, #353262)"
              rounded="lg"
              py={{ base: 3, sm: 6 }}
              _hover={{
                bgGradient: 'linear(to-r, #5D56B8, #252152)',
              }}
            >
              {'Let\'s Talk!'}
            </Button>
          </Box>
        </Flex>
      </Box>
    </>
  );
}
