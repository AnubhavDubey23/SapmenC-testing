import React, { useEffect, useState } from 'react';
import useLogin from '@/hooks/auth/useLogin';
import { loginValidationSchema } from '../validations/login-validations';
import { Formik, Form, Field, ErrorMessage, FieldInputProps } from 'formik';
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  Icon,
  useDisclosure,
} from '@chakra-ui/react';
import { RxEyeOpen, RxEyeClosed } from 'react-icons/rx';
import OTPVerification from './OTPVerification';
import useVerifyEmail from '@/hooks/auth/useVerifyEmail';
import GlobalModalWrapper from '../modals/GlobalModalWrapper';
import ForgotPassword from './ForgotPassword';
import { OTP_TIME_LIMIT_MS } from './common';

interface FormValues {
  email: string;
  password: string;
}

const FORM_FIELDS = [
  {
    name: 'email',
    type: 'email',
    placeholder: 'Email',
    autoFocus: true,
    required: true,
    borderRadius: '3xl',
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'Password',
    autoFocus: false,
    required: true,
    borderRadius: '3xl',
  },
];

const initialValues: FormValues = {
  email: '',
  password: '',
};

const SignInForm = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { loading, login } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [otpTimeout, setOTPTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (showOTPVerification) {
      const timeout = setTimeout(() => {
        setShowOTPVerification(false);
      }, OTP_TIME_LIMIT_MS);
      setOTPTimeout(timeout);
    }

    return () => {
      if (otpTimeout) {
        clearTimeout(otpTimeout);
      }
    };
  }, [showOTPVerification]);

  const validate = (values: FormValues) => {
    try {
      loginValidationSchema.parse(values);
      return {};
    } catch (error: any) {
      return error.formErrors.fieldErrors;
    }
  };

  const onSubmit = async (values: FormValues) => {
    const res = await login(values.email, values.password);
    if (res?.status === 403) {
      setLoginEmail(values.email);
      setShowOTPVerification(true);
    }
  };

  const { loading: verifyLoading, verifyEmail } = useVerifyEmail();

  const handleOTPVerify = async (otp: string) => {
    try {
      await verifyEmail({
        email: loginEmail,
        otp,
      });
    } catch (err: any) {
      console.error(err);
    }
  };

  if (showOTPVerification) {
    return (
      <OTPVerification onVerify={handleOTPVerify} loading={verifyLoading} />
    );
  }

  return (
    <>
      <GlobalModalWrapper
        title="Forgot Password"
        isOpen={isOpen}
        onClose={onClose}
      >
        <ForgotPassword onClose={onClose} />
      </GlobalModalWrapper>
      <Box>
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={onSubmit}
        >
          {(formik) => (
            <Form>
              <VStack spacing={3}>
                {FORM_FIELDS.map((field, index) => (
                  <Box key={index} width="100%">
                    <InputGroup size="sm">
                      <Field name={field.name}>
                        {({
                          field: fieldProps,
                        }: {
                          field: FieldInputProps<string>;
                        }) => (
                          <Input
                            {...fieldProps}
                            type={
                              field.name === 'password' && showPassword
                                ? 'text'
                                : field.type
                            }
                            height="32px"
                            fontSize="sm"
                            placeholder={field.placeholder}
                            autoFocus={field.autoFocus}
                            bg="#C4C3FB"
                            border="none"
                            pr={field.name === 'password' ? '2rem' : undefined}
                            borderRadius={field.borderRadius}
                            _focus={{ boxShadow: 'outline' }}
                          />
                        )}
                      </Field>
                      {field.name === 'password' && (
                        <InputRightElement width="2.5rem" height="32px">
                          <Button
                            h="26px"
                            w="26px"
                            size="xs"
                            onClick={() => setShowPassword(!showPassword)}
                            bg="transparent"
                            _hover={{ bg: 'transparent' }}
                            p={0}
                            minW="auto"
                          >
                            <Icon
                              as={showPassword ? RxEyeOpen : RxEyeClosed}
                              color="gray.500"
                              boxSize="16px"
                            />
                          </Button>
                        </InputRightElement>
                      )}
                    </InputGroup>
                    <ErrorMessage name={field.name}>
                      {(msg) => (
                        <Text color="red.500" fontSize="xs" mt={1}>
                          {msg}
                        </Text>
                      )}
                    </ErrorMessage>
                  </Box>
                ))}
                <Button
                  width="80%"
                  mt={2}
                  colorScheme="purple"
                  isLoading={loading}
                  loadingText="Logging in..."
                  type="submit"
                  disabled={!formik.isValid}
                  borderRadius={'3xl'}
                >
                  {'Login'}
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
        <Box>
          <Text fontSize="sm" mt={2}>
            Forgot password?{' '}
            <Box onClick={onOpen} as="span" color="purple.500" cursor="pointer">
              {'Reset'}
            </Box>
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default SignInForm;
