import { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAppDispatch } from '@/store';
import { setAuthState } from '@/store/features/auth/auth-slice';
import AUTH_API_ENPOINTS from '@/api/auth.api';
import { setProductTour } from '@/store/features/product-tour/product-tour-slice';
import { setFilter } from '@/store/features/filter/filter-slice';
import { useSearchParams } from 'next/navigation';
import useCreateHybridSubscription from '../plans/useCreateHybridSubscription';
import useVerifyPayment from '../plans/useVerifyPayment';
import usePaymentLog from '../payment-log/usePaymentLog';
import { TApiResponse } from '@/types/api.types';
import { TUserResponse } from '@/types/user.types';

const useLogin = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { loading: createSubscriptionLoading, createHybridSubscription } =
    useCreateHybridSubscription();
  const { verifyPayment, loading: verifyPaymentLoading } = useVerifyPayment();
  const { createPaymentLog, loading: createPaymentLogLoading } =
    usePaymentLog();
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res: Response = await fetch(AUTH_API_ENPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.status == 403) {
        const data: TApiResponse<TUserResponse> = await res.json();
        toast({
          description: data.message,
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
        // open otp modal

        return {
          status: 403,
          message: data.message,
        };
      }

      const data: TApiResponse<TUserResponse> = await res.json();
      if (!data.status) {
        throw new Error(data.message);
      }

      dispatch(
        setAuthState({
          authState: data.status,
          userId: data.data._id,
          username: data.data.username,
          currentToken: data.data.currentToken,
          userProfile: null,
        })
      );

      dispatch(setFilter('all'));

      toast({
        description: data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      if (!data.data.is_product_tour_seen) {
        dispatch(
          setProductTour({
            isOpen: true,
          })
        );
      }
      // make this api call after a delay of 1 sec
      await new Promise((resolve) => setTimeout(resolve, 200));
      const planId = searchParams.get('planId');
      if (planId) {
        const res = await createHybridSubscription(
          planId,
          data.data.currentToken
        );
        if (res) {
          const razorpay_options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: res.order.amount,
            currency: 'INR',
            order_id: res.order.id,
            handler: async function (response: any) {
              await verifyPayment(
                {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_subscription_id: response.razorpay_subscription_id,
                  razorpay_signature: response.razorpay_signature,
                },
                data.data.currentToken
              );
            },
            prefill: {
              name: res.user.name,
              email: res.user.email,
              contact: res.user.phone,
            },
            notes: {
              plan_id: planId,
            },
          };
          const raozrpay_instance = new window.Razorpay(razorpay_options);
          raozrpay_instance.on(
            'payment.failed',
            async function (response: any) {
              alert(response.error.code);
              alert(response.error.description);
              alert(response.error.source);
              alert(response.error.step);
              alert(response.error.reason);
              alert(response.error.metadata.order_id);
              alert(response.error.metadata.payment_id);
              const payload_for_error = {
                error_code: response.error.code,
                error_description: response.error.description,
                error_source: response.error.source,
                error_step: response.error.step,
                error_reason: response.error.reason,
                order_id: response.error.metadata.order_id,
                payment_id: response.error.metadata.payment_id,
              };

              // call api for capturing error for razorpay payment which is failed
              await createPaymentLog(payload_for_error);
            }
          );
          raozrpay_instance.open();
        } else {
          console.error('Subscription creation failed');
        }
      }
    } catch (error: any) {
      toast({
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return { loading, login };
};
export default useLogin;
