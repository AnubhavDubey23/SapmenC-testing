import React, { ChangeEvent, useState } from 'react';
import GlobalModalWrapper from '../modals/GlobalModalWrapper';
import { Input, Button, FormControl, FormLabel } from '@chakra-ui/react';
import useCredits from '@/hooks/credits/useCredits';
import useRazorpay from '@/hooks/razorpay/useRazorpay';
import usePurchaseCredits from '@/hooks/credits/usePurchaseCredits';
import {
  RazorpayPaymentOpts,
  RazorpaySuccessResponse,
} from '@/types/razorpay.types';

interface CreditsInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPaymentModal?: () => void;
}

export function CreditsInputModal({
  isOpen,
  onClose,
  onOpenPaymentModal,
}: CreditsInputModalProps) {
  const { purchaseCredits, loading: purchaseCreditsLoading } =
    usePurchaseCredits();
  const { incrementCredits } = useCredits();
  const { initializePayment } = useRazorpay();
  const [credits, setCredits] = useState(100);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const credits = Number(event.target.value);
    if (isNaN(credits)) {
      // Exit if conversion from string to number is invalid
      return;
    }
    setCredits(credits);
  };

  const handleOnClick = async () => {
    try {
      const res = await purchaseCredits(credits);

      if (res) {
        const opts: Omit<RazorpayPaymentOpts, 'key' | 'currency'> = {
          amount: res.order.amount,
          order_id: res.order.id,
          handler: async function (response: RazorpaySuccessResponse) {
            await incrementCredits({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: res.order.amount,
            });
          },
          prefill: {
            name: res.user.name,
            email: res.user.email,
            contact: res.user.phone,
          },
        };

        const rzp = initializePayment(opts);

        onOpenPaymentModal?.();

        // Open the Razorpay modal
        rzp.open();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <GlobalModalWrapper title="Add Credits" isOpen={isOpen} onClose={onClose}>
      <FormControl>
        <FormLabel>Enter number of credits:</FormLabel>
        <Input
          type="number"
          value={credits}
          onChange={handleInputChange}
          placeholder="Enter credits"
        />
      </FormControl>
      <Button
        colorScheme="purple"
        onClick={handleOnClick}
        mt={4}
        disabled={purchaseCreditsLoading}
      >
        Add Credits
      </Button>
    </GlobalModalWrapper>
  );
}
