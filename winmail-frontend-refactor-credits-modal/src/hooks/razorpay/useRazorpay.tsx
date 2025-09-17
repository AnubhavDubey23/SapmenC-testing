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

import { useEffect, useState } from "react";
import {
  RazorpayErrorResponse,
  RazorpayPaymentOpts,
} from "@/types/razorpay.types";

const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if already loaded
    if (typeof window !== 'undefined' && window.Razorpay) {
      setIsLoaded(true);
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => setIsLoaded(true));
      return;
    }

    // Add script dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      setIsLoaded(true);
      console.log("Razorpay SDK loaded");
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK");
      setIsLoaded(false);
    };
    document.body.appendChild(script);
  }, []);

  function validateRazorpayOpts(opts: RazorpayPaymentOpts) {
    if (opts.order_id && opts.subscription_id) {
      throw new Error("Cannot specify both order_id and subscription_id");
    }
    if (!opts.order_id && !opts.subscription_id) {
      throw new Error("Must specify either order_id or subscription_id");
    }
    return true;
  }

  function initializePayment(
    opts: Omit<RazorpayPaymentOpts, "key" | "currency">
  ) {
    if (!isLoaded || !window.Razorpay) {
      throw new Error("Razorpay SDK not loaded");
    }

    const razorpay_options: RazorpayPaymentOpts = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      ...opts,
      currency: "INR",
    };

    if (!validateRazorpayOpts(razorpay_options)) {
      throw new Error("Razorpay options not valid");
    }

    const razorpay = new window.Razorpay(razorpay_options);

    razorpay.on("payment.failed", async function (response: RazorpayErrorResponse) {
      console.error("Payment failed:", response);
    });

    return razorpay;
  }

  return {
    initializePayment,
    isLoaded,
  };
};

export default useRazorpay;
