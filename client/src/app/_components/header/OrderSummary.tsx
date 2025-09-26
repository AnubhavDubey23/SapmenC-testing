'use client';

import React, { useState } from 'react';
import {
  VStack, Text, Button, Flex, Image, Divider, useToast
} from '@chakra-ui/react';
import useCreateSubscription from '@/hooks/plans/useCreateSubscription';
import useRazorpay from '@/hooks/razorpay/useRazorpay';
import { RazorpayPaymentOpts, RazorpayPaymentResponse, RazorpaySubscriptionSuccessResponse } from '@/types/razorpay.types';
import useVerifyPayment from '@/hooks/plans/useVerifyPayment';
import { useAppSelector } from '@/store';

interface OrderSummaryProps {
  plan: any; // contains plan details { name, item: { amount } }
  onSuccess?: () => void; // optional callback after successful payment
  onClose: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ plan, onSuccess, onClose }) => {
  const [price] = useState(plan.item.amount / 100);
  const tax = 0.18 * parseInt(price.toString());
  const total = tax + price;
  
  const { createSubscription , loading: createLoading} = useCreateSubscription();
  const { initializePayment,isLoaded} = useRazorpay();
  const { verifyPayment, loading: verifyPaymentLoading } = useVerifyPayment();
  const toast = useToast();
  const authState = useAppSelector((state) => state.auth);

  const handlePayment = async () => {
    try {
      // Check if Razorpay is loaded
      if (!isLoaded) {
        toast({ 
          title: "Error", 
          description: "Payment system is loading. Please try again in a moment.", 
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Step 1: Create Razorpay Order via backend
      const res = await createSubscription(plan.id,authState.currentToken ?? undefined);

      if (!res || !res.subscription) {
        toast({
          title: 'Error',
          description: 'Could not create subscription',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      
      // Step 2: Razorpay Checkout Options
      const opts: Omit<RazorpayPaymentOpts, 'key' | 'currency'> = {
        subscription_id: res.subscription.id,
        name: 'SapMen C Private Limited',
        description: `${plan.name} Plan Subscription`,
        handler: async function (response: RazorpayPaymentResponse) {
          try {
            if ('razorpay_subscription_id' in response) {
              const subscriptionResponse = response as RazorpaySubscriptionSuccessResponse;
              
              const verifyRes = await verifyPayment({
                razorpay_payment_id: subscriptionResponse.razorpay_payment_id,
                razorpay_subscription_id: subscriptionResponse.razorpay_subscription_id,
                razorpay_signature: subscriptionResponse.razorpay_signature,
              });

              if (verifyRes) {
                toast({ title: 'Payment Successful', status: 'success' });
                onSuccess?.();
              } else {
                toast({ title: 'Payment Verification Failed', status: 'error' });
              }
            } else {
              toast({ title: 'Payment Error: Unexpected response type for subscription', status: 'error' });
            }
          } catch (error) {
            console.error('Verification error:', error);
            toast({ 
              title: 'Payment Verification Error', 
              status: 'error',
              duration: 5000,
            });
          } finally {
            // no background modal to close here
          }
        },
        prefill: {
          name: res.user.name,
          email: res.user.email,
          contact: res.user.phone,
        },
        notes: {
          user_id: res.user._id,
          user_email: res.user.email,
          user_full_name: res.user.name,
          plan_id: plan.id,
        },
      };

      // Close the cart modal (and any parent Chakra modals) BEFORE opening Razorpay
      onClose();

      // Proactively release any lingering focus from Chakra's focus-lock
      if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
        try { document.activeElement.blur(); } catch { /* ignore */ }
      }

      // Give a moment for modal unmount and focus-lock cleanup (mirror credits flow timing)
      await new Promise(resolve => setTimeout(resolve, 200));

      try {
        const rzp = initializePayment(opts);
        if (rzp) {
          rzp.open();
        } else {
          throw new Error('Failed to initialize Razorpay');
        }
      } catch (razorpayError) {
        console.error('Razorpay initialization error:', razorpayError);
        toast({
          title: 'Payment System Error',
          description: 'Failed to initialize payment system. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      
    } catch (err) {
      console.error(err);
      toast({
        title: 'Payment Error',
        description: 'Something went wrong during payment',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} align="stretch" bg="#F8F8F8" borderRadius="lg" p={6} boxShadow="md">
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
        isLoading={createLoading ||verifyPaymentLoading}
        loadingText="Processing..."
      >
        Confirm Purchase
      </Button>

      {/* Secure Payment Icons */}
      <Flex align="center" justify="flex-start" gap={2} mt={2}>
        <Image src="/payment/secure-payment.svg" alt="Visa" height="16px" />
        <Text fontSize="xs" color="gray.600">Secure Payment</Text>
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

      <Flex justify="center" align="center" border="1px solid" borderColor="green.200" borderRadius="full" py={1} px={3} mt={2}>
        <Image src="/payment/secure-checkout.svg" alt="Secure" boxSize="36px" mr={2} />
        <Text color="gray.500" fontSize="lg" fontWeight="medium">SECURE CHECKOUT</Text>
      </Flex>
    </VStack>
  );
};

export default OrderSummary;
