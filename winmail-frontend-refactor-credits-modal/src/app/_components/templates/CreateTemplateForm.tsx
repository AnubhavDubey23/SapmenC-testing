import { Box, Button, Input, Textarea, Center } from '@chakra-ui/react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { addsegmentValidationSchema } from '../validations/segments.validation';
import { useAppDispatch } from '@/store';
import { setActivesegment } from '@/store/features/selected-segment/selected-segment-slice';
import { setActiveTemplate } from '@/store/features/selected-template/selected-template-slice';
import { setActiveTabState } from '@/store/features/active-tab/active-tab-slice';
import useTemplates from '@/hooks/template/useTemplates';
import { TTemplate } from '@/types/template.types';
import useCreateTemplate from '@/hooks/template/useCreateTemplate';

type Props = {
  onClose: () => void;
};

const CreateTemplateForm = ({ onClose }: Props) => {
  const { loading, createTemplate } = useCreateTemplate();
  const { getAllTemplates } = useTemplates();

  const dispatch = useAppDispatch();
  const initialValues = {
    name: '',
    description: '',
    email_data: {
      root: {
        type: 'EmailLayout',
        data: {
          backdropColor: '#F2F5F7',
          canvasColor: '#FFFFFF',
          textColor: '#242424',
          fontFamily: 'MODERN_SANS',
          childrenIds: [],
        },
      },
    },
    subject: 'New Subject',
  };

  const FORM_FIELDS = [
    {
      name: 'name',
      type: 'text',
      segment: 'Name',
      placeholder: 'Enter Template Name',
      bgColor: 'white',
      required: true,
      border: '1px solid text.dark',
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
    try {
      let body: Partial<TTemplate> = {
        name: values.name as string,
        description: values.description as string,
        subject: values.subject as string,
        email_data: values.email_data as object,
      };
      const res: TTemplate | undefined = await createTemplate(body);
      await getAllTemplates();
      if (res) {
        values.name = '';
        values.description = '';
        values.email_data = initialValues.email_data;
        values.subject = 'New Subject';
        dispatch(
          setActiveTemplate({
            created_by: res.created_by,
            createdAt: res.createdAt,
            description: res.description,
            email_data: res.email_data,
            name: res.name,
            subject: res.subject,
            updatedAt: res.updatedAt,
            updated_by: res.updated_by,
            is_active: res.is_active,
            templateId: res._id,
            is_triggered: res.is_triggered,
            stats: res.stats,
            segments_used: res.segments_used,
          })
        );
        dispatch(
          setActivesegment({
            segmentId: '',
            name: '',
            description: '',
            created_by: {
              name: '',
              email: '',
            },
            updated_by: {
              name: '',
              email: '',
            },
            is_active: false,
            createdAt: '',
            updatedAt: '',
            recipients: [],
          })
        );
        dispatch(
          setActiveTabState({
            tabIndex: 0,
          })
        );
        onClose && onClose();
      }
    } catch (err: any) {
      console.error(err);
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
            {FORM_FIELDS.map((field, index) => {
              return (
                <Box key={index} border={field.border}>
                  <Field
                    as={field.type === 'textarea' ? Textarea : Input} // Use Textarea if field type is textarea
                    autoFocus={index === 0}
                    id={field.name}
                    type={field.type === 'textarea' ? 'text' : field.type} // Set type to text for Textarea
                    name={field.name}
                    placeholder={field.placeholder}
                  />
                  <ErrorMessage name={field.name} component="div" />
                </Box>
              );
            })}
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
    </div>
  );
};

export default CreateTemplateForm;
