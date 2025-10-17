import { useAppSelector } from '@/store';
import { Box, Flex, VStack } from '@chakra-ui/react';
import React, { useMemo } from 'react';
import useGetTemplate from '@/hooks/template/useGetTemplate';
import { Reader } from '@usewaypoint/email-builder';
import { TReaderDocument } from '@usewaypoint/email-builder';
import Loader from '../loaders/Loader';

const EmailTemplateViewer = () => {
  const { loading } = useGetTemplate();

  const { email_data } = useAppSelector((state) => state.selectedTemplate);

  // IMPORTANT: Call hooks unconditionally on every render to avoid
  // "Rendered fewer hooks than expected" errors when the component
  // sometimes early-returns.
  const normalizedDocument = useMemo<TReaderDocument | null>(() => {
    if (!email_data || Object.keys(email_data).length === 0) return null;
    try {
      const doc: TReaderDocument = JSON.parse(
        JSON.stringify(email_data as TReaderDocument)
      );
      const ensurePngAvatarUrl = (url: string) => {
        if (!url) return url;
        try {
          const u = new URL(url);
          if (u.hostname.includes('ui-avatars.com')) {
            if (u.searchParams.get('format') !== 'png') {
              u.searchParams.set('format', 'png');
            }
            return u.toString();
          }
        } catch {}
        return url;
      };

      Object.keys(doc).forEach((key) => {
        const node: any = (doc as any)[key];
        if (node && node.type === 'Avatar') {
          const current = node?.data?.props?.imageUrl as string | undefined;
          const alt = (node?.data?.props?.alt as string | undefined) ?? 'Avatar';
          const shape = (node?.data?.props?.shape as string | undefined) ?? 'circle';
          const size = (node?.data?.props?.size as number | undefined) ?? 64;
          const url = typeof current === 'string' ? ensurePngAvatarUrl(current) : '';

          // Replace Avatar block with an Html block using a plain <img>,
          // which renders consistently across email clients
          const borderRadius =
            shape === 'circle' ? '50%' : shape === 'rounded' ? '12px' : '0';
          const contents = `<img src="${url}" alt="${alt}" width="${size}" height="${size}" style="display:block;border-radius:${borderRadius};" />`;

          const prevStyle = node?.data?.style ?? {};
          (doc as any)[key] = {
            type: 'Html',
            data: {
              style: {
                fontSize: 16,
                textAlign: prevStyle.textAlign ?? null,
                padding: prevStyle.padding ?? { top: 0, right: 0, bottom: 0, left: 0 },
              },
              props: { contents },
            },
          };
        }
      });
      return doc;
    } catch {
      return (email_data as TReaderDocument) ?? null;
    }
  }, [email_data]);

  if (loading) {
    return (
      <Flex justify={'center'} align={'center'} h={'100%'}>
        <Loader />
      </Flex>
    );
  }

  if (!email_data || Object.keys(email_data).length === 0) {
    return (
      <Flex justify={'center'} align={'center'} h={'100%'}>
        {'Select a template to view'}
      </Flex>
    );
  }

  return (
    <Box flex={'1'} overflowY={'auto'}>
      <VStack spacing={4} align="stretch">
        <Reader document={(normalizedDocument as TReaderDocument)} rootBlockId="root" />
      </VStack>
    </Box>
  );
};

export default EmailTemplateViewer;
