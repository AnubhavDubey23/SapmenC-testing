import usesegments from '@/hooks/segment/usesegments';
import useTemplates from '@/hooks/template/useTemplates';
import useSendMail from '@/hooks/useSendMail';
import { useAppSelector } from '@/store';
import { TTemplate } from '@/types/template.types';
import { Box, Button, Flex } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useTranslation } from '../../../../node_modules/react-i18next';

interface Props {
  onClose: () => void;
  source: string;
}

const MailSenderForm: React.FC<Props> = ({ onClose, source }) => {
  const { loading, sendMail } = useSendMail();
  const { t } = useTranslation();

  const { loading: segmentsLoading, segments } = usesegments();
  const { loading: templatesLoading, templates } = useTemplates();

  const selectedTemplate = useAppSelector((state) => state.selectedTemplate);
  const selectedsegment = useAppSelector((state) => state.selectedsegment);

  const [template_to_trigger, set_template_to_trigger] = useState<any>(null);
  const [selectedsegmentIds, setSelectedsegmentIds] = useState<string[]>([]);

  let segmentIds = '';
  const handleSendMail = async () => {
    if (source === 'segment') {
      segmentIds = selectedsegment.segmentId;
    } else {
      segmentIds = selectedsegmentIds.join(',');
    }
    const res = await sendMail({
      templateId: template_to_trigger
        ? template_to_trigger
        : selectedTemplate.templateId,
      segmentIds: segmentIds,
      attachments: [],
    });
    if (res) {
      onClose();
    }
  };
  if (loading || segmentsLoading) {
    return <Box>{'Loading'}...</Box>;
  }

  return (
    <Box color={'text.dark'}>
      {source === 'segment' &&
        templates
          ?.filter((template: TTemplate) => !template.is_triggered)
          ?.map((template: TTemplate, idx: number) => {
            return (
              <Box
                key={template._id + idx}
                onClick={() => {
                  set_template_to_trigger(template);
                }}
                cursor="pointer"
                p={2}
                bgColor={
                  template_to_trigger?._id === template._id
                    ? 'text.dark'
                    : 'white'
                }
                color={
                  template_to_trigger?._id === template._id
                    ? 'white'
                    : 'text.dark'
                }
                border="1px solid text.dark"
                borderRadius="5px"
                m={2}
              >
                {template.name}
              </Box>
            );
          })}
      {source === 'template' &&
        segments?.map((segment: any) => {
          return (
            <Box
              key={segment._id}
              onClick={() => {
                if (selectedsegmentIds.includes(segment._id)) {
                  setSelectedsegmentIds(
                    selectedsegmentIds.filter((id) => id !== segment._id)
                  );
                } else {
                  setSelectedsegmentIds([...selectedsegmentIds, segment._id]);
                }
              }}
              cursor="pointer"
              p={2}
              bgColor={
                selectedsegmentIds.includes(segment._id) ? 'text.dark' : 'white'
              }
              color={
                selectedsegmentIds.includes(segment._id) ? 'white' : 'text.dark'
              }
              border="1px solid text.dark"
              borderRadius="5px"
              m={2}
            >
              {segment.name}
            </Box>
          );
        })}

      <Flex justifyContent="center" mt={6}>
        <Button
          px="12"
          bgColor="text.dark"
          color="white"
          fontSize="xl"
          borderRadius="lg"
          fontWeight="bold"
          m={2}
          onClick={handleSendMail}
        >
          {t('Send Mail')}
        </Button>
      </Flex>
    </Box>
  );
};

export default MailSenderForm;
