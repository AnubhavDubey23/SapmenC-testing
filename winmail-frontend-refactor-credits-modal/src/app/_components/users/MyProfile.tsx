import { Tab, TabList, TabPanel, TabPanels, Tabs, Button, Flex,Image,useDisclosure } from '@chakra-ui/react';
import UserProfile from './UserProfile';
import { useMemo, useState } from 'react';
import { Billing } from './billing/Billing';
import { AccountHistory } from './account-history/AccountHistory';
import { CreditsPurchaseModal } from './CreditsPurchaseModal';


interface MyProfileProps {
  onClose: () => void;
  setProfilePicture: (image: string) => Promise<void>;
  profilePicture: string | null;
  onOpenPaymentModal?: () => void;
}

export function MyProfile(props: MyProfileProps) {
  const [activeTabIndex, setActiveTabIndex] = useState(0); // Track which tab is active
  const [billingMode, setBillingMode] = useState<'plans' | 'credits'>('plans'); // Track billing sub-mode

  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const PROFILE_TABS = useMemo(
    () => [
      {
        name: 'My Profile',
        component: <UserProfile {...props} />,
      },
      {
        name: 'Billing',
        component: <Billing onModeChange={setBillingMode} />, // Pass callback to Billing
      },
      {
        name: 'Activity History',
        component: <AccountHistory />,
      },
    ],
    [props]
  );

  // Decide button text based on billing mode
  const renderButton = () => {
    if (activeTabIndex !== 1) return null; // Show only on Billing tab
    return (
      <Button
        colorScheme='green'
        borderRadius={"15px"}
        ml="auto"
        mx={3}
        onClick={() => {
          if (billingMode === 'plans') {
            console.log('Upgrade Plan clicked');
          } else {
            onOpen();
          }
        }}
        leftIcon={
          billingMode !== "plans" ? (
            <Image src="/add.svg" alt="add" boxSize="18px" />
          ) : undefined
        }
      >
        {billingMode === 'plans' ? 'Upgrade Plan' : 'Purchase Credits'}
      </Button>
    );
  };

  return (
    <>
      <CreditsPurchaseModal
        isOpen={isOpen}
        onClose={onClose}
        onOpenPaymentModal={props.onOpenPaymentModal}
      />
      <Tabs index={activeTabIndex} onChange={(i) => setActiveTabIndex(i)}>
        <Flex align="center" justify="space-between" mb={4}>
          <TabList
            bg="#E2E2E2"
            borderRadius="20px"
            p="2px"
            w="100%"              // make TabList stretch full width
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex>
              {PROFILE_TABS.map((tab) => (
                <Tab
                  key={tab.name}
                  _selected={{ color: 'purple.500' }}
                  color="#666666"
                  _focus={{ boxShadow: 'none' }}
                  px={6}
                  py={3}
                  fontWeight="semibold"
                >
                  {tab.name}
                </Tab>
              ))}
            </Flex>
          

          {renderButton()}
          </TabList>
        </Flex>

        <TabPanels>
          {PROFILE_TABS.map((tab) => (
            <TabPanel key={tab.name}>{tab.component}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </>
  );
}
