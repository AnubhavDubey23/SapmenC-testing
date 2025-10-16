'use client';
import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  Card,
  CardBody,
} from '@chakra-ui/react';
import useLogin from '@/hooks/auth/useLogin';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const result = await login(email, password);
      if (result && result.status === 403) {
        setError(result.message);
      }
    } catch (error: any) {
      setError(error.message || 'Login failed');
    }
  };

  return (
    <Card maxW="md" w="full" mx="auto">
      <CardBody>
        <VStack spacing={6}>
          <Box textAlign="center">
            <Heading size="lg" color="primary.dark">
              Welcome to MailerOne
            </Heading>
            <Text color="text.light" mt={2}>
              Please sign in to continue
            </Text>
          </Box>

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Box w="full">
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel color="text.dark">Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    focusBorderColor="primary.dark"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="text.dark">Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    focusBorderColor="primary.dark"
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="purple"
                  bg="primary.dark"
                  _hover={{ bg: 'primary.light' }}
                  size="lg"
                  w="full"
                  isLoading={loading}
                  loadingText="Signing in..."
                >
                  Sign In
                </Button>
              </VStack>
            </form>
          </Box>

          <Text fontSize="sm" color="text.light" textAlign="center">
            Don&apos;t have an account?{' '}
            <Text as="span" color="primary.dark" cursor="pointer">
              Contact support
            </Text>
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default LoginForm;
