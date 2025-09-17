import React, { FormEvent, useState } from 'react';
import {
  Box,
  Button,
  HStack,
  PinInput,
  PinInputField,
  Text,
  VStack,
} from '@chakra-ui/react';

interface OTPVerificationProps {
  onVerify: (otp: string) => void;
  loading: boolean;
}

function OTPVerification({ loading, onVerify }: OTPVerificationProps) {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onVerify(otp);
  };

  return (
    <Box>
      <Text mb={4}>{'Enter the verification code sent to your email.'}</Text>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <HStack>
            <PinInput autoFocus otp value={otp} onChange={setOtp}>
              <PinInputField bg="#C4C3FB" border="none" borderRadius="xl" />
              <PinInputField bg="#C4C3FB" border="none" borderRadius="xl" />
              <PinInputField bg="#C4C3FB" border="none" borderRadius="xl" />
              <PinInputField bg="#C4C3FB" border="none" borderRadius="xl" />
            </PinInput>
          </HStack>
          <Button
            width="80%"
            colorScheme="purple"
            type="submit"
            isDisabled={otp.length !== 4}
            borderRadius="3xl"
            loadingText="Verifying..."
            isLoading={loading}
          >
            {'Verify'}
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default OTPVerification;
