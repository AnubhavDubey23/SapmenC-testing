'use client';

// import {
//   RazorpayErrorResponse,
//   RazorpayPaymentOpts,
// } from '@/types/razorpay.types';

// const useRazorpay = () => {
//   function validateRazorpayOpts(opts: RazorpayPaymentOpts) {
//     if (opts.order_id && opts.subscription_id) {
//       throw new Error('Cannot specify both order_id and subscription_id');
//     }
//     if (!opts.order_id && !opts.subscription_id) {
//       throw new Error('Must specify either order_id or subscription_id');
//     }
//     return true;
//   }

//   function initializePayment(
//     opts: Omit<RazorpayPaymentOpts, 'key' | 'currency'>
//   ) {
//     if (!window.Razorpay) {
//       throw new Error('Razorpay SDK not loaded');
//     }

//     const razorpay_options: RazorpayPaymentOpts = {
//       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
//       ...opts,
//       currency: 'INR',
//     };

//     if (!validateRazorpayOpts(razorpay_options)) {
//       throw new Error('Razorpay options not valid');
//     }

//     const razorpay = new window.Razorpay(razorpay_options);

//     razorpay.on(
//       'payment.failed',
//       async function (response: RazorpayErrorResponse) {
//         const payload_for_error = {
//           error_code: response.error.code,
//           error_description: response.error.description,
//           error_source: response.error.source,
//           error_step: response.error.step,
//           error_reason: response.error.reason,
//           order_id: response.error.metadata.order_id,
//           payment_id: response.error.metadata.payment_id,
//         };

//         // call api for capturing error for razorpay payment which is failed
//         //    await createPaymentLog(payload_for_error);
//       }
//     );

//     return razorpay;
//   }

//   return {
//     initializePayment,
//   };
// };

// export default useRazorpay;

import { useEffect, useState } from 'react';
import {
  RazorpayErrorResponse,
  RazorpayPaymentOpts,
} from '@/types/razorpay.types';

const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if already loaded
    if (typeof window !== 'undefined' && window.Razorpay) {
      setIsLoaded(true);
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existingScript) {
      // If it has already loaded previously
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        setIsLoaded(true);
        return;
      }
      existingScript.addEventListener('load', () => setIsLoaded(true));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
      console.log('Razorpay instance created successfully');
    };
    script.onerror = () => {
      setIsLoaded(false);
      console.error('Failed to load Razorpay SDK');
    };
    // Append to document to actually start loading
    (document.head || document.body).appendChild(script);
  }, []);

  function validateRazorpayOpts(opts: RazorpayPaymentOpts) {
    if (opts.order_id && opts.subscription_id) {
      throw new Error('Cannot specify both order_id and subscription_id');
    }
    if (!opts.order_id && !opts.subscription_id) {
      throw new Error('Must specify either order_id or subscription_id');
    }
    return true;
  }

  function initializePayment(
    opts: Omit<RazorpayPaymentOpts, 'key' | 'currency'>
  ) {
    if (!isLoaded || !window.Razorpay) {
      throw new Error('Razorpay SDK not loaded');
    }

    const razorpay_options: RazorpayPaymentOpts = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      ...opts,
      currency: 'INR',
    };

    if (!validateRazorpayOpts(razorpay_options)) {
      throw new Error('Razorpay options not valid');
    }

    const razorpay = new window.Razorpay(razorpay_options);

    razorpay.on(
      'payment.failed',
      async function (response: RazorpayErrorResponse) {
        // Payment failed - error handled by callback
      }
    );

    // Ensure Razorpay modal can receive focus properly
    razorpay.on('payment.submit', function () {
      // Payment submitted to Razorpay
    });

    // Add event listener for when Razorpay modal opens
    const originalOpen = razorpay.open;
    razorpay.open = function () {
      // Call original open method
      const result = originalOpen.call(this);

      // Additional focus management after modal opens
      setTimeout(() => {
        if (typeof document !== 'undefined') {
          // Force focus on Razorpay iframe and inputs
          const razorpayFrame = document.querySelector(
            'iframe[name="razorpay-checkout"]'
          ) as HTMLIFrameElement;
          if (razorpayFrame) {
            try {
              razorpayFrame.focus();
              // Try to access iframe content if same-origin
              const iframeDoc =
                razorpayFrame.contentDocument ||
                razorpayFrame.contentWindow?.document;
              if (iframeDoc) {
                const firstInput = iframeDoc.querySelector(
                  'input[type="text"], input[type="tel"]'
                ) as HTMLInputElement;
                if (firstInput) {
                  firstInput.focus();
                  firstInput.click();
                }
              }
            } catch (e) {
              console.log('Cannot access iframe content (cross-origin)');
            }
          }

          // Remove any focus locks that might interfere
          document
            .querySelectorAll('[data-focus-lock-disabled]')
            .forEach((el) => {
              el.removeAttribute('data-focus-lock-disabled');
            });
        }
      }, 500);

      return result;
    };

    return razorpay;
  }

  return {
    initializePayment,
    isLoaded,
  };
};

export default useRazorpay;
