import React, { useState } from 'react';
import GlobalModalWrapper from '../modals/GlobalModalWrapper';
import { FaGoogle, FaYahoo } from 'react-icons/fa';
import { PiMicrosoftOutlookLogo } from 'react-icons/pi';
import { BiSolidCustomize } from 'react-icons/bi';
import {
  Box,
  Flex,
  Text,
  Icon,
  VStack,
  Button,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react';

interface SMTPPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SMTP_EMAIL_PROVIDERS = [
  {
    name: 'GMAIL',
    icon: FaGoogle,
    title:
      'To generate a password for Gmail SMTP, you can create an app password: ',
    content: [
      'Log in to your Google account',
      'Click your profile photo in the top right',
      'Click Manage Google Account',
      'Select Security in the left navigation panel',
      'On the Signing into Google panel, select App passwords',
      'Choose the app and device you want to generate a password for',
      'Click Generate or Generate App Password',
      'Copy the generated password',
    ],
  },
  {
    name: 'OUTLOOK',
    icon: PiMicrosoftOutlookLogo,
    title:
      'To generate an app password for Outlook SMTP, you can do the following:',
    content: [
      'Sign in to your Microsoft account',
      'Go to Security and click Advanced Security Options',
      'Turn on Two-Step Verification in Additional Security',
      'When prompted to set up Microsoft Authenticator, click Cancel',
      'Select Create a new app password',
      'Copy the generated app password and click Done',
      'Paste the app password in the SMTP Password field in the sending account settings',
    ],
  },
  {
    name: 'YAHOO',
    icon: FaYahoo,
    title:
      'To generate a Yahoo SMTP password, you can create an app password for your Yahoo account:',
    content: [
      'Log in to your Yahoo account',
      'Click your profile picture and select Account info',
      'Go to Security',
      'Click Generate app password',
      'Enter a name for the app you\'ll be using the password with',
      'Click Generate password',
    ],
  },
];

const CUSTOM_PROVIDER = {
  name: 'CUSTOM',
  icon: BiSolidCustomize,
  title:
    'To generate SMTP credentials for a custom mail service provider, you can try the following steps:',
  content: [
    'Go to your email settings and enable connection to third-party services',
    'Go to Settings > SMTP settings',
    'Click Create SMTP',
  ],
  formDetails: [
    'SMTP Server',
    'User',
    'Password',
    'Email address',
    'Reply to address',
    'Sender Name',
    'SSL',
    'TLS',
    'Port Number',
    'Set as default for',
    'Description',
  ],
};

type EmailProvider = 'GMAIL' | 'OUTLOOK' | 'YAHOO' | 'CUSTOM';

export default function SMTPPasswordModal({
  isOpen,
  onClose,
}: SMTPPasswordModalProps) {
  const [provider, setProvider] = useState<EmailProvider | null>(null);

  const handleProviderClick = (provider: EmailProvider) => {
    setProvider(provider);
  };

  const selectedProvider =
    provider === 'CUSTOM'
      ? CUSTOM_PROVIDER
      : SMTP_EMAIL_PROVIDERS.find((p) => p.name === provider);

  return (
    <GlobalModalWrapper
      title="SMTP Password Generation"
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
    >
      <VStack spacing={4} align="stretch">
        {provider === null ? (
          <>
            <Text fontSize="xl" fontWeight="bold">
              Select Your Email Provider
            </Text>
            <Flex justifyContent="space-around" wrap="wrap" gap={4}>
              {[...SMTP_EMAIL_PROVIDERS, CUSTOM_PROVIDER].map(
                (providerItem) => (
                  <Box
                    key={providerItem.name}
                    onClick={() =>
                      handleProviderClick(providerItem.name as EmailProvider)
                    }
                    cursor="pointer"
                    p={4}
                    borderRadius="md"
                    bg="gray.100"
                    _hover={{ bg: 'blue.100' }}
                    textAlign="center"
                    width="120px"
                  >
                    <Icon as={providerItem.icon} boxSize={8} mb={2} />
                    <Text>{providerItem.name}</Text>
                  </Box>
                )
              )}
            </Flex>
          </>
        ) : (
          <>
            <EmailProviderContent provider={selectedProvider} />
            <Button
              onClick={() => setProvider(null)}
              colorScheme="blue"
              alignSelf="flex-start"
            >
              Back to providers
            </Button>
          </>
        )}
      </VStack>
    </GlobalModalWrapper>
  );
}

interface EmailProviderContentProps {
  provider:
    | (typeof SMTP_EMAIL_PROVIDERS)[0]
    | typeof CUSTOM_PROVIDER
    | undefined;
}

function EmailProviderContent({ provider }: EmailProviderContentProps) {
  if (!provider) return null;

  return (
    <Box p={4} borderRadius="md" bg="gray.50">
      <Text fontSize="xl" fontWeight="bold" mb={2}>
        {provider.title}
      </Text>
      <VStack align="start" spacing={2}>
        {provider.content.map((step, index) => (
          <Text key={index}>
            {index + 1}. {step}
          </Text>
        ))}
        {provider.name === 'CUSTOM' && (
          <>
            <Text fontWeight="bold" mt={4}>
              Fill out the form with the following details:
            </Text>
            <UnorderedList pl={4}>
              {CUSTOM_PROVIDER.formDetails.map((detail, index) => (
                <ListItem key={index}>{detail}</ListItem>
              ))}
            </UnorderedList>
          </>
        )}
      </VStack>
    </Box>
  );
}
