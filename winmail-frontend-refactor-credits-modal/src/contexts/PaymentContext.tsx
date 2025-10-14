'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PaymentContextType {
  isPaymentModalOpen: boolean;
  openPaymentModal: () => void;
  closePaymentModal: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  const openPaymentModal = () => setPaymentModalOpen(true);
  const closePaymentModal = () => setPaymentModalOpen(false);

  return (
    <PaymentContext.Provider
      value={{ isPaymentModalOpen, openPaymentModal, closePaymentModal }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
