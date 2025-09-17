import React from 'react';
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { addsegmentValidationSchema } from '../validations/segments.validation';
import useCreatesegment from '@/hooks/segment/useCreatesegment';
import { Tsegment } from '@/types/segment.types';

type Props = {
  onClose: () => void;
};

const CreatesegmentForm = ({ onClose }: Props) => {
  const toast = useToast();

  const { loading, createsegment } = useCreatesegment();

  const initialValues = {
    name: '',
    description: '',
  };

  const FORM_FIELDS = [
    {
      name: 'name',
      type: 'text',
      segment: 'Name',
      placeholder: 'Enter your name',
      bgColor: 'white',
      required: true,
      border: '1px solid #262d25',
    },
    {
      name: 'description',
      type: 'text',
      segment: 'Description',
      placeholder: 'Enter description',
      bgColor: 'white',
      required: true,
      border: '1px solid #262d25',
    },
  ];

  const validate = (values: typeof initialValues) => {
    try {
      addsegmentValidationSchema.parse(values);
      return {};
    } catch (error: any) {
      return error.formErrors.fieldErrors;
    }
  };

  const onSubmit = async (values: typeof initialValues) => {
    const res: Tsegment | undefined = await createsegment({
      name: values.name,
      description: values.description,
    });
    if (res) {
      values.name = '';
      values.description = '';

      toast({
        title: 'Segment created.',
        description: `Segment "${res.name}" was created successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose();
    }
  };

  return (
    <Box p={4} bg={'header.bg'} borderRadius="md">
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form>
            {FORM_FIELDS.map((field, index) => (
              <FormControl key={index} mb={4}>
                <FormLabel htmlFor={field.name}>{field.segment}</FormLabel>
                <Field
                  as={Input}
                  autoFocus={index === 0}
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  bg={field.bgColor}
                  border={field.border}
                />
                <ErrorMessage name={field.name} component={Text} />
              </FormControl>
            ))}
            <Center>
              <Button
                mt="6"
                mb="0"
                type="submit"
                isLoading={loading}
                isDisabled={!formik.isValid}
                bgColor="#0C9100"
                color="white"
                borderRadius="xl"
                px="10"
                fontWeight="bold"
              >
                Create
              </Button>
            </Center>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreatesegmentForm;
