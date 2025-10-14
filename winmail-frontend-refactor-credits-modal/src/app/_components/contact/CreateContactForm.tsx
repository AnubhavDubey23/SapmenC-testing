import useCreateContact from '@/hooks/contact/useCreateContact';
import useMe from '@/hooks/auth/useMe';
import useGetsegment from '@/hooks/segment/useGetsegment';
import {
  useToast,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Box,
} from '@chakra-ui/react';
import React from 'react';
import { createContactValidationSchema } from '../validations/contact.validation';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useAppDispatch, useAppSelector } from '@/store';
import { setActivesegment } from '@/store/features/selected-segment/selected-segment-slice';
import { TContact } from '@/types/contact.types';

type Props = {
  onClose: () => void;
};

const CreateContactForm = ({ onClose }: Props) => {
  const { loading, createContact } = useCreateContact();
  const { refetch } = useGetsegment();
  const toast = useToast();

  const dispatch = useAppDispatch();
  const selectedsegment = useAppSelector((state) => state.selectedsegment);
  const { user } = useMe();

  const initialValues = {
    name: '',
    email: '',
  };

  const FORM_FIELDS = [
    {
      name: 'name',
      type: 'text',
      segment: 'Name',
      placeholder: 'Enter name',
      bgColor: 'white',
      required: true,
      border: '1px solid text.dark',
    },
    {
      name: 'email',
      type: 'email',
      segment: 'Email',
      placeholder: 'Enter email',
      bgColor: 'white',
      required: true,
      border: '1px solid text.dark',
    },
  ];

  const validate = (values: typeof initialValues) => {
    try {
      createContactValidationSchema.parse(values);
      return {};
    } catch (error: any) {
      return error.formErrors.fieldErrors;
    }
  };

  const onSubmit = async (values: typeof initialValues) => {
    try {
      // Frontend guard: block if credits < 0.02
      if (user && typeof user.credits === 'number' && user.credits < 0.02) {
        toast({
          title: 'Insufficient credits',
          description: 'You need at least 0.02 credits to add a contact.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
        return;
      }
      let body = {
        name: values.name,
        email: values.email,
        assigned_segment: selectedsegment.segmentId,
      };
      const res: TContact | undefined = await createContact(body);
      if (res) {
        values.name = '';
        values.email = '';

        // Optimistically update Redux store
        dispatch(
          setActivesegment({
            ...selectedsegment,
            recipients: [...selectedsegment.recipients, res],
          })
        );

        // Refetch from server to ensure data consistency
        await refetch();
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      toast({
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form className="">
            {FORM_FIELDS.map((field, index) => (
              <FormControl key={index} mb={4}>
                <FormLabel htmlFor={field.name} color="purple.500">
                  {field.segment}
                </FormLabel>
                <Field
                  as={Input}
                  autoFocus={index === 0}
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  bg={field.bgColor}
                  border={field.border}
                />
                <ErrorMessage name={field.name}>
                  {(msg) => (
                    <Text color="red.500" fontSize="xs" mt={1}>
                      {msg}
                    </Text>
                  )}
                </ErrorMessage>
              </FormControl>
            ))}
            <Box display="flex" justifyContent="center" width="100%" mt={4}>
              <Button
                type="submit"
                isLoading={loading}
                isDisabled={!formik.isValid || loading}
                colorScheme="purple"
              >
                {'Create Contact'}
              </Button>
            </Box>{' '}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateContactForm;
