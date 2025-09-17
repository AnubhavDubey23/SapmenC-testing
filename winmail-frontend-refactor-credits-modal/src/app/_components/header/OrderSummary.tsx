'use client';

import React, { useState,useEffect } from 'react';
import {
  VStack, Text, Button, Flex, Image, Divider, useToast
} from '@chakra-ui/react';
import useCreateSubscription from '@/hooks/plans/useCreateSubscription';
import useCredits from '@/hooks/credits/useCredits';
import useRazorpay from '@/hooks/razorpay/useRazorpay';
import { RazorpayPaymentOpts, RazorpaySuccessResponse } from '@/types/razorpay.types';
import useVerifyPayment from '@/hooks/plans/useVerifyPayment';
import { useAppSelector } from '@/store';

interface OrderSummaryProps {
  plan: any; // contains plan details { name, item: { amount } }
  onSuccess?: () => void; // optional callback after successful payment
  // onClick: () => void;
  onClose: () => void;
  onRazorpayOpen: () => void;
  onRazorpayClose: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ plan, onSuccess, onClose,onRazorpayOpen,onRazorpayClose  }) => {
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
      // Step 1: Create Razorpay Order via backend
      console.log("Token",authState.currentToken);
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

      // if (!isLoaded) {
      //   toast({ title: "Error", description: "Razorpay not loaded yet", status: "error" });
      //   return;
      // }
      
      // Step 2: Razorpay Checkout Options
      const opts: Omit<RazorpayPaymentOpts, 'key' | 'currency'> = {
        subscription_id: res.subscription.id,
        handler: async function (response: RazorpaySuccessResponse) {
          try {
            // Use the 'in' operator as a type guard to check which response type we have
            if ('razorpay_subscription_id' in response) {
              // Inside this 'if' block, TypeScript now knows 'response' is a RazorpaySubscriptionSuccessResponse
              
              const verifyRes = await verifyPayment({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyRes?.status) {
                toast({ title: 'Payment Successful', status: 'success' });
              } else {
                toast({ title: 'Payment Verification Failed', status: 'error' });
              }
            } else {
              // This is the case for a regular payment, which we don't expect here.
              toast({ title: 'Payment Error: Unexpected response type', status: 'error' });
            }
          } catch (error) {
            console.error('Verification error:', error);
            toast({ 
              title: 'Payment Verification Error', 
              status: 'error',
              duration: 5000,
            });
          } finally {
            onRazorpayClose();
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

    

      onClose(); // Close cart modal
      onRazorpayOpen(); // Notify parent to close other modals

      document.body.style.overflow = 'auto';

      // // Add a small delay to ensure modals are completely removed from DOM
      await new Promise(r => setTimeout(r, 50));

      // // wait for next paint(s) so Chakra unmounts modal DOM
      // await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));


      // Step 3: Open Razorpay
      const rzp = initializePayment(opts);
      if (rzp) {
        rzp.open();
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
      onRazorpayClose(); // Ensure Razorpay state is cleaned up on error
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
