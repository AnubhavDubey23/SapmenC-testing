import React,{useState} from 'react';
import GlobalModalWrapper from '../modals/GlobalModalWrapper';
import { Box, Flex } from '@chakra-ui/react';
import { Plans } from './Plans';
import usePlans from '@/hooks/plans/usePlans';
import Loader from '../loaders/Loader';

interface UpgradePlanModalProps {
  isOpen: boolean;
  handleClose: () => void;
  // handleClick: (planId: string) => void;
  currentPlan: string;
  // onRazorpayOpen: () => void; 
}

export function UpgradePlanModal({
  isOpen,
  handleClose,
  // handleClick,
  currentPlan,
  // onRazorpayOpen,
}: UpgradePlanModalProps) {
  const { plans, loading: plansLoading } = usePlans();
  // const [isRazorpayOpen, setIsRazorpayOpen] = useState(false);

  // const handleRazorpayOpen = () => {
  //   setIsRazorpayOpen(true);
  //   handleClose(); // Close the parent modal when Razorpay opens
  // };

  // const handleRazorpayClose = () => {
  //   setIsRazorpayOpen(false);
  // };

  return (
    <GlobalModalWrapper
      isOpen={isOpen} // Don't show when Razorpay is open
      onClose={handleClose}
      title="Upgrade Your Plan"
      size="full"
    >
      <Box>
        <Flex justifyContent="center">
          {plansLoading && <Loader />}

          {!plansLoading && (
            <Plans
              plans={plans}
              // handleClick={handleClick}
              currentPlan={currentPlan}
              // onRazorpayOpen={handleRazorpayOpen}
              // onRazorpayClose={handleRazorpayClose}
              // onRazorpayOpen={onRazorpayOpen} 
            />
          )}
        </Flex>
      </Box>
    </GlobalModalWrapper>
  );
}
