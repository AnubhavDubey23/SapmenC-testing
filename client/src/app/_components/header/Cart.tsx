import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  Box,
} from '@chakra-ui/react';
import OrderSummary from './OrderSummary';
import { Plan } from './Plan';
import { planFeaturesMap } from '@/utils/plan-features';

interface CartProps {
  plan: any;
  isOpen: boolean;
  onClose: () => void;
}

export function Cart({ plan, isOpen, onClose }: CartProps) {
  const maxPoints =
    planFeaturesMap.get(plan.item.name.toLowerCase())?.length || 0;

  return (
    <Modal onClose={onClose} isOpen={isOpen} size="full">
      <ModalOverlay />
      <ModalContent margin={0} rounded="none" height="100vh" bg="gray.50">
        <ModalHeader
          fontSize="3xl"
          fontWeight="bold"
          color="purple.500"
          py={6}
          px={8}
        >
          Your Cart
        </ModalHeader>
        <ModalCloseButton top={6} right={8} />
        <ModalBody p={8}>
          <Flex
            direction={['column', 'column', 'row']}
            gap={8}
            maxW="1200px"
            margin="0 auto"
            height="100%"
            alignItems="flex-start"
          >
            <Box flex={1}>
              <Plan
                plan={plan}
                maxPoints={maxPoints}
                handleClick={() => {}}
                index={0}
                showButton={false}
              />
            </Box>
            <Box flex={1}>
              <OrderSummary 
                plan={plan} 
                onClose={onClose} 
              />
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
