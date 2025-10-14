'use client';

import React, { useEffect, useState } from 'react';
import './payment.css';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToast, Box, VStack, Spinner, Text } from '@chakra-ui/react';
import useRazorpay from '@/hooks/razorpay/useRazorpay';
import useVerifyPayment from '@/hooks/plans/useVerifyPayment';
import useVerifyHybridPayment from '@/hooks/plans/useVerifyHybridPayment';
import {
  RazorpayPaymentOpts,
  RazorpayPaymentResponse,
  RazorpaySubscriptionSuccessResponse,
  RazorpaySuccessResponse,
} from '@/types/razorpay.types';

const PaymentPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const { verifyPayment } = useVerifyPayment();
  const { verifyHybridPayment } = useVerifyHybridPayment();
  const { initializePayment, isLoaded } = useRazorpay();
  const [isProcessing, setIsProcessing] = useState(true);

  // Get auth token from URL params (passed from OrderSummary)
  const authToken = searchParams.get('auth_token');

  useEffect(() => {
    const subscriptionId = searchParams.get('subscription_id');
    const orderId = searchParams.get('order_id');

    if (!subscriptionId && !orderId) return;

    // Wait for Razorpay SDK to load
    if (!isLoaded) {
      // Waiting for Razorpay SDK to load
      return;
    }

    // Prevent multiple initializations
    if ((window as any).razorpayInitialized) {
      // Razorpay already initialized, skipping
      return;
    }

    // Initializing Razorpay payment
    setIsProcessing(true);
    const planName = searchParams.get('plan_name');
    const userName = searchParams.get('user_name');
    const userEmail = searchParams.get('user_email');
    const userPhone = searchParams.get('user_phone');
    const userId = searchParams.get('user_id');
    const planId = searchParams.get('plan_id');
    const isHybrid = searchParams.get('hybrid') === 'true';

    if ((!subscriptionId && !orderId) || !planName || !userName || !userEmail) {
      toast({
        title: 'Error',
        description: 'Missing payment information',
        status: 'error',
      });
      window.location.href = '/';
      return;
    }

    // Get plan amount from URL params for enhanced UI
    const planAmount = searchParams.get('plan_amount');

    const opts: Omit<RazorpayPaymentOpts, 'key' | 'currency'> = {
      // Use order_id for hybrid approach (enhanced UI) or subscription_id for legacy
      ...(isHybrid && orderId
        ? {
            order_id: orderId,
            amount: planAmount ? parseInt(planAmount) : undefined,
          }
        : { subscription_id: subscriptionId || '' }),
      name: 'SapMen C Private Limited',
      description: `${planName} Plan Subscription`,
      handler: async function (response: RazorpayPaymentResponse) {
        // Payment completed, processing response

        // Close Razorpay immediately to prevent further API calls
        try {
          if ((window as any).rzp1) {
            (window as any).rzp1.close();
          }
        } catch (e) {
          // Could not close Razorpay modal
        }

        try {
          if (isHybrid && 'razorpay_order_id' in response) {
            // Hybrid approach: Order-based response with subscription context
            const orderResponse = response as RazorpaySuccessResponse;
            // Verifying hybrid payment

            const verifyRes = await verifyHybridPayment(
              {
                razorpay_payment_id: orderResponse.razorpay_payment_id,
                razorpay_order_id: orderResponse.razorpay_order_id,
                razorpay_signature: orderResponse.razorpay_signature,
                subscription_id: subscriptionId || undefined,
                plan_id: planId || undefined,
              },
              authToken || undefined
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
              // Redirect to home (main app) instead of dashboard to maintain auth state
              setTimeout(() => {
                window.location.href = '/';
              }, 1500);
            } else {
              // Payment verification failed
              toast({ title: 'Payment Verification Failed', status: 'error' });
              window.location.href = '/';
            }
          } else if ('razorpay_subscription_id' in response) {
            // Legacy approach: Subscription-based response
            const subscriptionResponse =
              response as RazorpaySubscriptionSuccessResponse;
            // Verifying legacy payment

            const verifyRes = await verifyPayment(
              {
                razorpay_payment_id: subscriptionResponse.razorpay_payment_id,
                razorpay_subscription_id:
                  subscriptionResponse.razorpay_subscription_id,
                razorpay_signature: subscriptionResponse.razorpay_signature,
              },
              authToken || undefined
            );

            if (verifyRes) {
              // Legacy payment verified successfully
              toast({
                title: 'Payment Successful!',
                description:
                  'Your subscription has been activated successfully',
                status: 'success',
                duration: 3000,
              });
              // Redirect to home (main app) instead of dashboard to maintain auth state
              setTimeout(() => {
                window.location.href = '/';
              }, 1500);
            } else {
              // Legacy payment verification failed
              toast({ title: 'Payment Verification Failed', status: 'error' });
              window.location.href = '/';
            }
          } else {
            // Unexpected response type
            toast({
              title: 'Payment Error: Unexpected response type',
              status: 'error',
            });
            window.location.replace('/?payment=failed');
          }
        } catch (error) {
          // Verification error occurred
          toast({
            title: 'Payment Verification Error',
            status: 'error',
          });
          window.location.href = '/';
        }
      },
      prefill: {
        name: userName,
        email: userEmail,
        contact: userPhone || '',
      },
      notes: {
        user_id: userId || '',
        user_email: userEmail,
        user_full_name: userName,
        plan_id: planId || '',
      },
      modal: {
        ondismiss: function () {
          console.log(
            '🚪 Razorpay modal dismissed by user - redirecting to home'
          );
          window.location.href = '/';
        },
        escape: true,
        backdropclose: true,
        animation: false,
      },
      theme: {
        color: '#6D66C8',
      },
    };

    try {
      const rzp = initializePayment(opts);
      if (rzp) {
        // Store the instance globally for cleanup
        (window as any).rzp1 = rzp;

        // Completely hide all page content when Razorpay opens
        document.body.style.backgroundColor = '#ffffff';
        document.body.style.backgroundImage = 'none';
        document.body.style.background = '#ffffff';

        // Hide everything in the body except Razorpay
        const allElements = document.body.children;
        Array.from(allElements).forEach((element) => {
          if (
            element.tagName !== 'SCRIPT' &&
            element.tagName !== 'STYLE' &&
            !element.querySelector('iframe[name="razorpay-checkout"]')
          ) {
            (element as HTMLElement).style.display = 'none';
          }
        });

        // Mark as initialized to prevent multiple calls
        (window as any).razorpayInitialized = true;

        // Opening Razorpay payment modal

        rzp.open();

        // Additional cleanup after Razorpay opens
        setTimeout(() => {
          // Ensure background is completely white
          document.body.style.backgroundColor = '#ffffff';
          document.documentElement.style.backgroundColor = '#ffffff';

          // Hide any remaining visible elements
          const visibleElements = document.querySelectorAll(
            '*:not(iframe):not(script):not(style)'
          );
          visibleElements.forEach((el) => {
            const element = el as HTMLElement;
            if (
              element.offsetParent !== null &&
              !element.closest('iframe[name="razorpay-checkout"]') &&
              element.tagName !== 'HTML' &&
              element.tagName !== 'HEAD' &&
              element.tagName !== 'BODY'
            ) {
              element.style.visibility = 'hidden';
            }
          });
        }, 1000);
      } else {
        throw new Error('Failed to initialize Razorpay');
      }
    } catch (error) {
      console.error('Razorpay initialization error:', error);
      toast({
        title: 'Payment System Error',
        description: 'Failed to initialize payment system. Please try again.',
        status: 'error',
      });
      window.location.href = '/';
    }

    setIsProcessing(false);
  }, [isLoaded, searchParams, initializePayment, verifyPayment, toast, router]);

  // Don't show loading state - let Razorpay load in background
  if (!isLoaded) {
    return null;
  }

  // Don't render anything - let Razorpay take over completely
  return null;
};

export default PaymentPage;
