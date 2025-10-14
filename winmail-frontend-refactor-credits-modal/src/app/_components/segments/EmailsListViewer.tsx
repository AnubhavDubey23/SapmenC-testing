import { Box, Flex, Text, useToast } from '@chakra-ui/react';
import React from 'react';
import MessageSkeleton from './MessageSkeleton';
import useGetsegment from '@/hooks/segment/useGetsegment';
import {
  ReactGrid,
  Column,
  Row,
  Id,
  MenuOption,
  SelectionMode,
  CellChange,
  TextCell,
} from '@silevis/reactgrid';
import useUpdatesegment from '@/hooks/segment/useUpdatesegment';
import useUpdateContact from '@/hooks/contact/useUpdateContact';
import Loader from '../loaders/Loader';
import { useAppDispatch } from '@/store';
import { setActivesegment } from '@/store/features/selected-segment/selected-segment-slice';
import { TContact } from '@/types/contact.types';

const getColumns = (): Column[] => [
  {
    columnId: 'name',
    width: 400,
  },
  {
    columnId: 'email',
    width: 520,
  },
];

const headerRow: Row = {
  rowId: 'header',
  cells: [
    {
      type: 'header',
      text: 'Name',
    },
    {
      type: 'header',
      text: 'Email',
    },
  ],
};

const getRows = (recipients: TContact[] = []): Row[] => [
  headerRow,
  ...recipients.map<Row>((r, idx) => ({
    rowId: r._id || `temp-${idx}`, // Use actual contact _id or temp ID for new contacts
    cells: [
      {
        type: 'text',
        text: typeof r.name === 'string' ? r.name : '',
        nonEditable: false, // Editable cell for inline editing
      },
      {
        type: 'text', // Changed from "email" to "text" since ReactGrid does not have "email" type
        text: typeof r.email === 'string' ? r.email : '',
        nonEditable: false, // Editable cell for inline editing
      },
    ],
    height: 30,
    reorderable: false,
  })),
];

// Email validation function
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Note: applyChangesToRecipients function removed as we now update contacts individually

interface EmailsListViewerProps {
  recipients: TContact[];
}

const EmailsListViewer = ({ recipients }: EmailsListViewerProps) => {
  const toast = useToast();
  const dispatch = useAppDispatch();

  const { loading, segment, refetch } = useGetsegment();

  const { updatesegment } = useUpdatesegment();
  const { updateContact } = useUpdateContact();

  const rows = getRows(recipients);
  const columns = getColumns();

  const handleCellChanges = async (changes: CellChange[]) => {
    if (!segment) {
      toast({
        title: 'Failed to update contact',
        description: 'segment not found',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      // Process each change individually
      for (const change of changes as CellChange<TextCell>[]) {
        const rowId = change.rowId as string;
        const fieldName = change.columnId as keyof TContact;
        const newValue = change.newCell.text.trim();

        // Validate email format if the field being updated is email
        if (fieldName === 'email' && !isValidEmail(newValue)) {
          toast({
            title: 'Invalid email format',
            description: `"${newValue}" is not a valid email address. Please use a valid format like user@example.com`,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          // Refetch to revert the invalid change in the UI
          await refetch();
          return;
        }

        // Validate that name is not empty
        if (fieldName === 'name' && !newValue) {
          toast({
            title: 'Name cannot be empty',
            description: 'Please enter a valid name for the contact',
            status: 'error',
            duration: 4000,
            isClosable: true,
          });
          // Refetch to revert the invalid change in the UI
          await refetch();
          return;
        }

        // Find the contact by rowId (which is the contact._id)
        const contact = recipients.find((r) => r._id === rowId);
        if (!contact) {
          console.error('Contact not found for rowId:', rowId);
          continue;
        }

        // Update the specific contact
        const updateBody = {
          [fieldName]: newValue,
        };

        const updatedContact = await updateContact(contact._id, updateBody);
        if (!updatedContact) {
          throw new Error(`Failed to update contact ${contact.name}`);
        }
      }

      // Show success message
      toast({
        title: 'Contact updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Refetch the segment data to get the latest state
      await refetch();
    } catch (error: any) {
      toast({
        title: 'Failed to update contact',
        description: error?.message || '',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      // Refetch to revert any partial changes
      await refetch();
    }
  };

  const handleContextMenu = (
    selectedRowIds: Id[],
    selectedColIds: Id[],
    selectionMode: SelectionMode,
    menuOptions: MenuOption[]
  ): MenuOption[] => {
    if (selectionMode === 'row') {
      menuOptions = [
        // ...menuOptions,
        {
          id: 'removePerson',
          label: `Remove recipient${selectedRowIds.length > 1 ? 's' : ''}`,
          handler: async () => {
            if (segment) {
              const updatedRecipients = recipients.filter(
                (recipient) =>
                  !selectedRowIds.includes(
                    recipient._id || `temp-${recipients.indexOf(recipient)}`
                  )
              );
              try {
                const res = await updatesegment({
                  segmentId: segment._id,
                  recipients: updatedRecipients,
                });
                if (res) {
                  toast({
                    title: 'Person removed successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                  });
                  await refetch(); // call refetch to refresh the data
                } else {
                  throw new Error('Update failed');
                }
              } catch (error: any) {
                toast({
                  title: 'Failed to remove person',
                  description: error?.message || '',
                  status: 'error',
                  duration: 3000,
                  isClosable: true,
                });
                // Do NOT update table or state if error
              }
            } else {
              toast({
                title: 'Failed to remove person',
                description: 'segment not found',
                status: 'error',
                duration: 5000,
                isClosable: true,
              });
            }
          },
        },
      ];
    }
    return menuOptions;
  };

  const handleRemoveAllRecipients = async () => {
    try {
      if (segment) {
        const res = await updatesegment({
          segmentId: segment._id,
          recipients: [],
        });
        if (res) {
          toast({
            title: 'All recipients removed successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          refetch(); // call refetch to refresh the data

          dispatch(
            setActivesegment({
              segmentId: segment._id,
              name: segment.name,
              description: segment.description,
              createdAt: segment.createdAt,
              created_by: segment.created_by,
              updatedAt: segment.updatedAt,
              updated_by: segment.updated_by,
              is_active: segment.is_active,
              recipients: [],
            })
          );
        } else {
          toast({
            title: 'Failed to remove all recipients',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: 'Failed to remove all recipients',
          description: 'segment not found',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error('Error removing all recipients', err);
    }
  };

  if (loading) {
    return (
      <Flex justify={'center'} align={'center'} h={'100%'}>
        <Loader />
      </Flex>
    );
  }

  if (!loading && (!recipients || recipients.length === 0)) {
    return (
      <Flex justify={'center'} align={'center'} h={'100%'}>
        <Text color={'text.dark'}>No recipients found</Text>
      </Flex>
    );
  }

  return (
    <Box pb={10} overflow={'hidden'}>
      <Box flex={'1'} overflowY={'auto'} w="90%" mx="auto">
        {loading &&
          [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}
        {!loading && recipients && recipients.length > 0 && (
          <Box maxH="70vh" overflowY="auto">
            <ReactGrid
              key={`grid-${recipients.length}-${recipients.map((r) => r._id).join('-')}`}
              onCellsChanged={handleCellChanges}
              onContextMenu={handleContextMenu}
              enableRowSelection={true}
              stickyTopRows={1}
              rows={rows}
              columns={columns}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default EmailsListViewer;
