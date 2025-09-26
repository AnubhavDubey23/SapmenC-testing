import { TAccountHistoryData } from '@/types/activity-log.types';
import {
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import dayjs from 'dayjs';

interface ActivityDrawerProps {
  onClose: () => void;
  isOpen: boolean;
  activity: TAccountHistoryData;
}

export function ActivityDrawer({
  onClose,
  isOpen,
  activity,
}: ActivityDrawerProps) {
  return (
    <Drawer onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerHeader color={'purple.500'} >Activity Type</DrawerHeader>
         <Divider width={'90%'} mx={'auto'} mb={3} borderBottomWidth={2} borderColor={'#C7C7C7'}/>
        <DrawerBody px={3}  >
          <VStack>
            <Text w={'100%'} color={'purple.500'} gap={2} display={'flex'}> Resource Type:< Text color={'black'}> {activity.resourceType}</Text></Text>
            <Text w={'100%'}  color={'purple.500'} gap={2} display={'flex'}> ID: < Text color={'black'}  > {activity.resourceId}</Text></Text>
            <Text w={'100%'}  color={'purple.500'} gap={2} display={'flex'}>Action: < Text color={'black'}>{activity.actionType}</Text></Text>
            <Text w={'100%'}  color={'purple.500'} gap={2} display={'flex'}>Status: < Text color={'black'}>{activity.status}</Text></Text>
            <Text w={'100%'}  color={'purple.500'} gap={2} display={'flex'}>
              Created At:< Text color={'black'}> {dayjs(activity.createdAt).format('DD MMM YYYY')}
            </Text></Text>
            <Text w={'100%'}  color={'purple.500'} gap={2} display={'flex'}>
              Updated At:< Text color={'black'}> {dayjs(activity.updatedAt).format('DD MMM YYYY')}</Text>
            </Text>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
