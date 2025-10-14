import {
  Flex,
  Input,
  Box,
  Button,
  InputGroup,
  InputRightElement,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, FieldInputProps } from 'formik';
import { IoSearch } from 'react-icons/io5';
import { FaSliders } from 'react-icons/fa6';
import { searchBarValidationSchema } from '../validations/search-bar-validations';
import FilterModal from './FilterModal';
import { setTemplates } from '@/store/features/templates/templates-slice';
import useTemplates from '@/hooks/template/useTemplates';
import { useAppDispatch, useAppSelector } from '@/store';
import usesegments from '@/hooks/segment/usesegments';
import { setsegments } from '@/store/features/segments/segments-slice';

type FormValues = {
  query: string;
};

type Props = {
  module: string;
  placeholder: string;
};

const FORM_FIELDS = [
  {
    name: 'query',
    type: 'text',
    color: 'white',
    border: 'none',
    outline: 'none',
    bgColor: '#8B83EA',
    placeholderColor: 'white',
  },
];

const SearchBar = ({ module, placeholder }: Props) => {
  const toast = useToast();
  const { getAllTemplates } = useTemplates();
  const { getAllsegments } = usesegments();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const searchTerm = useAppSelector((state) => state.search.query);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');
  const [loading, setLoading] = useState(false);
  const currentFilter = useAppSelector((state) => state.filter.currentFilter);
  const initialValues: FormValues = {
    query: '',
  };
  useEffect(() => {
    setLocalSearchTerm(searchTerm || '');
  }, [searchTerm]);

  const validate = (values: typeof initialValues) => {
    try {
      searchBarValidationSchema.parse(values);
      return {};
    } catch (error: any) {
      return error.formErrors.fieldErrors;
    }
  };

  const dispatch = useAppDispatch();

  const onSubmit = async (values: typeof initialValues) => {
    try {
      setLoading(true);
      if (module === 'templates') {
        const allTemplates = await getAllTemplates();
        if (!allTemplates) {
          toast({
            title: "Couldn't fetch templates",
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        let templatesForDisplay = allTemplates;

        if (values.query.trim() !== '') {
          templatesForDisplay = allTemplates.filter((template) =>
            template.name.toLowerCase().includes(values.query.toLowerCase())
          );

          if (templatesForDisplay.length === 0) {
            return toast({
              title: 'No templates found',
              status: 'info',
              duration: 3000,
              isClosable: true,
            });
          }
        }

        dispatch(setTemplates(templatesForDisplay));
      } else {
        // Handle search for segments
        const allsegments = await getAllsegments();
        if (!allsegments) {
          toast({
            title: "Couldn't fetch segments",
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        let segmentsForDisplay = allsegments;

        if (values.query.trim() !== '') {
          segmentsForDisplay = allsegments.filter((segment) =>
            segment.name.toLowerCase().includes(values.query.toLowerCase())
          );

          if (segmentsForDisplay.length === 0) {
            return toast({
              title: 'No segments found',
              status: 'info',
              duration: 3000,
              isClosable: true,
            });
          }
        }

        dispatch(setsegments(segmentsForDisplay));
      }
    } catch (err: any) {
      toast({
        title: 'Error searching templates',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (filter: 'all' | 'draft' | 'sent') => {
    try {
      const allTemplates = await getAllTemplates();
      if (!allTemplates) {
        toast({
          title: "Couldn't filter templates",
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }

      let filteredTemplates = allTemplates;

      if (filter === 'sent') {
        filteredTemplates = allTemplates.filter(
          (template) => template.is_triggered
        );
      } else if (filter === 'draft') {
        filteredTemplates = allTemplates.filter(
          (template) => !template.is_triggered
        );
      }

      if (filteredTemplates.length === 0 && filter !== 'all') {
        toast({
          title: `No ${filter} templates found`,
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
        // Don't update the filter or templates if no matching templates are found
        return false;
      }

      dispatch(setTemplates(filteredTemplates));
      setIsFilterModalOpen(false); // Close the modal after selecting a filter
      return true;
    } catch (err: any) {
      toast({
        title: "Couldn't filter templates",
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
  };

  return (
    <Flex alignItems="center" w="100%">
      <Box flex={1} mr={2}>
        <Formik
          initialValues={{ query: localSearchTerm }}
          validate={validate}
          onSubmit={onSubmit}
          enableReinitialize={true}
        >
          {(formik) => (
            <Form>
              <InputGroup size="md">
                {FORM_FIELDS.map((field, index) => (
                  <Field key={index} name={field.name}>
                    {({
                      field: fieldProps,
                    }: {
                      field: FieldInputProps<string>;
                    }) => (
                      <Input
                        {...fieldProps}
                        type={field.type}
                        placeholder={placeholder}
                        bgColor={field.bgColor}
                        border={field.border}
                        outline={field.outline}
                        color={field.color}
                        _placeholder={{ color: field.placeholderColor }}
                        borderRadius="full"
                        _focus={{ boxShadow: 'none' }}
                        pr="40px"
                        value={localSearchTerm}
                        onChange={(e) => {
                          setLocalSearchTerm(e.target.value);
                        }}
                      />
                    )}
                  </Field>
                ))}
                <InputRightElement>
                  {loading ? (
                    <Spinner size="sm" color="white" />
                  ) : (
                    <Box
                      as="button"
                      type="button"
                      onClick={() => formik.submitForm()}
                    >
                      <IoSearch color="#fff" />
                    </Box>
                  )}
                </InputRightElement>
              </InputGroup>
            </Form>
          )}
        </Formik>
      </Box>
      {module === 'templates' && (
        <>
          <Button
            bg="transparent"
            _hover={{ bg: 'rgba(255,255,255,0.1)' }}
            onClick={() => setIsFilterModalOpen(true)}
            p={0}
          >
            <FaSliders color="#000000" size="20px" />
          </Button>
          <FilterModal
            isOpen={isFilterModalOpen}
            onClose={() => setIsFilterModalOpen(false)}
            onFilter={handleFilter}
            currentFilter={currentFilter}
          />
        </>
      )}
    </Flex>
  );
};

export default SearchBar;
