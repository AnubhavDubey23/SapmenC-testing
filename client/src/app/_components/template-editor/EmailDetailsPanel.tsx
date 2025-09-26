import { useAppDispatch, useAppSelector } from '@/store';
import { Box, Button, Input, Text, Textarea, useToast } from '@chakra-ui/react';
import React, { ChangeEvent, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Select } from 'chakra-react-select';
import usesegments from '@/hooks/segment/usesegments';
import useSendMail from '@/hooks/useSendMail';
import useUpdateTemplate from '@/hooks/template/useUpdateTemplate';
import { IoSendSharp } from 'react-icons/io5';
import { openTemplateEditor } from '@/store/features/template-editor/template-editor-slice';
import { setActiveTemplate } from '@/store/features/selected-template/selected-template-slice';
import NodemailerConfigForm from '../client-nodemailer-config/NodemailerConfigForm';
import GlobalModalWrapper from '../modals/GlobalModalWrapper';
import useMe from '@/hooks/auth/useMe';
import { UserNodemailerConfigDTO } from '@/types/config.types';
import { isMailConfigured } from '@/utils/plans';
import useTemplates from '@/hooks/template/useTemplates';
import { LoadingModal } from '../modals/LoadingModal';
import { Attachments } from './Attachments';
import { Tsegment } from '@/types/segment.types';

const EmailDetailsPanel = () => {
  const { loading: segmentsLoading, segments } = usesegments();
  const { loading, sendMail } = useSendMail();
  const { loading: templateUpdateLoading, updateTemplate } =
    useUpdateTemplate();
  const [selectedsegmentIds, setSelectedsegmentIds] = useState<string[]>([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const toast = useToast();
  const { loading: userLoading, getUser } = useMe();
  const { getAllTemplates: refetch } = useTemplates();
  const [mailConfig, setMailConfig] = useState<UserNodemailerConfigDTO | null>(
    null
  );
  const [attachments, setAttachments] = useState<File[]>([]);

  const dispatch = useAppDispatch();
  const selectedTemplateState = useAppSelector(
    (state) => state.selectedTemplate
  );
  const { subject, name, createdAt } = useAppSelector(
    (state) => state.selectedTemplate
  );

  const segmentOptions = segments
    .filter((segment: Tsegment) => segment?.recipients?.length > 0)
    .map((segment: Tsegment) => ({
      segment: segment.name,
      value: segment._id,
    }));

  useEffect(() => {
    async function getMailConfig() {
      try {
        const res = await getUser();
        if (res) {
          setMailConfig(res.data?.nodemailer_config as UserNodemailerConfigDTO);
        }
      } catch (error) {
        console.error('Failed to fetch mail config:', error);
        toast({
          title: 'Failed to load email config',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }

    getMailConfig();
  }, []);

  const handleAttachmentsChange = (files: File[]) => {
    const MAX_SIZE_MB = 25;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    const totalAttachmentSize = files.reduce((sum, file) => sum + file.size, 0);

    if (totalAttachmentSize > MAX_SIZE_BYTES) {
      toast({
        title: 'Attachments size limit exceeded!',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setAttachments(files);
  };

  const handleRemoveAttachment = (idx: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handlesegmentChange = (selectedOptions: any) => {
    setSelectedsegmentIds(selectedOptions.map((option: any) => option.value));
  };

  const handleSendMail = async () => {
    try {
      if (!isMailConfigured(mailConfig)) {
        setShowSettingsModal(true);
        return;
      }

      let segmentIds = selectedsegmentIds.join(',');

      const res = await sendMail({
        templateId: selectedTemplateState.templateId,
        segmentIds: segmentIds,
        attachments,
      });

      if (res) {
        //Should assign trigger to true | bug
        dispatch(
          setActiveTemplate({
            ...selectedTemplateState,
            is_triggered: true,
          })
        );

        dispatch(
          openTemplateEditor({
            isOpen: false,
            inspectorDrawerOpen: false,
          })
        );
        await refetch();
      }
    } catch (err: any) {
      console.error('Error while sending mail', err);
    }
  };

  const handleUpdateSubject = async (e: any) => {
    try {
      const res = await updateTemplate({
        subject: e.target.value,
      });
      if (res) {
        dispatch(
          setActiveTemplate({
            ...selectedTemplateState,
            subject: e.target.value,
          })
        );
      }
    } catch (err: any) {}
  };

  if (loading) {
    return <LoadingModal isOpen={loading} onClose={() => {}} />;
  }

  return (
    <>
      <GlobalModalWrapper
        isOpen={showSettingsModal}
        onClose={() => {
          setShowSettingsModal(false);
        }}
        title="Settings"
        size="5xl"
      >
        <NodemailerConfigForm onClose={() => {}} />
      </GlobalModalWrapper>
      <Box w="100%">
        <Box my={2}>
          <Text my={2}>{'Subject'}</Text>
          <Textarea
            color={'text.light'}
            defaultValue={subject}
            borderColor={'#6D66C8'}
            onBlur={handleUpdateSubject}
            sx={{
              '&:focus': {
                borderColor: '#6D66C8',
                boxShadow: '0 0 0 1px #6D66C8',
              },
            }}
          />
        </Box>
        <Box my={2}>
          <Text my={2}>{'Segments'}</Text>
          <Box>
            <Select
              isMulti={true}
              colorScheme="purple"
              options={segmentOptions}
              value={segmentOptions.filter((option) =>
                selectedsegmentIds.includes(option.value)
              )}
              onChange={handlesegmentChange}
            />
          </Box>
        </Box>

        <Attachments
          onChangeAttachments={handleAttachmentsChange}
          onRemoveAttachment={handleRemoveAttachment}
          attachments={attachments}
        />

        <Box my={2}>
          <Text my={2}>{'Template Name:'}</Text>
          <Text color={'text.light'}>{name}</Text>
        </Box>
        <Box my={2}>
          <Text my={2}>{'Created On:'}</Text>
          <Text color={'text.light'}>
            {dayjs(createdAt).format('MMMM D, YYYY')}
          </Text>
        </Box>
        <Box my={2}>
          <Button
            borderRadius="20px"
            p="5"
            bgGradient="linear(to-r, #6D66C8, #221E5A)"
            color="white"
            fontSize="16px"
            fontWeight="bold"
            _hover={{
              bgGradient: 'linear(to-r, #5D56B8, #121040)',
            }}
            onClick={handleSendMail}
            rightIcon={<IoSendSharp />}
          >
            {'Send'}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default EmailDetailsPanel;
