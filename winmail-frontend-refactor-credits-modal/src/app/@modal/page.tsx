'use client';
import { useAppSelector } from '@/store';
import React from 'react';
import { useHydrated } from 'react-hydration-provider';
import AuthModal from '../_components/modals/AuthModal';
import AuthForm from '../_components/auth/AuthForm';

const Page = () => {
  const isHdrated = useHydrated();
  const authState: boolean = useAppSelector((state) => state.auth.authState);

  if (!isHdrated) return null;
  const handleAuthModalClose = () => {};
  return !authState ? (
    <AuthModal
      isOpen={!authState}
      onClose={handleAuthModalClose}
      key={'auth-modal'}
    >
      <AuthForm key={'auth-form'} />
    </AuthModal>
  ) : null;
};

export default Page;
