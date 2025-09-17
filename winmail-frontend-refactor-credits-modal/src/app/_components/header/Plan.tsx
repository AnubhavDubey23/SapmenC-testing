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
import React from 'react';
import { planColorMap, planFeaturesMap } from '@/utils/plan-features';

interface PlanProps {
  plan: any;
  index: number;
  maxPoints: number;
  handleClick: (planId: string) => void;
  showButton?: boolean;
}

export function Plan({
  plan,
  index,
  maxPoints,
  handleClick,
  showButton = true,
}: PlanProps) {
  let planFeatures = planFeaturesMap.get(plan.item.name.toLowerCase());

  if (!planFeatures) {
    planFeatures = planFeaturesMap.get('free') as string[];
  }

  const headerColor = planColorMap.get(plan.item.name.toLowerCase());
  const headerBgColor = useColorModeValue(headerColor, `${headerColor}90`);
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const gradientFrom = useColorModeValue('black', 'white');
  const gradientTo = useColorModeValue('#999999', '#666666');

  return (
    <Box
      rounded="xl"
      boxShadow="2xl"
      display="flex"
      flexDirection="column"
      width="full"
      maxWidth="md"
      gridColumn={index === 2 ? { md: 'span 2', lg: 'span 1' } : undefined}
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
          {plan.item.name}
        </Heading>
        <Heading
          as="h2"
          fontSize={{ base: 'xl', sm: '2xl' }}
          color={textColor}
          fontWeight="bold"
          pt={2}
        >
          ₹{plan.item.amount / 100}
        </Heading>
        <Text fontSize={{ base: 'sm', sm: 'md' }} color={textColor} mt={4}>
          {plan.item.description}
        </Text>
      </Box>
      <Flex flexGrow={1} flexDirection="column" justifyContent="space-between">
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
        {showButton && (
          <Box mt={4}>
            <Button
              onClick={() => handleClick(plan.id)}
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
              {'Upgrade'}
            </Button>
          </Box>
        )}
      </Flex>
    </Box>
  );
}
