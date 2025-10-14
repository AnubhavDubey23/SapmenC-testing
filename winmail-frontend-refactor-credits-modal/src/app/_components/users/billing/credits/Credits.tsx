import React, { useMemo } from 'react';
import { makeCreditCols } from './creditCols';
import { DataTable } from '@/app/_components/common/data-table/DataTable';
import { TTransaction } from '@/types/transaction.types';
import { transformTransactionsToCredits } from '@/utils/billing';
import { Flex, Image, Text, VStack, HStack } from '@chakra-ui/react';
import useMe from '@/hooks/auth/useMe';

interface CreditsProps {
  data: TTransaction[];
  loading: boolean;
}

export function Credits({ data, loading }: CreditsProps) {
  const columns = useMemo(() => makeCreditCols(), []);

  const creditsHistory = transformTransactionsToCredits(data);

  const { user, device } = useMe();

  return (
    <>
      <Flex align="center" justify="center" gap={3}>
        <VStack spacing={0}>
          <Text
            fontSize="xl"
            lineHeight="100%"
            letterSpacing="0"
            color={'#666666'}
          >
            Credit Balance
          </Text>
          <HStack spacing={3} mb={3}>
            <Image
              src="/payment/credits_2.0.svg"
              alt="Credits"
              boxSize="60px"
            />
            <Text
              fontSize="3xl"
              fontWeight="bold"
              lineHeight="100%"
              letterSpacing="0"
              color={'#666666'}
            >
              {user?.credits.toFixed(2)}
            </Text>
          </HStack>
        </VStack>
      </Flex>
      <DataTable columns={columns} data={creditsHistory} loading={loading} />
    </>
  );
}
