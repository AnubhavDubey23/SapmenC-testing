import { UserNodemailerConfigDTO } from '@/types/config.types';

export const FREE_TIER_MAIL_SERVICE = 'MailerOne';
export const FREE_TIER_EMAIL = 'user@mailerone.in';
export const FREE_TIER_HOST = 'smtp.mailerone.in';
export const FREE_TIER_FORM_FIELDS = [
  {
    name: 'display_name',
    type: 'text',
    segment: 'Display Name',
    placeholder: 'SapMen C.',
  },
];

export const FREE_TIER_INITIAL_MAIL_CONFIG = {
  service: FREE_TIER_MAIL_SERVICE,
  auth: {
    user: FREE_TIER_EMAIL,
    pass: '',
  },
  display_name: '',
  host: '',
};

export const PAID_TIER_EMAIL_SERVICES = [
  {
    id: 1,
    name: 'Gmail',
    value: 'gmail',
  },
  {
    id: 2,
    name: 'Outlook',
    value: 'outlook',
  },
  {
    id: 3,
    name: 'Yahoo',
    value: 'yahoo',
  },
  {
    id: 4,
    name: 'Apple',
    value: 'apple',
  },
  {
    id: 5,
    name: 'Custom',
    value: 'custom',
  },
];

export const PAID_TIER_FORM_FIELDS = [
  {
    name: 'auth.user',
    type: 'email',
    segment: 'Email ID, to send mails',
    placeholder: 'Enter email ID',
  },
  {
    name: 'reply_to',
    type: 'email',
    segment: 'Reply To',
    placeholder: 'Enter reply email ID',
  },
  {
    name: 'display_name',
    type: 'text',
    segment: 'Display Name',
    placeholder: 'tech.sapmenc@gmail.com',
  },
  {
    name: 'auth.pass',
    type: 'password',
    segment: 'SMTP Password',
    placeholder: 'Enter password',
  },
];

export const PAID_TIER_INITIAL_MAIL_CONFIG = {
  service: '',
  auth: {
    user: '',
    pass: '',
  },
  reply_to: '',
  display_name: '',
  host: '',
};

export function isMailConfigured(config: UserNodemailerConfigDTO | null) {
  if (!config) return false;

  const { service, auth, display_name } = config;

  return service !== '' && display_name !== '' && auth.user !== '';
}
