import {
  Box,
  Button,
  Flex,
  VStack,
  HStack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import useCreateSubscription from '@/hooks/plans/useCreateSubscription';
import Image from 'next/image';
import useUserPlanDetails from '@/hooks/user/useUserPlanDetails';
import { planColorMap, planFeaturesMap } from '@/utils/plan-features';
import { UpgradePlanModal } from './UpgradePlanModal';
// import useVerifyPayment from '@/hooks/plans/useVerifyPayment';
// import useRazorpay from '@/hooks/razorpay/useRazorpay';

type SubscriptionModalProps = {
  onClose: () => void;
};

export default function SubscriptionModal({ onClose }: SubscriptionModalProps) {
  const [promoCode, setPromoCode] = useState('');
  const { isOpen, onOpen, onClose: onModalClose } = useDisclosure();
  // const { verifyPayment, loading: verifyPaymentLoading } = useVerifyPayment();
  const toast = useToast();
  // const { initializePayment } = useRazorpay();
  const handleClose = () => {
    onModalClose();
  };

  const {
    subscription,
    getUserPlanDetails,
    loading: getSubscriptionLoading,
  } = useUserPlanDetails();
  const { createSubscription, loading: createSubscriptionLoading } =
    useCreateSubscription();

  useEffect(() => {
    async function getDetails() {
      try {
        await getUserPlanDetails();
      } catch (err) {
        console.error(err);
      }
    }
    getDetails();
  }, [getUserPlanDetails]);

  // const handleClick = async (planId: string) => {
  //   toast({
  //     title: 'Opening Razorpay Payment Gateway',
  //     status: 'info',
  //     duration: 3000,
  //     isClosable: true,
  //   });
  //   try {
  //     const res = await createSubscription(planId);
  //     if (res) {
  //       const opts = {
  //         subscription_id: res.subscription.id,
  //         handler: async function (response: any) {
  //           await verifyPayment({
  //             razorpay_payment_id: response.razorpay_payment_id,
  //             razorpay_subscription_id: response.razorpay_subscription_id,
  //             razorpay_signature: response.razorpay_signature,
  //           });
  //         },
  //         prefill: {
  //           name: res.user.name,
  //           email: res.user.email,
  //           contact: res.user.phone,
  //         },
  //         notes: {
  //           user_id: res.user._id,
  //           user_email: res.user.email,
  //           user_full_name: res.user.name,
  //           plan_id: planId,
  //         },
  //       };

  //       const rzp = initializePayment(opts);

  //       // Close modal
  //       onClose();

  //       // Open Razorpay
  //       rzp.open();
  //     }
  //   } catch (err: any) {
  //     console.error(err);
  //   }
  // };

  const planFeatures = planFeaturesMap.get(
    subscription?.name || 'free'
  ) as string[];

  const planColor = planColorMap.get(subscription?.name || 'free');

  if (getSubscriptionLoading) {
    return <div>Fetching details...</div>;
  }

  return (
    <Box>
      <Flex
        bg="white"
        p={2}
        borderRadius="md"
        width="100%"
        justifyContent={'space-between'}
      >
        <Box flex={1}>
          <VStack align="stretch" spacing={4}>
            <Text fontSize="3xl" fontWeight="bold">
              Current Active Plan
            </Text>
            <Box bg={planColor} borderRadius="lg" p={6}>
              <Text
                bgGradient="linear(to-b, #000000, #999999)"
                bgClip="text"
                fontSize="3xl"
                fontWeight="bold"
              >
                {subscription ? subscription?.segment : 'Free'}
              </Text>
              <Text fontSize="xl" fontWeight="bold" color="#6C6C6C">
                {subscription && subscription.price
                  ? `₹${subscription?.price.toString()}`
                  : null}
              </Text>
              <Text fontSize="sm" color="gray.500" mt={3}>
                Per month for a single account
              </Text>
            </Box>
            {subscription?.name === 'free' ? null : (
              <Text fontSize="sm" color="gray.600">
                {subscription?.remainingDays === 0 ? (
                  <> Plan expired. Renew now</>
                ) : (
                  <>
                    {Math.floor(subscription?.remainingDays || 0)} days
                    remaining to renew
                  </>
                )}
              </Text>
            )}
            <Button onClick={onOpen} colorScheme="purple" size="sm" width="60%">
              Upgrade Plan
            </Button>
          </VStack>
        </Box>
        <Box flex={1} pl={8}>
          <Text fontSize="3xl" fontWeight="bold" mb={4}>
            And you get:
          </Text>
          <Box height="200px" overflowY="auto">
            <VStack align="start" spacing={3}>
              {planFeatures.map((feature: string, index: number) => (
                <HStack key={index}>
                  <Image
                    src="/green-check.svg"
                    alt="Green check"
                    width={20}
                    height={20}
                  />
                  <Text>{feature}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        </Box>
      </Flex>
      <UpgradePlanModal
        currentPlan={subscription?.name || 'free'}
        isOpen={isOpen}
        handleClose={onModalClose}
        // handleClick={handleClick}
      />
    </Box>
  );
}
