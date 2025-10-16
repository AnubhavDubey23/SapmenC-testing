'use client';
import React, { useCallback, useState, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import * as ExcelJS from 'exceljs';
import {
  Box,
  Button,
  useToast,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Tooltip,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '@/store';
import useUpdatesegment from '@/hooks/segment/useUpdatesegment';
import { setActivesegment } from '@/store/features/selected-segment/selected-segment-slice';
import { IoCloudUpload, IoTrash } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa6';

const validateEmail = (email: string) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};
type FileData = {
  name: string;
  email: string;
};

type Props = {
  onClose: () => void;
  setLoading: (loading: boolean) => void;
};

const ContactImporter = ({ onClose, setLoading }: Props) => {
  const dispatch = useAppDispatch();
  const { loading, updatesegment } = useUpdatesegment();
  const [data, setData] = useState<FileData[]>([]);
  const toast = useToast();

  const selectedsegmentstate = useAppSelector((state) => state.selectedsegment);

  const processFile = async (file: File) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const arrayBuffer = await file.arrayBuffer();
      await workbook.xlsx.load(arrayBuffer);

      const worksheet = workbook.getWorksheet(1);
      const extractedData: FileData[] = [];

      worksheet?.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          // Skip header row
          const name = row.getCell(1).value?.toString() || '';
          const email = row.getCell(2).value?.toString() || '';
          if (name && email) {
            extractedData.push({ name, email });
          }
        }
      });

      setData(extractedData);
      toast({
        title: 'File processed successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to read file',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      processFile(file);
    },
    [processFile]
  );

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    maxSize: 10485760,
    noClick: true,
    noKeyboard: true,
  });

  const handleRemoveEntry = (index: number) => {
    setData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const handleSaveDataTosegmentRecipients = async () => {
    const batchSize = 120;
    const batches = [];

    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }

    try {
      setLoading(true);
      for (const batch of batches) {
        const cleaned = batch.filter((r) => r.name && validateEmail(r.email));
        const body = {
          segmentId: selectedsegmentstate.segmentId,
          recipients: cleaned,
        };
        const res = await updatesegment(body);
        if (!res) {
          throw new Error(
            'Failed to save batch. Possible insufficient credits or backend error.'
          );
        }
        dispatch(
          setActivesegment({
            segmentId: selectedsegmentstate.segmentId,
            name: res.name,
            description: res.description,
            recipients: res.recipients,
            created_by: res.created_by,
            updated_by: res.updated_by,
            is_active: res.is_active,
            createdAt: res.createdAt,
            updatedAt: res.updatedAt,
          })
        );
      }
      onClose();
      toast({
        title: 'Data saved successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (err: any) {
      toast({
        title: 'An error occurred while saving data to segment recipients',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const isInvalidEntry = (entry: FileData) => {
    return !entry.name || !validateEmail(entry.email);
  };

  const scrollToFirstInvalidEntry = () => {
    const index = data.findIndex((entry) => isInvalidEntry(entry));
    if (index !== -1) {
      const element = document.querySelector(`tr:nth-child(${index + 1})`);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const analytics = useMemo(() => {
    const total = data.length;
    const valid = data.filter((entry) => !isInvalidEntry(entry)).length;
    const invalid = total - valid;
    return { total, valid, invalid };
  }, [data]);

  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius={8}
      borderColor="gray.200"
      textAlign="center"
    >
      {data.length === 0 && (
        <>
          <Box
            {...getRootProps()}
            p={4}
            borderWidth={2}
            borderRadius={8}
            borderColor="gray.300"
            borderStyle="dashed"
          >
            <input {...getInputProps()} />
            <Text fontWeight={'bold'} color={'text.dark'}>
              {
                "Drag 'n' drop an Excel or CSV file here, or click to select one"
              }
            </Text>
          </Box>
          <Button
            mt={4}
            onClick={open}
            bgColor="purple.500"
            color={'white'}
            leftIcon={<IoCloudUpload />}
          >
            {'Upload CSV'}
          </Button>
        </>
      )}
      {data.length > 0 && (
        <>
          <VStack spacing={4} mb={4}>
            <HStack spacing={8}>
              <Text>Total Contacts: {analytics.total}</Text>
              <Text color="green.500">Valid Contacts: {analytics.valid}</Text>
              <Text
                color="red.500"
                cursor={'pointer'}
                onClick={scrollToFirstInvalidEntry}
              >
                Invalid Contacts: {analytics.invalid}
              </Text>
            </HStack>
          </VStack>
          <Box color={'text.dark'} mt={4} overflow="auto" maxH="300px">
            <Table variant="simple">
              <Thead position={'sticky'} top={0} bg="gray.100" zIndex={1}>
                <Tr>
                  <Th
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    gap={2}
                  >
                    <Text>Name</Text>
                    <FaUser />
                  </Th>
                  <Th>Email</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.map((entry, index) => (
                  <Tr
                    key={index}
                    bg={isInvalidEntry(entry) ? 'red.100' : 'white'}
                  >
                    <Td>
                      <Tooltip label={!entry.name ? 'Name is missing' : ''}>
                        <span>{entry.name || 'N/A'}</span>
                      </Tooltip>
                    </Td>
                    <Td>
                      <Tooltip
                        label={
                          !validateEmail(entry.email) ? 'Invalid email' : ''
                        }
                      >
                        <span>{entry.email}</span>
                      </Tooltip>
                    </Td>
                    <Td>
                      <IconButton
                        aria-label="Remove entry"
                        icon={<IoTrash />}
                        onClick={() => handleRemoveEntry(index)}
                        colorScheme="red"
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </>
      )}
      {data.length > 0 && (
        <Button
          disabled={loading}
          onClick={handleSaveDataTosegmentRecipients}
          onKeyDown={(e) =>
            e.key === 'Enter' && handleSaveDataTosegmentRecipients()
          }
          mt={4}
          colorScheme="green"
        >
          {loading ? 'Saving...' : 'Save To Segment'}
        </Button>
      )}
    </Box>
  );
};

export default ContactImporter;
