import { TFeature } from '@/types/feature.types';

export const FEATURES: TFeature[] = [
  {
    id: 'email-templates',
    name: 'Email Templates',
    description: 'Number of email templates that can be made',
    access: {
      type: 'limit',
      limits: {
        free: 3,
        starter: Infinity,
        pro: Infinity,
        enterprise: Infinity,
      },
    },
  },
  {
    id: 'contacts',
    name: 'Contacts',
    description: 'Number of contacts that can be made',
    access: {
      type: 'limit',
      limits: {
        free: 3000,
        starter: 10000,
        pro: Infinity,
        enterprise: Infinity,
      },
    },
  },
  {
    id: 'custom-email-config',
    name: 'Custom Email Config',
    description: 'Configure custom email config that display on sent mails',
    access: {
      type: 'tier',
      minimumTier: 'starter',
    },
  },
  {
    id: 'responsive-preview',
    name: 'Responsive preview',
    description: 'Responsive preview of emails on different device sizes',
    access: {
      type: 'tier',
      minimumTier: 'pro',
    },
  },
  {
    id: 'output-formats',
    name: 'Output formats',
    description: 'Different output formats such as HTML and JSON are available',
    access: {
      type: 'tier',
      minimumTier: 'pro',
    },
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Analytics for email tracking',
    access: {
      type: 'tier',
      minimumTier: 'pro',
    },
  },
  {
    id: 'import-json-template',
    name: 'Import JSON template',
    description: 'Import email templates in JSON',
    access: {
      type: 'tier',
      minimumTier: 'pro',
    },
  },
  {
    id: 'custom-domain-deployment',
    name: 'Custom domain deployment',
    description: 'Deploying on custom domain',
    access: {
      type: 'tier',
      minimumTier: 'enterprise',
    },
  },
];
