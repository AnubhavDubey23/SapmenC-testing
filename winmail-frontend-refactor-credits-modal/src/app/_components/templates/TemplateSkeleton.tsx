import { Flex, Skeleton, VStack } from '@chakra-ui/react';

const TemplateSkeleton = () => {
  return (
    <>
      <Flex gap={3} align="center">
        <Skeleton boxSize={10} borderRadius="full" flexShrink={0} />
        <VStack gap={1} align="flex-start">
          <Skeleton height={4} width={40} />
          <Skeleton height={4} width={40} />
        </VStack>
      </Flex>
      <Flex gap={3} align="center" justify="flex-end">
        <VStack gap={1} align="flex-end">
          <Skeleton height={4} width={40} />
        </VStack>
        <Skeleton boxSize={10} borderRadius="full" flexShrink={0} />
      </Flex>
    </>
  );
};

export default TemplateSkeleton;
