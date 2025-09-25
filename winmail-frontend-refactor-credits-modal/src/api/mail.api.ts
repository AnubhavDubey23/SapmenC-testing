import { API_URL } from '.';

const MAIL_API_ENPOINTS = {
  SEND_MAIL: (query: string) => `${API_URL}/mails`,
} as const;

export default MAIL_API_ENPOINTS;
