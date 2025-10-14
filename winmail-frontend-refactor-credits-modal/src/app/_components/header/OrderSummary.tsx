'use client';

import React, { useState } from 'react';
import {
  VStack,
  Text,
  Button,
  Flex,
  Image,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import useCreateSubscription from '@/hooks/plans/useCreateSubscription';
import useCreateHybridSubscription from '@/hooks/plans/useCreateHybridSubscription';
import useRazorpay from '@/hooks/razorpay/useRazorpay';
import useVerifyHybridPayment from '@/hooks/plans/useVerifyHybridPayment';
import { useAppSelector } from '@/store';
import {
  RazorpayPaymentOpts,
  RazorpayPaymentResponse,
  RazorpaySuccessResponse,
} from '@/types/razorpay.types';

interface OrderSummaryProps {
  plan: any; // contains plan details { name, item: { amount } }
  onSuccess?: () => void; // optional callback after successful payment
  onClose: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  plan,
  onSuccess,
  onClose,
}) => {
  const [price] = useState(plan.item.amount / 100);
  const tax = 0.18 * parseInt(price.toString());
  const total = tax + price;

  const router = useRouter();
  const { createSubscription, loading: createLoading } =
    useCreateSubscription();
  const { createHybridSubscription, loading: hybridLoading } =
    useCreateHybridSubscription();
  const { initializePayment, isLoaded } = useRazorpay();
  const { verifyHybridPayment } = useVerifyHybridPayment();
  const toast = useToast();
  const authState = useAppSelector((state) => state.auth);

  const handlePayment = async () => {
    try {
      // Check if Razorpay SDK is loaded
      if (!isLoaded) {
        toast({
          title: 'Payment System Loading',
          description:
            'Please wait for the payment system to load and try again',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Step 1: Create Hybrid Subscription (Order + Subscription) via backend
      const res = await createHybridSubscription(
        plan.id,
        authState.currentToken ?? undefined
      );

      if (!res || !res.subscription || !res.order) {
        toast({
          title: 'Error',
          description: 'Could not create subscription and order',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      // Step 2: Initialize Razorpay payment directly without URL change
      const opts: Omit<RazorpayPaymentOpts, 'key' | 'currency'> = {
        order_id: res.order.id,
        amount: res.order.amount,
        name: 'SapMen C Private Limited',
        description: `${plan.name} Plan Subscription`,
        handler: async function (response: RazorpayPaymentResponse) {
          // Payment completed, processing response

          try {
            if ('razorpay_order_id' in response) {
              // Hybrid approach: Order-based response with subscription context
              const orderResponse = response as RazorpaySuccessResponse;
              // Verifying hybrid payment

              const verifyRes = await verifyHybridPayment(
                {
                  razorpay_payment_id: orderResponse.razorpay_payment_id,
                  razorpay_order_id: orderResponse.razorpay_order_id,
                  razorpay_signature: orderResponse.razorpay_signature,
                  subscription_id: res.subscription.id,
                  plan_id: plan.id,
                },
                authState.currentToken || undefined
              );

              if (verifyRes && verifyRes.verified) {
                // Payment verified successfully
                toast({
                  title: 'Payment Successful!',
                  description:
                    'Your subscription has been activated successfully',
                  status: 'success',
                  duration: 3000,
                });

                // Close the modal and call success callback
                onClose();
                if (onSuccess) {
                  onSuccess();
                }

                // Add a small delay to ensure modal closes properly, then navigate
                setTimeout(() => {
                  // Navigating to home page
                  try {
                    // Use window.location for more reliable navigation after payment
                    window.location.href = '/';
                  } catch (error) {
                    // Navigation error - fallback to router
                    // Fallback to router if window.location fails
                    router.push('/');
                  }
                }, 500);
              } else {
                // Payment verification failed
                toast({
                  title: 'Payment Verification Failed',
                  status: 'error',
                });
              }
            } else {
              // Unexpected response type
              toast({
                title: 'Payment Error: Unexpected response type',
                status: 'error',
              });
            }
          } catch (error) {
            // Verification error occurred
            toast({
              title: 'Payment Verification Error',
              status: 'error',
            });
          }
        },
        prefill: {
          name: res.user.name,
          email: res.user.email,
          contact: res.user.phone || '',
        },
        notes: {
          user_id: res.user._id,
          user_email: res.user.email,
          user_full_name: res.user.name,
          plan_id: plan.id,
        },
        modal: {
          ondismiss: function () {
            // Razorpay modal dismissed by user
            // Don't close the OrderSummary modal, let user try again
          },
          escape: true,
          backdropclose: true,
          animation: false,
        },
        theme: {
          color: '#6D66C8',
        },
      };

      // Step 3: Open Razorpay modal
      const rzp = initializePayment(opts);
      if (rzp) {
        // Enhanced DOM cleanup for better focus management
        setTimeout(() => {
          // Remove focus-lock attributes that might interfere
          document
            .querySelectorAll('[data-focus-lock-disabled]')
            .forEach((el) => {
              el.removeAttribute('data-focus-lock-disabled');
            });

          // Hide any aria-hidden overlays temporarily
          const overlays = document.querySelectorAll('[aria-hidden="true"]');
          overlays.forEach((overlay) => {
            (overlay as HTMLElement).style.display = 'none';
          });

          // Store reference to restore later
          (window as any).hiddenOverlays = overlays;
        }, 100);

        // Opening Razorpay payment modal

        rzp.open();

        // Restore hidden overlays when Razorpay closes
        const originalClose = rzp.close;
        rzp.close = function () {
          const result = originalClose.call(this);

          // Restore previously hidden overlays
          if ((window as any).hiddenOverlays) {
            (window as any).hiddenOverlays.forEach((overlay: HTMLElement) => {
              overlay.style.display = '';
            });
            delete (window as any).hiddenOverlays;
          }

          return result;
        };
      } else {
        throw new Error('Failed to initialize Razorpay');
      }
    } catch (err) {
      console.error(err);
      toast({
        title: 'Payment Error',
        description: 'Something went wrong during payment initialization',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack
      spacing={4}
      align="stretch"
      bg="#F8F8F8"
      borderRadius="lg"
      p={6}
      boxShadow="md"
    >
      <Text fontSize="xl" fontWeight="bold" mb={2}>
        Order Summary
      </Text>
      <Flex justify="space-between" fontSize="sm">
        <Text>{plan.name} Plan</Text>
        <Text>₹{price}</Text>
      </Flex>
      <Flex justify="space-between" fontSize="sm">
        <Text>Applicable Taxes</Text>
        <Text>₹{tax.toFixed(2)}</Text>
      </Flex>
      <Flex justify="space-between" fontSize="sm">
        <Text>Fees</Text>
        <Text>₹0</Text>
      </Flex>
      <Divider borderWidth="1px" borderColor="gray.300" />
      <Flex justify="space-between" fontWeight="bold" mt={2}>
        <Text>Total (INR)</Text>
        <Text color="#6D66C8">₹{total.toFixed(2)}</Text>
      </Flex>

      <Button
        colorScheme="purple"
        size="lg"
        borderRadius="full"
        py={6}
        mt={4}
        bgGradient="linear(to-r, #6D66C8, #353262)"
        _hover={{ bgGradient: 'linear(to-r, #5D56B8, #252152)' }}
        onClick={handlePayment}
        isLoading={hybridLoading}
        loadingText="Processing..."
      >
        Confirm Purchase
      </Button>

      {/* Secure Payment Icons */}
      <Flex align="center" justify="flex-start" gap={2} mt={2}>
        <Image src="/payment/secure-payment.svg" alt="Visa" height="16px" />
        <Text fontSize="xs" color="gray.600">
          Secure Payment
        </Text>
        <Flex ml="auto" gap={1}>
          <Image src="/payment/visa.svg" alt="Visa" height="16px" />
          <Image src="/payment/mastercard.svg" alt="Mastercard" height="16px" />
          <Image src="/payment/amex.svg" alt="Amex" height="16px" />
          <Image src="/payment/rupay.svg" alt="RuPay" height="16px" />
          <Image src="/payment/maestro.svg" alt="UPI" height="16px" />
        </Flex>
      </Flex>

      <Text fontSize="xs" color="gray.600" mt={1}>
        We also accept Indian Debit Cards, UPI and Netbanking.
      </Text>

      <Flex justify="center" mt={4}>
        <Image src="/razorpay.svg" alt="Razorpay" height="42px" />
      </Flex>

      <Flex
        justify="center"
        align="center"
        border="1px solid"
        borderColor="green.200"
        borderRadius="full"
        py={1}
        px={3}
        mt={2}
      >
        <Image
          src="/payment/secure-checkout.svg"
          alt="Secure"
          boxSize="36px"
          mr={2}
        />
        <Text color="gray.500" fontSize="lg" fontWeight="medium">
          SECURE CHECKOUT
        </Text>
      </Flex>
    </VStack>
  );
};

export default OrderSummary;
