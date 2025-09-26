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
import Loader from '../loaders/Loader';
import { useAppDispatch } from '@/store';
import { setActivesegment } from '@/store/features/selected-segment/selected-segment-slice';

interface Recipients {
  name: string;
  email: string;
}

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

const getRows = (recipients: Partial<Recipients>[] = []): Row[] => [
  headerRow,
  ...recipients.map<Row>((r, idx) => ({
    rowId: idx.toString(),
    cells: [
      {
        type: 'text',
        text: r.name!,
        nonEditable: false,
      },
      {
        type: 'text', // Changed from "email" to "text" since ReactGrid does not have "email" type
        text: r.email!,
        nonEditable: false,
      },
    ],
    height: 30,
    reorderable: false,
  })),
];

const applyChangesToRecipients = (
  changes: CellChange<TextCell>[],
  prevRecipients: Partial<Recipients>[]
): Partial<Recipients>[] => {
  const updatedRecipients = [...prevRecipients];

  changes.forEach((change) => {
    const recipientIndex = parseInt(change.rowId as string);
    const fieldName = change.columnId as keyof Recipients;
    if (updatedRecipients[recipientIndex]) {
      updatedRecipients[recipientIndex] = {
        ...updatedRecipients[recipientIndex],
        [fieldName]: change.newCell.text,
      };
    }
  });

  return updatedRecipients;
};

interface EmailsListViewerProps {
  recipients: object[];
}

const EmailsListViewer = ({ recipients }: EmailsListViewerProps) => {
  const toast = useToast();
  const dispatch = useAppDispatch();

  const { loading, segment, refetch } = useGetsegment();

  const { updatesegment } = useUpdatesegment();

  const rows = getRows(recipients);
  const columns = getColumns();

  const handleCellChanges = async (changes: CellChange[]) => {
    if (segment) {
      const updatedRecipients = applyChangesToRecipients(
        changes as CellChange<TextCell>[],
        recipients
      );

      try {
        const res = await updatesegment({
          segmentId: segment._id,
          recipients: updatedRecipients,
        });
        if (res) {
          toast({
            title: 'Recipients updated successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          const res = await refetch(); // Refresh the data
        } else {
          throw new Error('Update failed');
        }
      } catch (error) {
        toast({
          title: 'Failed to update recipients',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: 'Failed to update recipients',
        description: 'segment not found',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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
                (_: any, idx: number) =>
                  !selectedRowIds.includes(idx.toString())
              );
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
                toast({
                  title: 'Failed to remove person',
                  status: 'error',
                  duration: 3000,
                  isClosable: true,
                });
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
        const res = await updatesegment({ segmentId: segment._id, recipients: [] });
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
