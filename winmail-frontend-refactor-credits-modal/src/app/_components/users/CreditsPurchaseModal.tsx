import {
  Box,
  Button,
  Grid,
  GridItem,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  Image,
  Divider,
  Flex,
  useToast,
} from '@chakra-ui/react';
import React, { ChangeEvent, useState } from 'react';
import useCredits from '@/hooks/credits/useCredits';
import useMe from '@/hooks/auth/useMe';
import useRazorpay from '@/hooks/razorpay/useRazorpay';
import usePurchaseCredits from '@/hooks/credits/usePurchaseCredits';
import {
  RazorpayPaymentOpts,
  RazorpayPaymentResponse,
  RazorpaySuccessResponse,
} from '@/types/razorpay.types';

interface CreditsPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPaymentModal?: () => void;
}

export const CreditsPurchaseModal = ({
  isOpen,
  onClose,
  onOpenPaymentModal,
}: CreditsPurchaseModalProps) => {
  const [selectedCredits, setSelectedCredits] = useState<number | null>(null);
  const [customCredits, setCustomCredits] = useState<string>('');
  const { purchaseCredits, loading: purchaseCreditsLoading } =
    usePurchaseCredits();
  const { incrementCredits } = useCredits();
  const { initializePayment, isLoaded } = useRazorpay();
  const { getUser } = useMe();

  const toast = useToast();

  const creditPriceMap = {
    2000: 200,
    4000: 400,
    6000: 600,
    8000: 800,
    10000: 1000,
    15000: 1500,
    20000: 2000,
    25000: 2500,
    30000: 3000,
    35000: 3500,
    40000: 4000,
    45000: 4500,
  };

  const creditOptions = Object.keys(creditPriceMap).map(Number);

  const handlePurchase = async () => {
    try {
      // Ensure Razorpay SDK is ready before creating order
      if (!isLoaded) {
        toast({
          title: 'Payment system is loading',
          description: 'Please wait a moment and try again.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      // Determine the credits to purchase
      let creditsToPurchase = 0;
      if (selectedCredits !== null) {
        creditsToPurchase = selectedCredits;
      } else if (customCredits) {
        creditsToPurchase = parseInt(customCredits, 10);
      }
      if (creditsToPurchase <= 0) {
        toast({
          title: 'Invalid amount',
          description: 'Please select or enter a valid number of credits',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const res = await purchaseCredits(creditsToPurchase);

      if (res) {
        // Close our modal FIRST
        onClose();

        const opts: Omit<RazorpayPaymentOpts, 'key' | 'currency'> = {
          amount: res.order.amount,
          order_id: res.order.id,
          handler: async function (response: RazorpayPaymentResponse) {
            const pay = response as RazorpaySuccessResponse;
            await incrementCredits({
              razorpay_order_id: pay.razorpay_order_id,
              razorpay_payment_id: pay.razorpay_payment_id,
              razorpay_signature: pay.razorpay_signature,
              amount: res.order.amount,
            });
            // Refresh the user profile to reflect updated credits immediately
            await getUser();
          },
          prefill: {
            name: res.user.name,
            email: res.user.email,
            contact: res.user.phone,
          },
        };

        const rzp = initializePayment(opts);

        onOpenPaymentModal?.();

        // Open the Razorpay modal
        rzp.open();
      }
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'An error occurred while processing your payment',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="20px" p={8}>
        <ModalHeader color="#3F2DA5" fontSize="xx-large">
          Purchase Credits
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
            {/* Left Column - Credit Options */}
            <Box flex={1}>
              <Text mb={4} fontWeight="bold" fontSize="x-large">
                Choose from options below
              </Text>
              <Grid
                templateColumns="repeat(auto-fit, minmax(100px, auto))"
                gap={3}
              >
                {creditOptions.map((amount) => {
                  const isLegacy = amount < 15000;
                  const isSelected = selectedCredits === amount;
                  const imageSrc = isLegacy
                    ? '/payment/credits.svg'
                    : '/payment/credits_2.0.svg';

                  return (
                    <GridItem key={amount}>
                      <Box
                        display="inline-flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        position="relative"
                        borderRadius="16px"
                        textAlign="center"
                        bg="white"
                        border="3px solid"
                        borderColor={isSelected ? '#3F2DA5' : '#FFFFFF'}
                        boxShadow={
                          isSelected
                            ? '0 0 0 3px rgba(63, 45, 165, 0.1)'
                            : '0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }
                        _hover={{
                          borderColor: '#3F2DA5',
                          cursor: 'pointer',
                          transform: 'translateY(-2px)',
                          boxShadow:
                            '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -4px rgba(0, 0, 0, 0.1)',
                        }}
                        transition="all 0.2s ease"
                        onClick={() => {
                          setSelectedCredits(amount);
                          setCustomCredits(amount.toString());
                        }}
                      >
                        {/* Checkmark indicator */}
                        <Box
                          position="absolute"
                          top="1"
                          left="1"
                          w="5"
                          h="5"
                          borderRadius="full"
                          border="3px solid"
                          borderColor={isSelected ? '#3F2DA5' : 'transparent'}
                          bg={isSelected ? '#3F2DA5' : 'transparent'}
                          color="white"
                          fontSize="xs"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          opacity={isSelected ? 1 : 0}
                          transform={isSelected ? 'scale(1)' : 'scale(0)'}
                          transition="all 0.2s ease"
                        >
                          ✓
                        </Box>

                        <VStack spacing={1} justify="center" h="full">
                          <Image
                            src={imageSrc}
                            alt="credits"
                            boxSize={'120px'}
                            mx="auto"
                            p={isLegacy ? 6 : 0}
                            objectFit="contain"
                          />
                          <Text
                            fontWeight="bold"
                            color={isSelected ? '#3F2DA5' : '#94A3B8'}
                            fontSize="md"
                            mt={-6}
                            transition="all 0.3s ease"
                          >
                            {amount.toLocaleString()}
                          </Text>
                        </VStack>
                      </Box>
                    </GridItem>
                  );
                })}
              </Grid>
            </Box>

            {/* Vertical Divider with OR text */}
            <Flex
              direction="column"
              align="center"
              justify="center"
              position="relative"
            >
              <Divider
                orientation="vertical"
                height="100%"
                borderColor="gray.300"
              />
              <Box
                position="absolute"
                bg="white"
                px={4}
                py={2}
                borderRadius="full"
                border="1px solid"
                borderColor="gray.300"
              >
                <Text fontSize="xl" fontWeight="bold" color="black">
                  OR
                </Text>
              </Box>
            </Flex>

            {/* Right Column - Payment Info */}
            <Box flex={1} minW="400px">
              {/* Custom Credits Section */}
              <Box mb={10}>
                <Text fontWeight="bold" fontSize="x-large" mb={3}>
                  Customize your credits
                </Text>
                <Input
                  type="number"
                  placeholder="Enter the number of credits you want to purchase"
                  value={customCredits}
                  size="lg"
                  height="48px"
                  onChange={(e) => {
                    const value = e.target.value;
                    setCustomCredits(value);
                    if (selectedCredits !== null) {
                      setSelectedCredits(null);
                    }
                  }}
                  borderColor="#C1C1C1"
                  _hover={{ borderColor: '#3F2DA5' }}
                  _focus={{ borderColor: '#3F2DA5', boxShadow: 'none' }}
                />
              </Box>

              {/* Payment Info Section */}
              <VStack spacing={6} align="stretch">
                <Flex align="center" gap={3}>
                  <Image
                    src="/payment/secure-payment.svg"
                    alt="Secure"
                    height="20px"
                  />
                  <Text fontWeight="bold" fontSize="large" color="gray.600">
                    Secure Payment
                  </Text>
                  <Flex ml="auto" gap={3}>
                    <Image src="/payment/visa.svg" alt="Visa" height="25px" />
                    <Image
                      src="/payment/mastercard.svg"
                      alt="Mastercard"
                      height="25px"
                    />
                    <Image src="/payment/amex.svg" alt="Amex" height="25px" />
                    <Image src="/payment/rupay.svg" alt="RuPay" height="25px" />
                    <Image
                      src="/payment/maestro.svg"
                      alt="Maestro"
                      height="25px"
                    />
                  </Flex>
                </Flex>

                <Text fontSize="md" color="gray.600" mb={2}>
                  We also accept Indian Debit Cards, UPI and Netbanking.
                </Text>

                <Flex justify="center" my={6}>
                  <Image src="/razorpay.svg" alt="Razorpay" height="48px" />
                </Flex>

                <Flex
                  justify="center"
                  align="center"
                  border="1px solid"
                  borderColor="green.200"
                  borderRadius="full"
                  py={3}
                  px={6}
                  mb={4}
                >
                  <Image
                    src="/payment/secure-checkout.svg"
                    alt="Secure"
                    boxSize="28px"
                    mr={3}
                  />
                  <Text color="gray.500" fontSize="lg" fontWeight="medium">
                    SECURE CHECKOUT
                  </Text>
                </Flex>
              </VStack>
            </Box>
          </Flex>

          {/* Proceed to Pay Button */}
          <Flex justifyContent="center" mt={8}>
            <Button
              w="40%"
              h="56px"
              borderRadius="full"
              fontSize="lg"
              fontWeight="bold"
              color="white"
              bgGradient="linear(to-r, #6D66C8 -19.95%, #221E5A 80.05%)"
              _hover={{
                bgGradient: 'linear(to-r, #6D66C8 -19.95%, #221E5A 80.05%)',
                transform: 'translateY(-1px)',
                boxShadow: 'lg',
              }}
              _active={{
                bgGradient: 'linear(to-r, #6D66C8 -19.95%, #221E5A 80.05%)',
                transform: 'translateY(0)',
              }}
              transition="all 0.2s ease"
              onClick={handlePurchase}
              isLoading={purchaseCreditsLoading}
              loadingText="Processing..."
            >
              Proceed to Pay
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
