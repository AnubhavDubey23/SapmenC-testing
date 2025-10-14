import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAppSelector } from '@/store';
import PAYMENT_API_ENPOINTS from '@/api/payment.api';
import { TApiResponse } from '@/types/api.types';

interface HybridPaymentVerificationData {
  // Order-based payment data (from enhanced UI)
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  // Additional subscription context
  subscription_id?: string;
  plan_id?: string;
}

const useVerifyHybridPayment = () => {
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const authState = useAppSelector((state) => state.auth);

  const verifyHybridPayment = async (
    paymentData: HybridPaymentVerificationData,
    authToken?: string
  ) => {
    setLoading(true);
    try {
      const res = await fetch(PAYMENT_API_ENPOINTS.VERIFY_HYBRID_SUBSCRIPTION, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken || authState.currentToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const data: TApiResponse<{
        verified: boolean;
        subscription: any;
        order: any;
        message: string;
      }> = await res.json();

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
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, verifyHybridPayment };
};

export default useVerifyHybridPayment;
