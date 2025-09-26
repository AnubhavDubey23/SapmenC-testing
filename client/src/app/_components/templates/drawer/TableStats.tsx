import { ISelectedTemplateState } from '@/store/features/selected-template/selected-template-slice';
import { Table, TableContainer, Tbody, Td, Tr } from '@chakra-ui/react';
import React from 'react';

type TableStatsProps = {
  template: Partial<ISelectedTemplateState>;
};

export default function TableStats({ template }: TableStatsProps) {
  return (
    <TableContainer>
      <Table size="sm" variant="striped">
        <Tbody>
          <Tr>
            <Td color="#6D66C8" fontSize="md" fontWeight="bold">
              Sent To
            </Td>
            <Td>{template.stats?.totalEmails}</Td>
          </Tr>
          <Tr>
            <Td color="#6D66C8" fontSize="md" fontWeight="bold">
              Received
            </Td>
            <Td>{template.stats?.receivedEmails}</Td>
          </Tr>
          <Tr>
            <Td color="#00BA1E" fontSize="md" fontWeight="bold">
              Opened
            </Td>
            <Td>{template.stats?.openedEmails}</Td>
          </Tr>
          <Tr>
            <Td color="#9F0000" fontSize="md" fontWeight="bold">
              Bounced
            </Td>
            <Td>{template.stats?.bouncedEmails}</Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  );
}
