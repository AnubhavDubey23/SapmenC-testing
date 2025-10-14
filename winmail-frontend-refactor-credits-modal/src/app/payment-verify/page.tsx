'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { Box, Spinner, Text, VStack } from '@chakra-ui/react';
import useVerifyPayment from '@/hooks/plans/useVerifyPayment';
import useVerifyHybridPayment from '@/hooks/plans/useVerifyHybridPayment';
import {
  RazorpayPaymentResponse,
  RazorpaySuccessResponse,
  RazorpaySubscriptionSuccessResponse,
} from '@/types/razorpay.types';

export default function PaymentVerifyPage() {
  const toast = useToast();
  const { verifyPayment } = useVerifyPayment();
  const { verifyHybridPayment } = useVerifyHybridPayment();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<string>(
    'Processing payment...'
  );

  useEffect(() => {
    const verifyStoredPayment = async () => {
      try {
        // Get payment data from sessionStorage
        const storedData = sessionStorage.getItem('razorpay_payment_data');
        if (!storedData) {
          // No payment data found in session storage
          setVerificationStatus('No payment data found');
          setTimeout(() => {
            window.location.replace('/?payment=failed');
          }, 2000);
          return;
        }

        const paymentData = JSON.parse(storedData);
        const { response, isHybrid, subscriptionId, planId, timestamp } =
          paymentData;

        // Check if data is not too old (5 minutes max)
        if (Date.now() - timestamp > 5 * 60 * 1000) {
          // Payment data expired, redirecting
          setVerificationStatus('Payment verification expired');
          sessionStorage.removeItem('razorpay_payment_data');
          setTimeout(() => {
            window.location.replace('/?payment=failed');
          }, 2000);
          return;
        }

        // Found payment data in session storage
        setVerificationStatus('Verifying payment with server...');

        if (isHybrid && 'razorpay_order_id' in response) {
          // Hybrid approach: Order-based response with subscription context
          const orderResponse = response as RazorpaySuccessResponse;
          // Verifying hybrid payment
          const verifyRes = await verifyHybridPayment({
            razorpay_payment_id: orderResponse.razorpay_payment_id,
            razorpay_order_id: orderResponse.razorpay_order_id,
            razorpay_signature: orderResponse.razorpay_signature,
            subscription_id: subscriptionId || undefined,
            plan_id: planId || undefined,
          });

          if (verifyRes && verifyRes.verified) {
            // Hybrid payment verified successfully
            setVerificationStatus(
              'Payment verified! Activating subscription...'
            );
            sessionStorage.removeItem('razorpay_payment_data');
            toast({ title: 'Payment Successful', status: 'success' });
            setTimeout(() => {
              window.location.replace('/?payment=success');
            }, 1500);
          } else {
            // Hybrid payment verification failed
            setVerificationStatus('Payment verification failed');
            sessionStorage.removeItem('razorpay_payment_data');
            toast({ title: 'Payment Verification Failed', status: 'error' });
            setTimeout(() => {
              window.location.replace('/?payment=failed');
            }, 2000);
          }
        } else {
          console.log('❌ Unexpected response type:', response);
          setVerificationStatus('Invalid payment response');
          sessionStorage.removeItem('razorpay_payment_data');
          toast({
            title: 'Payment Error: Unexpected response type',
            status: 'error',
          });
          setTimeout(() => {
            window.location.replace('/?payment=failed');
          }, 2000);
        }
      } catch (error) {
        // Payment verification error occurred
        setVerificationStatus('Verification error occurred');
        sessionStorage.removeItem('razorpay_payment_data');
        toast({
          title: 'Payment Verification Error',
          status: 'error',
        });
        setTimeout(() => {
          window.location.replace('/?payment=failed');
        }, 2000);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyStoredPayment();
  }, [verifyPayment, verifyHybridPayment, toast]);

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="white"
      data-payment-verify-page
    >
      <VStack spacing={6} textAlign="center" p={8}>
        <Spinner size="xl" color="blue.500" thickness="4px" />
        <VStack spacing={2}>
          <Text fontSize="xl" fontWeight="semibold" color="gray.800">
            {isVerifying ? 'Verifying Payment' : 'Processing Complete'}
          </Text>
          <Text fontSize="md" color="gray.600">
            {verificationStatus}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Please wait, do not refresh this page...
          </Text>
        </VStack>
      </VStack>
    </Box>
  );
}
