import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import Image from 'next/image';
import {
  FREE_TIER_EMAIL,
  FREE_TIER_FORM_FIELDS,
  FREE_TIER_HOST,
  FREE_TIER_MAIL_SERVICE,
} from '@/utils/plans';
import Reference from '@/assets/images/settings-reference.svg';
import { UpgradePlanModal } from '../header/UpgradePlanModal';
import useCreateSubscription from '@/hooks/plans/useCreateSubscription';
import { UserNodemailerConfigDTO } from '@/types/config.types';
import { z } from 'zod';

interface FreeTierConfigFormProps {
  mailConfig: UserNodemailerConfigDTO;
  validate: (values: UserNodemailerConfigDTO) => void;
  onSubmit: (values: UserNodemailerConfigDTO) => void;
  loading: boolean;
}

const nodemailerConfigValidationSchema = z.object({
  display_name: z
    .string()
    .min(1, 'Display name should be at least 1 character'),
});

export function FreeTierConfigForm({
  mailConfig,
  loading,
  onSubmit,
}: FreeTierConfigFormProps) {
  const [showUpgradePlanModal, setShowUpgradePlanModal] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  const validate = (values: UserNodemailerConfigDTO) => {
    try {
      nodemailerConfigValidationSchema.parse(values);
      return {};
    } catch (error: any) {
      return error.formErrors.fieldErrors;
    }
  };

  const handleReadOnlyFieldClick = () => {
    setShowUpgradePlanModal(true);
  };

  const { createSubscription, loading: createSubscriptionLoading } =
    useCreateSubscription();

  const handleClick = async (planId: string) => {
    try {
      const res = await createSubscription(planId);
      if (res) {
        let rzp_url = res.subscription.short_url;
        window.location.href = rzp_url;
        setShowUpgradePlanModal(false);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  if (showUpgradePlanModal) {
    return (
      <UpgradePlanModal
        isOpen={showUpgradePlanModal}
        handleClose={() => {
          setShowUpgradePlanModal(false);
        }}
        currentPlan="free"
        handleClick={handleClick}
      />
    );
  }

  return (
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

          <FormLabel>Service</FormLabel>
          <Input
            cursor="pointer"
            isReadOnly
            defaultValue={FREE_TIER_MAIL_SERVICE}
            onClick={handleReadOnlyFieldClick}
            bgColor="lightgrey"
            color="grey"
          />

          <FormLabel>Email ID, to send emails</FormLabel>
          <Input
            cursor="pointer"
            isReadOnly
            defaultValue={FREE_TIER_EMAIL}
            bgColor="lightgrey"
            color="grey"
            onClick={handleReadOnlyFieldClick}
          />

          <Formik
            initialValues={mailConfig}
            validate={validate}
            onSubmit={(values) => {
              const config: UserNodemailerConfigDTO = {
                service: FREE_TIER_MAIL_SERVICE,
                auth: {
                  user: FREE_TIER_EMAIL,
                  pass: '',
                },
                reply_to: '',
                display_name: values.display_name,
                host: FREE_TIER_HOST,
              };
              onSubmit(config);
            }}
            enableReinitialize={true}
          >
            {({ isValid }) => (
              <Form>
                <VStack spacing={4} align="start">
                  {FREE_TIER_FORM_FIELDS.map((field, index) => (
                    <FormControl key={index} width="100%">
                      <FormLabel htmlFor={field.name}>{field.segment}</FormLabel>
                      <Field
                        as={Input}
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                      />
                      <ErrorMessage name={field.name} component={Text} />
                    </FormControl>
                  ))}
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
                    Save
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
  );
}
