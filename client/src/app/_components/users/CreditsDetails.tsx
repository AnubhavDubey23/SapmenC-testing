import { Box, Button, Flex, Image, Text, VStack, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { CreditsPurchaseModal } from "./CreditsPurchaseModal";

interface CreditsDetailsProps {
  credits: number;
  onOpenPaymentModal?: () => void;
}

export function CreditsDetails({
  credits,
  onOpenPaymentModal,
}: CreditsDetailsProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <>
      <CreditsPurchaseModal
        isOpen={isOpen}
        onClose={onClose}
        onOpenPaymentModal={onOpenPaymentModal}
      />
      <Box
        border="1px solid #C1C1C1"
        borderRadius="20px"
        bg="white"
        px={5}
        py={2}
        width="100%"
        textAlign="center"
        boxShadow="sm"
      >
        {/* Top row: Icon + Credit Balance + Value */}
        <Flex align="center" justify="left" gap={3} mt={-3}>
          <Image
            src="/payment/credits_2.0.svg" // replace with your icon path
            alt="Credits"
            boxSize="100px"
          />
          <VStack spacing={0}>
            <Text
              fontWeight="400"
              fontSize="l"
              lineHeight="100%"
              letterSpacing="0"
              color={ "#666666" }
            >
              Credit Balance
            </Text>
            <Text
              fontSize="3xl" 
              fontWeight="bold"
              lineHeight="100%"
              letterSpacing="0"
              color={ "#666666" }
              mt={1}
            >
              {credits.toFixed(2)}
            </Text>
          </VStack>
        </Flex>

        {/* Bottom section */}
        <VStack spacing={1} mt={-3}>
          <Text fontSize="xs" color={ "#666666" } >
            Need more credits?
          </Text>
          <Button
            onClick={onOpen}
            fontSize="sm"
            bg="#6B46C1"
            width={"90%"}
            height={"90%"}
            color="white"
            borderRadius="md"
            px={5}
            py={2}
            _hover={{ bg: "#553C9A" }}
            _active={{ bg: "#44337A" }}
          >
            Purchase credits
          </Button>
        </VStack>
      </Box>
    </>
  );
}
