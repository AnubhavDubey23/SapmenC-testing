import { ISelectedTemplateState } from '@/store/features/selected-template/selected-template-slice';
import { Table, TableContainer, Tbody, Td, Tr } from '@chakra-ui/react';
import React from 'react';

type TableStatsProps = {
  template: Partial<ISelectedTemplateState>;
};

export default function TableStats({ template }: TableStatsProps) {
  const stats = (template.stats || {}) as any;
  const totalEmails = Number(stats.totalEmails ?? 0);
  const receivedEmails = Number(
    stats.receivedEmails ?? stats.recievedEmails ?? 0
  );
  const openedEmails = Number(stats.openedEmails ?? 0);
  const bouncedEmails = Number(stats.bouncedEmails ?? stats.bouncedMails ?? 0);
  return (
    <TableContainer>
      <Table size="sm" variant="striped">
        <Tbody>
          <Tr>
            <Td color="#6D66C8" fontSize="md" fontWeight="bold">
              Sent To
            </Td>
            <Td>{totalEmails}</Td>
          </Tr>
          <Tr>
            <Td color="#6D66C8" fontSize="md" fontWeight="bold">
              Received
            </Td>
            <Td>{receivedEmails}</Td>
          </Tr>
          <Tr>
            <Td color="#00BA1E" fontSize="md" fontWeight="bold">
              Opened
            </Td>
            <Td>{openedEmails}</Td>
          </Tr>
          <Tr>
            <Td color="#9F0000" fontSize="md" fontWeight="bold">
              Bounced
            </Td>
            <Td>{bouncedEmails}</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}
