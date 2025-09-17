import React, { useState } from 'react';
import { Plan } from './Plan';
import { allPlans, filterPlans, planFeaturesMap } from '@/utils/plan-features';
import { Flex, useDisclosure } from '@chakra-ui/react';
import { EnterprisePlan } from './EnterprisePlan';
import { Cart } from './Cart';

interface PlansProps {
  plans: any[];
  currentPlan: string;
  // handleClick: (planId: string) => void;
  onRazorpayOpen?: () => void; // Add this
  onRazorpayClose?: () => void; // Add this
}

export function Plans({ plans, currentPlan, onRazorpayOpen, onRazorpayClose }: PlansProps) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  // const [isRazorpayOpenLocal, setIsRazorpayOpenLocal] = useState(false);

  // console.log('Plans modal - isOpen:', isOpen, 'isRazorpayOpen:', isRazorpayOpenLocal);


  const handlePlanClick = (plan: any) => {
    console.log('Plan clicked:', plan.item.name);
    setSelectedPlan(plan);
    onOpen();
  };

  const handleRazorpayOpen = () => {
    console.log('Razorpay opening - closing cart modal');
    if (isOpen) onClose(); // Only close if modal is open
    // setIsRazorpayOpenLocal(true);
    onRazorpayOpen?.();
  };

  const handleRazorpayClose = () => {
    console.log('Razorpay closed');
    // setIsRazorpayOpenLocal(false);
    onRazorpayClose?.();
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
        <Cart
          plan={selectedPlan}
          isOpen={isOpen} // Don't show cart when Razorpay is open
          // onClick={handleClick}
          onClose={onClose}
          onRazorpayOpen={handleRazorpayOpen}
          onRazorpayClose={handleRazorpayClose}
        />
      )}
    </>
  );
}
