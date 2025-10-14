'use client';
import React from 'react';
import { useAppSelector } from '@/store';
import { useHydrated } from 'react-hydration-provider';
import LoginForm from './LoginForm';
import { Box } from '@chakra-ui/react';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const authState = useAppSelector((state) => state.auth);
  const isHydrated = useHydrated();

  // Show nothing while hydrating to prevent flash
  if (!isHydrated) {
    return null;
  }

  // If user is not authenticated, show login form
  if (!authState.authState || !authState.currentToken) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
        bg="content.bg"
      >
        <LoginForm />
      </Box>
    );
  }

  // If user is authenticated, show the protected content
  return <>{children}</>;
};

export default AuthGuard;
