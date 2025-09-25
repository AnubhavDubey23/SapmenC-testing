import { Box, Button, Input, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldInputProps } from 'formik';
import { OTP_TIME_LIMIT_MS } from './common';
import useResetPassword from '@/hooks/auth/useResetPassword';
import useForgotPassword from '@/hooks/auth/useForgotPassword';
import useVerifyOTP from '@/hooks/auth/useVerifyOTP';

type Props = {
  onClose: () => void;
};

interface ForgotPasswordFormValues {
  email: string;
}

interface VerifyOTPPayload {
  email: string;
  otp: string;
}

interface ResetPasswordPayload {
  email: string;
  newPassword: string;
  reEnterPassword: string;
}

const initialValuesForForgotPassword: ForgotPasswordFormValues = {
  email: '',
};

const initialValuesForOTP: VerifyOTPPayload = {
  email: '',
  otp: '',
};

const initialValuesForResetPassword: ResetPasswordPayload = {
  email: '',
  newPassword: '',
  reEnterPassword: '',
};

const ForgotPassword = (props: Props) => {
  const { onClose } = props;
  const toast = useToast();
  const [email, setEmail] = useState<string>('');
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [timeLeft, setTimeLeft] = useState(OTP_TIME_LIMIT_MS / 1000);
  const [showSendEmailBtn, setShowSendEmailBtn] = useState(true);
  const [showResetPasswordSection, setShowResetPasswordSection] =
    useState(false);
  const [otpTimeout, setOTPTimeout] = useState<NodeJS.Timeout | null>(null);

  const { loading: forgotPasswordLoading, forgotPassword } =
    useForgotPassword();

  const { loading: resetPasswordLoading, resetPassword } = useResetPassword();

  const { loading: otpVerifyingLoading, verifyOTP } = useVerifyOTP();

  useEffect(() => {
    if (showOtpSection) {
      const timeout = setTimeout(() => {
        setShowOtpSection(false);
        setShowSendEmailBtn(true);
      }, OTP_TIME_LIMIT_MS);
      setOTPTimeout(timeout);

      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearTimeout(timeout);
        clearInterval(interval);
        setTimeLeft(OTP_TIME_LIMIT_MS / 1000);
      };
    }
  }, [showOtpSection]);

  return (
    <Box>
      {/* Email Form */}
      {showSendEmailBtn && (
        <Formik
          initialValues={initialValuesForForgotPassword}
          onSubmit={async (values) => {
            // Handle email submission here
            const res = await forgotPassword(values);
            if (!res) {
              return;
            }
            setEmail(values.email);
            setShowOtpSection(true);
            setShowSendEmailBtn(false);
          }}
        >
          <Form>
            <Field name="email">
              {({ field }: { field: FieldInputProps<string> }) => (
                <Box>
                  <label htmlFor="email">Email</label>
                  <Input type="email" {...field} />
                </Box>
              )}
            </Field>
            <ErrorMessage name="email" component="div" />
            <Box display="flex" justifyContent="center" width="100%" mt={4}>
              <Button
                type="submit"
                bg="#0C9100"
                color="white"
                _hover={{ bg: '#0C9100' }}
                borderRadius="xl"
                width={'200px'}
                isLoading={forgotPasswordLoading}
              >
                {'Verify'}
              </Button>
            </Box>
          </Form>
        </Formik>
      )}

      {/* OTP Form */}
      {showOtpSection && !showResetPasswordSection && (
        <Formik
          initialValues={initialValuesForOTP}
          onSubmit={async (values) => {
            // Handle OTP verification here

            values.email = email;
            const res = await verifyOTP(values);
            if (!res) {
              return;
            }
            setShowResetPasswordSection(true);
          }}
        >
          <Form>
            <Field name="otp">
              {({ field }: { field: FieldInputProps<string> }) => (
                <Box>
                  <label htmlFor="otp">OTP {`(${timeLeft} s)`}</label>
                  <Input type="text" {...field} maxLength={4} minLength={4} />
                </Box>
              )}
            </Field>
            <ErrorMessage name="otp" component="div" />
            <Box display="flex" justifyContent="center" width="100%" mt={4}>
              <Button
                type="submit"
                bg="#0C9100"
                color="white"
                _hover={{ bg: '#0C9100' }}
                borderRadius="xl"
                width={'200px'}
                isLoading={otpVerifyingLoading}
              >
                {'Verify OTP'}
              </Button>
            </Box>
          </Form>
        </Formik>
      )}

      {/* Reset Password Form */}
      {showResetPasswordSection && (
        <Formik
          initialValues={initialValuesForResetPassword}
          onSubmit={async (values) => {
            if (values.newPassword !== values.reEnterPassword) {
              toast({
                title: 'Passwords don\'t match',
                status: 'error',
                duration: 3000,
              });
              return;
            }
            values.email = email;
            // Handle password reset here
            values.email = email;

            const res = await resetPassword(values);
            if (!res) {
              return;
            }

            onClose();
          }}
        >
          <Form>
            <Field name="newPassword">
              {({ field }: { field: FieldInputProps<string> }) => (
                <Box>
                  <label htmlFor="newPassword">New Password</label>
                  <Input type="password" {...field} />
                </Box>
              )}
            </Field>
            <Field name="reEnterPassword">
              {({ field }: { field: FieldInputProps<string> }) => (
                <Box>
                  <label htmlFor="reEnterPassword">Re-enter Password</label>
                  <Input type="password" {...field} />
                </Box>
              )}
            </Field>
            <Box display="flex" justifyContent="center" width="100%" mt={4}>
              <Button
                type="submit"
                bg="#0C9100"
                color="white"
                _hover={{ bg: '#0C9100' }}
                borderRadius="xl"
                width={'200px'}
                isLoading={resetPasswordLoading}
              >
                {'Reset Password'}
              </Button>
            </Box>
          </Form>
        </Formik>
      )}
    </Box>
  );
};

export default ForgotPassword;
