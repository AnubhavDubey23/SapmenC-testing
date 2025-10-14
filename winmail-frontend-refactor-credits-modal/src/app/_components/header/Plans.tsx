import React, { useState } from 'react';
import { Plan } from './Plan';
import { allPlans, filterPlans, planFeaturesMap } from '@/utils/plan-features';
import { Flex, useDisclosure } from '@chakra-ui/react';
import { usePayment } from '@/contexts/PaymentContext';
import { EnterprisePlan } from './EnterprisePlan';
import { Cart } from './Cart';

interface PlansProps {
  plans: any[];
  currentPlan: string;
  // handleClick: (planId: string) => void;
}

export function Plans({ plans, currentPlan }: PlansProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  // const [isRazorpayOpenLocal, setIsRazorpayOpenLocal] = useState(false);

  // console.log('Plans modal - isOpen:', isOpen, 'isRazorpayOpen:', isRazorpayOpenLocal);

  const handlePlanClick = (plan: any) => {
    // Plan selected for purchase
    setSelectedPlan(plan);
    onOpen();
  };

  const { openPaymentModal, closePaymentModal } = usePayment();

  const handleRazorpayOpen = () => {
    // Razorpay opening - closing cart modal
    if (isOpen) onClose(); // Close the cart modal
    openPaymentModal(); // Signal that Razorpay is opening
  };

  const handleRazorpayClose = () => {
    // Razorpay payment modal closed
    closePaymentModal(); // Signal that Razorpay is closed
  };

  const plansToDisplay = filterPlans(currentPlan);
  if (!plansToDisplay) {
    return allPlans;
  }

  const renderPlans = (plans || []).filter((plan) => {
    const planName = plan?.item?.name?.toLowerCase?.();
    return planName && plansToDisplay.includes(planName);
  });

  const maxPoints = Math.max(
    ...plans.map((plan) => {
      const features = planFeaturesMap.get(plan.item.name);
      const planPoints = features?.length || 10;
      return planPoints;
    })
  );

  if (plans.length === 0) {
    return <div>No plans currently</div>;
  }

  return (
    <>
      <Flex gap={4} alignItems={'center'} justifyContent={'space-between'}>
        {renderPlans.map((plan, idx) => (
          <Plan
            key={plan.id}
            plan={plan}
            maxPoints={maxPoints}
            index={idx}
            handleClick={() => handlePlanClick(plan)}
          />
        ))}
        <EnterprisePlan maxPoints={maxPoints} />
      </Flex>
      {selectedPlan && (
        <Cart plan={selectedPlan} isOpen={isOpen} onClose={onClose} />
      )}
    </>
  );
}
