import React, { useEffect } from 'react';
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
  useToast,
  Tooltip,
  Progress,
  SlideFade,
} from '@chakra-ui/react';
import { RxEyeOpen, RxEyeClosed } from 'react-icons/rx';
import { signupValidationSchema } from '../validations/signup-validations';
import useSignup from '@/hooks/auth/useSignup';
import OTPVerification from './OTPVerification';
import useVerifyEmail from '@/hooks/auth/useVerifyEmail';
import useLogin from '@/hooks/auth/useLogin';

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const OTP_TIME_LIMIT_MS = 60000;

const initialValues: FormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const FORM_FIELDS = [
  {
    name: 'name' as const,
    type: 'text',
    placeholder: 'Full Name',
    tooltip: 'Enter your full name as it appears on your ID.',
  },
  {
    name: 'email' as const,
    type: 'email',
    placeholder: 'Email',
    tooltip: 'Enter a valid email address.',
  },
  {
    name: 'password' as const,
    type: 'password',
    placeholder: 'Password',
    tooltip: 'Choose a strong password with at least 8 characters.',
  },
  {
    name: 'confirmPassword' as const,
    type: 'password',
    placeholder: 'Confirm password',
    tooltip: 'Re-enter your password to confirm.',
  },
];

const SignUpForm: React.FC = () => {
  const { loading, signup } = useSignup();
  const { loading: verifyLoading, verifyEmail } = useVerifyEmail();
  const { login } = useLogin();
  const toast = useToast();
  const [email, setEmail] = React.useState<string | null>(null);
  const [password, setPassword] = React.useState<string>('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [showOTPVerification, setShowOTPVerification] = React.useState(false);
  const [otpTimeout, setOTPTimeout] = React.useState<NodeJS.Timeout | null>(
    null
  );

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
  }, [showOTPVerification, otpTimeout]);

  const validate = (values: FormValues) => {
    try {
      signupValidationSchema.parse(values);
      return {};
    } catch (error: any) {
      return error.formErrors.fieldErrors;
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const success = await signup(values.name, values.email, values.password);
      if (success) {
        setEmail(values.email);
        setPassword(values.password);
        setShowOTPVerification(true);
      }
    } catch (err: any) {
      toast({
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleOTPVerify = async (otp: string) => {
    try {
      const success = await verifyEmail({
        email: email as string,
        otp,
      });

      if (success) {
        await login(email as string, password);
      }
    } catch (err: any) {
      toast({
        title: 'Something went wrong!',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (showOTPVerification) {
    return (
      <OTPVerification onVerify={handleOTPVerify} loading={verifyLoading} />
    );
  }

  return (
    <Box>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form>
            <VStack spacing={3}>
              <Progress
                value={
                  (formik.values.name ? 25 : 0) +
                  (formik.values.email ? 25 : 0) +
                  (formik.values.password ? 25 : 0) +
                  (formik.values.confirmPassword ? 25 : 0)
                }
                size="sm"
                colorScheme="purple"
                width="100%"
                borderRadius="3xl"
              />
              {FORM_FIELDS.map((field, index) => (
                <Box key={index} width="100%">
                  <InputGroup size="sm">
                    <Field name={field.name}>
                      {({
                        field: fieldProps,
                      }: {
                        field: FieldInputProps<string>;
                      }) => (
                        // <Tooltip label={field.tooltip} fontSize="md">
                        <Input
                          {...fieldProps}
                          type={
                            (field.name === 'password' && showPassword) ||
                            (field.name === 'confirmPassword' &&
                              showConfirmPassword)
                              ? 'text'
                              : field.type
                          }
                          placeholder={field.placeholder}
                          bg="#C4C3FB"
                          border="none"
                          borderRadius="3xl"
                          _focus={{ boxShadow: 'outline' }}
                          height="32px"
                          fontSize="sm"
                          pr={
                            field.name === 'password' ||
                            field.name === 'confirmPassword'
                              ? '2.5rem'
                              : undefined
                          }
                        />
                        // </Tooltip>
                      )}
                    </Field>
                    {(field.name === 'password' ||
                      field.name === 'confirmPassword') && (
                      <InputRightElement width="2.5rem" height="32px">
                        <Button
                          h="26px"
                          w="26px"
                          size="xs"
                          onClick={() =>
                            field.name === 'password'
                              ? setShowPassword((prev) => !prev)
                              : setShowConfirmPassword((prev) => !prev)
                          }
                          bg="transparent"
                          _hover={{ bg: 'transparent' }}
                          p={0}
                          minW="auto"
                        >
                          <Icon
                            as={
                              (field.name === 'password' && showPassword) ||
                              (field.name === 'confirmPassword' &&
                                showConfirmPassword)
                                ? RxEyeOpen
                                : RxEyeClosed
                            }
                            color="gray.500"
                            boxSize="16px"
                          />
                        </Button>
                      </InputRightElement>
                    )}
                  </InputGroup>
                  <ErrorMessage name={field.name}>
                    {(msg: string) => (
                      <SlideFade in={!!msg} offsetY="20px">
                        <Text color="red.500" fontSize="xs" mt={1}>
                          {msg}
                        </Text>
                      </SlideFade>
                    )}
                  </ErrorMessage>
                </Box>
              ))}
              <Button
                width="80%"
                mt={2}
                colorScheme="purple"
                isLoading={loading}
                loadingText="Signing up..."
                type="submit"
                disabled={!formik.isValid}
                borderRadius="3xl"
              >
                {'Proceed'}
              </Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default SignUpForm;
