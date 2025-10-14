import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Flex,
  Text,
  Select,
  useToast,
  useDisclosure,
  Link,
  InputRightElement,
  InputGroup,
} from '@chakra-ui/react';
import Image from 'next/image';
import { nodemailerConfigValidationSchema } from '../validations/mail.validations';
import Reference from '@/assets/images/settings-reference.svg';
import useMe from '@/hooks/auth/useMe';
import SMTPPasswordModal from './SMTPPasswordModal';
import useUserPlanDetails from '@/hooks/user/useUserPlanDetails';
import {
  PAID_TIER_EMAIL_SERVICES,
  PAID_TIER_FORM_FIELDS,
  PAID_TIER_INITIAL_MAIL_CONFIG,
} from '@/utils/plans';
import { FreeTierConfigForm } from './FreeTierConfigForm';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { UserNodemailerConfigDTO } from '@/types/config.types';
import useMailConfig from '@/hooks/config/useMailConfig';

type Props = {
  onClose: () => void;
};

const NodemailerConfigForm = (props: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [mailConfig, setMailConfig] = useState<UserNodemailerConfigDTO>(
    PAID_TIER_INITIAL_MAIL_CONFIG
  );
  const toast = useToast();
  const { loading, updateMailConfig } = useMailConfig();
  const { getUser } = useMe();
  const { subscription, getUserPlanDetails } = useUserPlanDetails();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    async function getMailConfig() {
      setIsLoading(true);
      try {
        const [res, planRes] = await Promise.all([
          getUser(),
          getUserPlanDetails(),
        ]);

        if (!res) {
          toast({
            title: 'Error: Could not get configuration details',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        if (!planRes) {
          toast({
            title: 'Error: Could not get plan details',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        // Ensure all fields have default values to prevent uncontrolled input errors
        const configFromAPI = res.data?.nodemailer_config as
          | UserNodemailerConfigDTO
          | undefined;
        const safeConfig: UserNodemailerConfigDTO = {
          service: configFromAPI?.service || '',
          auth: {
            user: configFromAPI?.auth?.user || '',
            pass: configFromAPI?.auth?.pass || '',
          },
          reply_to: configFromAPI?.reply_to || '',
          display_name: configFromAPI?.display_name || '',
          host: configFromAPI?.host || '',
        };
        setMailConfig(safeConfig);
      } catch (error) {
        console.error('Failed to fetch mail config:', error);
        toast({
          title: 'Failed to load email config',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    }

    getMailConfig();
  }, [getUser, getUserPlanDetails, toast]);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const validate = (values: UserNodemailerConfigDTO) => {
    try {
      nodemailerConfigValidationSchema.parse(values);
      return {};
    } catch (error: any) {
      // Handle validation errors more safely
      if (error?.formErrors?.fieldErrors) {
        return error.formErrors.fieldErrors;
      }
      // Fallback for other error formats
      if (error?.errors) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            fieldErrors[err.path.join('.')] = err.message;
          }
        });
        return fieldErrors;
      }
      return {};
    }
  };

  const onSubmit = async (values: UserNodemailerConfigDTO) => {
    try {
      if (values.service.length === 0) {
        toast({
          title: 'No mail service chosen',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      await updateMailConfig(values);
      const res = await getUser();
      if (res) {
        // Ensure all fields have default values to prevent uncontrolled input errors
        const configFromAPI = res.data?.nodemailer_config as
          | UserNodemailerConfigDTO
          | undefined;
        const safeConfig: UserNodemailerConfigDTO = {
          service: configFromAPI?.service || '',
          auth: {
            user: configFromAPI?.auth?.user || '',
            pass: configFromAPI?.auth?.pass || '',
          },
          reply_to: configFromAPI?.reply_to || '',
          display_name: configFromAPI?.display_name || '',
          host: configFromAPI?.host || '',
        };
        setMailConfig(safeConfig);
        toast({
          title: 'Mail config updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        props.onClose();
      }
    } catch (err) {
      toast({
        title: 'Failed to update email config',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return <Text>{'Loading'}...</Text>;
  }

  if (!subscription) {
    return <Text>{'Loading'}...</Text>;
  }

  if (subscription.segment.toLowerCase() === 'free') {
    return (
      <FreeTierConfigForm
        mailConfig={mailConfig}
        loading={loading}
        onSubmit={onSubmit}
        validate={validate}
      />
    );
  }

  return (
    <>
      <SMTPPasswordModal isOpen={isOpen} onClose={onClose} />
      <Box maxWidth="1200px" width="100%" margin="auto" overflow="hidden">
        <Flex
          direction={['column', 'row']}
          align="start"
          gap={32}
          justify="center"
        >
          <Box ml={8} bg="white" flex={1}>
            <Heading size="xl" mb={4}>
              Configure the following:
            </Heading>
            <Formik
              initialValues={mailConfig}
              validate={validate}
              onSubmit={onSubmit}
              enableReinitialize={true}
            >
              {({ isValid, setFieldValue, values }) => (
                <Form>
                  <VStack spacing={4} align="start">
                    <FormControl width="100%">
                      <FormLabel htmlFor="service">Email Service</FormLabel>
                      <Field name="service">
                        {({ field }: any) => (
                          <Select
                            {...field}
                            id="service"
                            placeholder="Select email service"
                            onChange={(
                              e: React.ChangeEvent<HTMLSelectElement>
                            ) => {
                              setFieldValue('service', e.target.value);
                            }}
                          >
                            {PAID_TIER_EMAIL_SERVICES.map((service) => (
                              <option key={service.id} value={service.value}>
                                {service.name}
                              </option>
                            ))}
                          </Select>
                        )}
                      </Field>
                      <ErrorMessage name="service" component={Text} />
                    </FormControl>
                    {values.service === 'custom' && (
                      <FormControl width="100%">
                        <FormLabel htmlFor="host">SMTP Server Host</FormLabel>
                        <Field
                          as={Input}
                          id="host"
                          name="host"
                          type="text"
                          placeholder="Enter SMTP server host"
                        />
                        <ErrorMessage name="host" component={Text} />
                      </FormControl>
                    )}
                    {PAID_TIER_FORM_FIELDS.map((field, index) => (
                      <FormControl key={index} width="100%">
                        <FormLabel htmlFor={field.name}>
                          {field.segment}
                        </FormLabel>
                        {field.type === 'password' ? (
                          <InputGroup>
                            <Field
                              as={Input}
                              id={field.name}
                              name={field.name}
                              type={showPassword ? 'text' : 'password'}
                              placeholder={field.placeholder}
                            />
                            <InputRightElement width="4.5rem">
                              <Button
                                h="1.75rem"
                                size="sm"
                                onClick={handleTogglePassword}
                              >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                        ) : (
                          <Field
                            as={Input}
                            id={field.name}
                            name={field.name}
                            type={field.type}
                            placeholder={field.placeholder}
                          />
                        )}{' '}
                        <ErrorMessage name={field.name} component={Text} />
                      </FormControl>
                    ))}
                    <Link color="blue.500" onClick={onOpen}>
                      {'Learn how to generate SMTP password'}
                    </Link>
                    <Button
                      type="submit"
                      isLoading={loading}
                      loadingText="Saving"
                      isDisabled={!isValid || loading}
                      bg="#0C9100"
                      color="white"
                      _hover={{ bg: '#0C9100' }}
                      borderRadius="xl"
                      px="10"
                      alignSelf="flex-start"
                    >
                      {'Save'}
                    </Button>
                  </VStack>
                </Form>
              )}
            </Formik>
          </Box>
          <Box mt={[8, 0]} flex={0.8}>
            <Heading size="xl" mb={4}>
              What we mean
            </Heading>
            <Image
              src={Reference}
              alt="Email configuration explanation"
              width={350}
              height={350}
            />
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default NodemailerConfigForm;
