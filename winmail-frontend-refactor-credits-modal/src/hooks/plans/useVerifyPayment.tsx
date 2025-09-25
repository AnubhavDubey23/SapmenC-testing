import PAYMENT_API_ENPOINTS from '@/api/payment.api';
import { useAppSelector } from '@/store';
import { useToast } from '@chakra-ui/react';
import { useState } from 'react';

export type RazorpayPaymentVerificationBody = {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
};

const useVerifyPayment = () => {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const authState = useAppSelector((state) => state.auth);

  const verifyPayment = async (
    body: RazorpayPaymentVerificationBody,
    authToken?: string
  ) => {
    setLoading(true);
    try {
      const res = await fetch(PAYMENT_API_ENPOINTS.VERIFY_SUBSCRIPTION, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken || authState.currentToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.status) {
        throw new Error(data.message);
      }

      return data.data;
    } catch (err: any) {
      console.error(err);
      toast({
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, verifyPayment };
};

export default useVerifyPayment;
